import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import { config } from '../config/env';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export interface ExtractedActionItem {
  title: string;
  description?: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface QualityMetrics {
  overallScore: number;
  engagement: number;
  clarity: number;
  actionability: number;
  participation: number;
  feedback: string;
  improvements: string[];
}

export interface SentimentPoint {
  timestamp: string;
  score: number;
  label: 'negative' | 'neutral' | 'positive';
  speaker?: string;
  topic?: string;
}

export interface Decision {
  text: string;
  madeBy?: string;
  timestamp?: string;
  impact: 'low' | 'medium' | 'high';
  status: 'proposed' | 'confirmed' | 'rejected';
}

export interface Conflict {
  topic: string;
  participants: string[];
  timestamp: string;
  severity: 'minor' | 'moderate' | 'serious';
  resolution?: string;
}

export interface PreMeetingContext {
  previousDecisions: string[];
  outstandingActionItems: string[];
  relatedMeetings: string[];
  keyPeople: string[];
}

export async function transcribeAudio(filePath: string, mimeType: string): Promise<string> {
  const audioBuffer = fs.readFileSync(filePath);
  const base64Audio = audioBuffer.toString('base64');

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: base64Audio,
      },
    },
    'Transcribe this audio recording completely and accurately. Include speaker labels if you can distinguish different speakers (e.g., Speaker 1, Speaker 2). Output only the transcription text, no commentary.',
  ]);

  return result.response.text();
}

export async function generateSummary(transcript: string): Promise<string> {
  const prompt = `You are a meeting assistant. Summarize the following meeting transcript concisely.
Highlight key decisions, discussion points, and outcomes.
Keep it well-structured with bullet points where appropriate.

Transcript:
${transcript}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function extractActionItems(transcript: string): Promise<ExtractedActionItem[]> {
  const prompt = `You are a meeting assistant. Extract all action items from the following meeting transcript.
Return a JSON array with objects containing:
- "title": short action item title
- "description": brief description (optional)
- "assignee": person responsible if mentioned (optional)
- "priority": "low", "medium", or "high" based on urgency

Return ONLY the JSON array, no other text or markdown formatting.

Transcript:
${transcript}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');

  try {
    const items = JSON.parse(cleaned);
    if (!Array.isArray(items)) return [];
    return items.map((item: any) => ({
      title: item.title || 'Untitled action item',
      description: item.description || undefined,
      assignee: item.assignee || undefined,
      priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium',
    }));
  } catch {
    return [];
  }
}

// Meeting Quality Score - AI Meeting Coach feature
export async function analyzeMeetingQuality(
  transcript: string,
  duration: number,
  actionItemsCount: number,
  participants: string[]
): Promise<QualityMetrics> {
  const prompt = `Analyze this meeting transcript and provide a detailed quality assessment. Consider:
1. Engagement: Were participants actively engaged and contributing?
2. Clarity: Was the discussion clear, focused, and easy to follow?
3. Actionability: Did the meeting result in clear action items and next steps?
4. Participation: Was participation balanced among attendees?

Provide scores (0-100) and detailed feedback.

Return ONLY this JSON structure:
{
  "overallScore": number,
  "engagement": number,
  "clarity": number,
  "actionability": number,
  "participation": number,
  "feedback": "brief overall assessment",
  "improvements": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Duration: ${Math.round(duration / 60)} minutes
Participants: ${participants.length}
Action Items Count: ${actionItemsCount}

Transcript:
${transcript.substring(0, 8000)}`; // Limit transcript length

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const metrics = JSON.parse(cleaned);
    
    return {
      overallScore: Math.min(100, Math.max(0, metrics.overallScore || 70)),
      engagement: Math.min(100, Math.max(0, metrics.engagement || 70)),
      clarity: Math.min(100, Math.max(0, metrics.clarity || 70)),
      actionability: Math.min(100, Math.max(0, metrics.actionability || 70)),
      participation: Math.min(100, Math.max(0, metrics.participation || 70)),
      feedback: metrics.feedback || 'Meeting analysis complete',
      improvements: metrics.improvements || ['Consider setting clearer agendas', 'Allocate speaking time more evenly'],
    };
  } catch {
    // Fallback scoring if AI fails
    return calculateFallbackQuality(transcript, duration, actionItemsCount, participants);
  }
}

function calculateFallbackQuality(
  transcript: string,
  duration: number,
  actionItemsCount: number,
  participants: string[]
): QualityMetrics {
  const wordCount = transcript.split(/\s+/).length;
  const wordsPerMinute = duration > 0 ? (wordCount / (duration / 60)) : 0;
  
  // Engagement based on conversation density
  const engagement = Math.min(100, Math.round(wordsPerMinute * 3));
  
  // Clarity based on question marks and action words
  const questions = (transcript.match(/\?/g) || []).length;
  const clarity = Math.min(100, 60 + questions * 2);
  
  // Actionability based on action items per 10 minutes
  const actionability = Math.min(100, 50 + actionItemsCount * 15);
  
  // Participation based on speaker diversity
  const participation = Math.min(100, participants.length * 20);
  
  const overall = Math.round((engagement + clarity + actionability + participation) / 4);
  
  return {
    overallScore: overall,
    engagement,
    clarity,
    actionability,
    participation,
    feedback: overall > 75 ? 'Good meeting efficiency' : 'Meeting could be more focused',
    improvements: [
      'Consider setting a clear agenda beforehand',
      'Try to keep meetings under 30 minutes when possible',
      'Ensure all participants have a chance to speak',
    ],
  };
}

// Sentiment Timeline Analysis
export async function analyzeSentiment(transcript: string): Promise<SentimentPoint[]> {
  const prompt = `Analyze the emotional tone and sentiment throughout this meeting transcript.
Break it into segments and identify:
1. Sentiment score (-1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive)
2. Label: negative, neutral, or positive
3. Speaker if identifiable
4. Topic being discussed

Return a JSON array with objects:
{
  "timestamp": "approximate time or segment indicator (e.g., "0:05", "0:15")",
  "score": number,
  "label": "negative" | "neutral" | "positive",
  "speaker": "Speaker Name or null",
  "topic": "brief topic description"
}

Provide 5-10 data points distributed throughout the meeting.

Transcript:
${transcript.substring(0, 10000)}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const points = JSON.parse(cleaned);
    
    if (Array.isArray(points)) {
      return points.map((p: any) => ({
        timestamp: p.timestamp || '0:00',
        score: Math.max(-1, Math.min(1, p.score || 0)),
        label: ['negative', 'neutral', 'positive'].includes(p.label) ? p.label : 'neutral',
        speaker: p.speaker || undefined,
        topic: p.topic || undefined,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

// Decision Registry - Extract Decisions
export async function extractDecisions(transcript: string): Promise<Decision[]> {
  const prompt = `Extract all decisions, agreements, or conclusions made during this meeting.
For each decision identify:
1. The decision text (what was decided)
2. Who made/proposed it (if mentioned)
3. Impact level: low, medium, or high
4. Status: proposed (mentioned but not confirmed), confirmed (agreed upon), or rejected

Return ONLY a JSON array:
[{
  "text": "decision description",
  "madeBy": "person name or null",
  "timestamp": "approximate time or null",
  "impact": "low" | "medium" | "high",
  "status": "proposed" | "confirmed" | "rejected"
}]

Transcript:
${transcript.substring(0, 8000)}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const decisions = JSON.parse(cleaned);
    
    if (Array.isArray(decisions)) {
      return decisions.map((d: any) => ({
        text: d.text || 'Unnamed decision',
        madeBy: d.madeBy || undefined,
        timestamp: d.timestamp || undefined,
        impact: ['low', 'medium', 'high'].includes(d.impact) ? d.impact : 'medium',
        status: ['proposed', 'confirmed', 'rejected'].includes(d.status) ? d.status : 'proposed',
      }));
    }
    return [];
  } catch {
    return [];
  }
}

// Conflict Detector
export async function detectConflicts(transcript: string): Promise<Conflict[]> {
  const prompt = `Analyze this meeting transcript for any disagreements, conflicts, or tension points.
Identify:
1. Topic of disagreement
2. People involved (speakers who disagreed)
3. Severity: minor (brief disagreement), moderate (sustained disagreement), or serious (strong conflict)
4. How it was resolved (if mentioned)

Return a JSON array. If no conflicts found, return empty array []:
[{
  "topic": "what was disagreed about",
  "participants": ["Person 1", "Person 2"],
  "timestamp": "approximate time or null",
  "severity": "minor" | "moderate" | "serious",
  "resolution": "how it was resolved or null"
}]

Transcript:
${transcript.substring(0, 8000)}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const conflicts = JSON.parse(cleaned);
    
    if (Array.isArray(conflicts)) {
      return conflicts.map((c: any) => ({
        topic: c.topic || 'Unknown topic',
        participants: Array.isArray(c.participants) ? c.participants : [],
        timestamp: c.timestamp || undefined,
        severity: ['minor', 'moderate', 'serious'].includes(c.severity) ? c.severity : 'minor',
        resolution: c.resolution || undefined,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

// Pre-Meeting Intelligence
export async function generatePreMeetingContext(
  meetingTitle: string,
  participants: string[],
  recentMeetingSummaries: string[]
): Promise<PreMeetingContext> {
  const prompt = `Given a new meeting with title "${meetingTitle}" and participants ${participants.join(', ')},
and these recent meeting summaries from the team:
${recentMeetingSummaries.map((s, i) => `${i + 1}. ${s.substring(0, 500)}`).join('\n\n')}

Generate a pre-meeting intelligence brief with:
1. Previous decisions relevant to this meeting
2. Outstanding action items that should be discussed
3. Related meeting topics from recent history
4. Key people who should be consulted

Return ONLY this JSON structure:
{
  "previousDecisions": ["decision 1", "decision 2"],
  "outstandingActionItems": ["action 1", "action 2"],
  "relatedMeetings": ["topic 1", "topic 2"],
  "keyPeople": ["person 1", "person 2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const context = JSON.parse(cleaned);
    
    return {
      previousDecisions: context.previousDecisions || [],
      outstandingActionItems: context.outstandingActionItems || [],
      relatedMeetings: context.relatedMeetings || [],
      keyPeople: context.keyPeople || [],
    };
  } catch {
    return {
      previousDecisions: [],
      outstandingActionItems: [],
      relatedMeetings: [],
      keyPeople: participants,
    };
  }
}

// Voice Summary Generation (text for TTS)
export async function generateVoiceSummaryText(summary: string, actionItems: string[]): Promise<string> {
  const prompt = `Convert this meeting summary into a natural, conversational voice summary script (30-45 seconds when spoken).
Make it engaging and easy to listen to. Include the most important action items.

Meeting Summary:
${summary.substring(0, 1000)}

Key Action Items:
${actionItems.slice(0, 3).join(', ')}

Return ONLY the voice script text (no stage directions, no markdown):`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return `Here's your meeting summary. ${summary.substring(0, 200)}... You have ${actionItems.length} action items to follow up on.`;
  }
}

// AI Meeting Coach - Real-time suggestions
export async function getMeetingCoachSuggestions(
  transcript: string,
  duration: number,
  currentTopic?: string
): Promise<string[]> {
  const prompt = `You're an AI Meeting Coach observing this meeting in progress.
Based on the transcript so far, provide 2-3 actionable suggestions to improve meeting effectiveness.
Consider: time management, participation balance, clarity, agenda focus.

Duration so far: ${Math.round(duration / 60)} minutes
${currentTopic ? `Current topic: ${currentTopic}` : ''}

Transcript:
${transcript.substring(Math.max(0, transcript.length - 3000))}

Return a JSON array of suggestion strings (max 3):`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const suggestions = JSON.parse(cleaned);
    
    if (Array.isArray(suggestions)) {
      return suggestions.slice(0, 3);
    }
    return [];
  } catch {
    return [
      'Try to keep the discussion focused on the current agenda item',
      'Consider summarizing key points before moving to the next topic',
    ];
  }
}

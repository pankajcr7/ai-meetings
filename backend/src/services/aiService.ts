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

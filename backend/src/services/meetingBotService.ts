import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';
import Integration from '../models/Integration';
import Meeting from '../models/Meeting';
import Team from '../models/Team';
import { generateSummary, extractActionItems, transcribeAudio } from './aiService';

// Track active bot instances per team
interface BotInstance {
  platform: string;
  process?: ChildProcess;
  meetingId?: string;
  recordingPath?: string;
  startTime?: Date;
}

const activeBots = new Map<string, Map<string, BotInstance>>();
const recordingQueue: Array<{ teamId: string; platform: string; meetingUrl: string; meetingId: string }> = [];

export class MeetingBotService {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.ensureUploadsDir();
    this.startQueueProcessor();
  }

  private ensureUploadsDir() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  // Initialize bot monitoring for a team's integrations
  async initializeForTeam(teamId: string, platform: string): Promise<void> {
    if (!activeBots.has(teamId)) {
      activeBots.set(teamId, new Map());
    }
    
    const teamBots = activeBots.get(teamId)!;
    
    if (!teamBots.has(platform)) {
      teamBots.set(platform, {
        platform,
      });
    }

    console.log(`[BotService] Initialized ${platform} monitoring for team ${teamId}`);
    
    // Start calendar polling for this team
    await this.startCalendarPolling(teamId);
  }

  async stopForTeam(teamId: string, platform: string): Promise<void> {
    const teamBots = activeBots.get(teamId);
    if (teamBots) {
      const bot = teamBots.get(platform);
      if (bot?.process) {
        bot.process.kill();
      }
      teamBots.delete(platform);
    }
  }

  async startAutoRecording(teamId: string): Promise<void> {
    const teamBots = activeBots.get(teamId);
    if (!teamBots) return;

    for (const [platform, bot] of teamBots) {
      bot.process = undefined; // Reset any existing process
    }

    console.log(`[BotService] Auto-recording started for team ${teamId}`);
  }

  async stopAutoRecording(teamId: string): Promise<void> {
    const teamBots = activeBots.get(teamId);
    if (!teamBots) return;

    for (const bot of teamBots.values()) {
      if (bot.process) {
        bot.process.kill();
      }
    }

    console.log(`[BotService] Auto-recording stopped for team ${teamId}`);
  }

  async getStatus(teamId: string): Promise<{ platform: string; status: string; recording: boolean }[]> {
    const teamBots = activeBots.get(teamId);
    if (!teamBots) return [];

    return Array.from(teamBots.values()).map(bot => ({
      platform: bot.platform,
      status: bot.process ? 'recording' : 'idle',
      recording: !!bot.process,
    }));
  }

  // Join a specific meeting
  async joinMeeting(platform: string, externalMeetingId: string, meetingUrl: string, teamId?: string): Promise<void> {
    // If teamId not provided, find from integrations
    if (!teamId) {
      const integration = await Integration.findOne({ 
        type: platform, 
        status: 'connected',
        'settings.autoRecord': true 
      });
      if (!integration) {
        console.log(`[BotService] No active auto-record integration found for ${platform}`);
        return;
      }
      teamId = integration.team.toString();
    }

    // Add to recording queue
    recordingQueue.push({
      teamId,
      platform,
      meetingUrl,
      meetingId: externalMeetingId,
    });

    console.log(`[BotService] Queued ${platform} meeting for recording: ${externalMeetingId}`);
  }

  // Process recording queue
  private startQueueProcessor() {
    setInterval(async () => {
      if (recordingQueue.length === 0) return;

      const job = recordingQueue.shift();
      if (!job) return;

      try {
        await this.processRecordingJob(job);
      } catch (error) {
        console.error('[BotService] Recording job failed:', error);
      }
    }, 5000); // Check queue every 5 seconds
  }

  private async processRecordingJob(job: { teamId: string; platform: string; meetingUrl: string; meetingId: string }) {
    const { teamId, platform, meetingUrl, meetingId } = job;

    // Check if bot is already recording for this platform
    const teamBots = activeBots.get(teamId);
    const bot = teamBots?.get(platform);
    
    if (bot?.process) {
      console.log(`[BotService] Already recording for ${platform}, skipping`);
      return;
    }

    // Create meeting record
    const meeting = await Meeting.create({
      title: `${platform} Meeting - ${new Date().toLocaleString()}`,
      team: teamId,
      uploadedBy: await this.getTeamOwner(teamId),
      status: 'uploading',
      recordingType: 'upload',
      participants: [],
    });

    // Start recording based on platform
    const recordingPath = path.join(this.uploadsDir, `${meeting._id}.webm`);
    
    try {
      await this.recordMeeting(platform, meetingUrl, recordingPath, meeting);
      
      // Update meeting with file info
      meeting.audioUrl = `${meeting._id}.webm`;
      meeting.status = 'processing';
      await meeting.save();

      // Start AI processing
      await this.processMeeting(meeting);
      
    } catch (error) {
      console.error(`[BotService] Failed to record ${platform} meeting:`, error);
      meeting.status = 'failed';
      meeting.errorMessage = error instanceof Error ? error.message : 'Recording failed';
      await meeting.save();
    }
  }

  private async recordMeeting(platform: string, meetingUrl: string, outputPath: string, meeting: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const recordingScript = this.getRecordingScript(platform, meetingUrl, outputPath);
      
      const child = spawn('node', ['-e', recordingScript], {
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      // Track the bot process
      const teamBots = activeBots.get(meeting.team.toString());
      if (teamBots) {
        const bot = teamBots.get(platform);
        if (bot) {
          bot.process = child;
          bot.meetingId = meeting._id.toString();
          bot.recordingPath = outputPath;
          bot.startTime = new Date();
        }
      }

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        // Clear bot process
        if (teamBots) {
          const bot = teamBots.get(platform);
          if (bot) {
            bot.process = undefined;
          }
        }

        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Recording process exited with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });

      // Auto-stop after 3 hours (max meeting duration)
      setTimeout(() => {
        if (!child.killed) {
          child.kill('SIGTERM');
        }
      }, 3 * 60 * 60 * 1000);
    });
  }

  private getRecordingScript(platform: string, meetingUrl: string, outputPath: string): string {
    // Puppeteer-based recording script
    return `
      const puppeteer = require('puppeteer');
      const fs = require('fs');
      
      async function recordMeeting() {
        const browser = await puppeteer.launch({
          headless: 'new',
          args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--autoplay-policy=no-user-gesture-required',
            '--disable-features=IsolateOrigins,site-per-process',
          ],
        });
        
        try {
          const context = browser.defaultBrowserContext();
          await context.overridePermissions('${meetingUrl}', ['microphone', 'camera']);
          
          const page = await browser.newPage();
          
          // Start recording audio
          await page.evaluateOnNewDocument(() => {
            // Override getUserMedia to capture audio
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            navigator.mediaDevices.getUserMedia = async (constraints) => {
              const stream = await originalGetUserMedia(constraints);
              
              if (constraints.audio) {
                const mediaRecorder = new MediaRecorder(stream);
                const chunks = [];
                
                mediaRecorder.ondataavailable = (e) => {
                  if (e.data.size > 0) chunks.push(e.data);
                };
                
                mediaRecorder.onstop = () => {
                  const blob = new Blob(chunks, { type: 'audio/webm' });
                  const reader = new FileReader();
                  reader.onload = () => {
                    const buffer = Buffer.from(reader.result);
                    require('fs').appendFileSync('${outputPath}', buffer);
                  };
                  reader.readAsArrayBuffer(blob);
                };
                
                mediaRecorder.start(1000);
                
                // Store reference to stop later
                window.aiMeetRecorder = mediaRecorder;
              }
              
              return stream;
            };
          });
          
          await page.goto('${meetingUrl}', { waitUntil: 'networkidle2', timeout: 60000 });
          
          // Platform-specific join logic
          ${this.getPlatformJoinLogic(platform)}
          
          // Keep recording until explicitly stopped
          await new Promise(resolve => setTimeout(resolve, 3 * 60 * 60 * 1000));
          
          // Stop recording
          await page.evaluate(() => {
            if (window.aiMeetRecorder && window.aiMeetRecorder.state !== 'inactive') {
              window.aiMeetRecorder.stop();
            }
          });
          
        } catch (error) {
          console.error('Recording error:', error);
          process.exit(1);
        } finally {
          await browser.close();
        }
      }
      
      recordMeeting().then(() => process.exit(0));
    `;
  }

  private getPlatformJoinLogic(platform: string): string {
    switch (platform) {
      case 'zoom':
        return `
          // Zoom web client join logic
          await page.waitForTimeout(5000);
          
          // Click "Join from Your Browser" if presented
          const joinFromBrowser = await page.$('a[title="Join from Your Browser"]');
          if (joinFromBrowser) await joinFromBrowser.click();
          
          // Enter bot name
          await page.waitForTimeout(3000);
          const nameInput = await page.$('input[name="userName"], #input-for-user-name');
          if (nameInput) await nameInput.type('AI Meeting Recorder', { delay: 50 });
          
          // Turn off camera
          const videoToggle = await page.$('.preview-video-toggle, [aria-label*="camera"]');
          if (videoToggle) await videoToggle.click();
          
          // Join button
          await page.waitForTimeout(1000);
          const joinBtn = await page.$('button.zm-btn--primary, button.preview-join-button');
          if (joinBtn) await joinBtn.click();
          
          // Handle "Allow Computer Audio" popup
          await page.waitForTimeout(5000);
          const audioBtn = await page.$('button.zm-btn--primary, button.join-audio-by-voip');
          if (audioBtn) await audioBtn.click();
        `;
      
      case 'google-meet':
        return `
          // Google Meet join logic
          await page.waitForTimeout(3000);
          
          // Enter name
          const nameInput = await page.$('input[placeholder="Your name"], input[type="text"]');
          if (nameInput) await nameInput.type('AI Meeting Recorder', { delay: 50 });
          
          // Turn off camera and microphone before joining
          const cameraToggle = await page.$('[data-icon-type="3"][aria-label*="camera"], button[aria-label*="camera" i]');
          if (cameraToggle) await cameraToggle.click();
          
          await page.waitForTimeout(500);
          
          const micToggle = await page.$('[data-icon-type="3"][aria-label*="microphone"], button[aria-label*="microphone" i]');
          if (micToggle) await micToggle.click();
          
          // Join meeting
          await page.waitForTimeout(1000);
          const joinBtn = await page.$('button[jsname="Qx7bkf"], button:has-text("Ask to join"), button:has-text("Join now")');
          if (joinBtn) await joinBtn.click();
          
          // Wait to be admitted
          await page.waitForTimeout(10000);
        `;
      
      case 'teams':
        return `
          // Microsoft Teams join logic
          await page.waitForTimeout(5000);
          
          // Continue on this browser (skip app download)
          const continueBtn = await page.$('button:has-text("Continue on this browser")');
          if (continueBtn) await continueBtn.click();
          
          await page.waitForTimeout(3000);
          
          // Enter name
          const nameInput = await page.$('input[placeholder*="name"], input[aria-label*="name"]');
          if (nameInput) await nameInput.type('AI Meeting Recorder', { delay: 50 });
          
          // Turn off camera and mic
          const cameraBtn = await page.$('button[title*="camera"], button[aria-label*="camera"]');
          if (cameraBtn) await cameraBtn.click();
          
          await page.waitForTimeout(500);
          
          const micBtn = await page.$('button[title*="microphone"], button[aria-label*="microphone"]');
          if (micBtn) await micBtn.click();
          
          // Join now
          await page.waitForTimeout(1000);
          const joinBtn = await page.$('button:has-text("Join now"), button[aria-label*="Join"]');
          if (joinBtn) await joinBtn.click();
          
          await page.waitForTimeout(10000);
        `;
      
      case 'webex':
        return `
          // Webex join logic
          await page.waitForTimeout(5000);
          
          // Enter name
          const nameInput = await page.$('input[placeholder*="name"], input#meeting-simple-name');
          if (nameInput) await nameInput.type('AI Meeting Recorder', { delay: 50 });
          
          // Turn off video
          const videoBtn = await page.$('button[aria-label*="video"], button.meeting-video-toggle');
          if (videoBtn) await videoBtn.click();
          
          // Join meeting
          await page.waitForTimeout(1000);
          const joinBtn = await page.$('button:has-text("Join"), button.meeting-join-button');
          if (joinBtn) await joinBtn.click();
          
          // Accept audio
          await page.waitForTimeout(5000);
          const audioBtn = await page.$('button:has-text("Call using computer"), button.meeting-audio-computer');
          if (audioBtn) await audioBtn.click();
          
          await page.waitForTimeout(10000);
        `;
      
      default:
        return `
          // Generic wait for platform detection
          await page.waitForTimeout(10000);
        `;
    }
  }

  private async processMeeting(meeting: any): Promise<void> {
    try {
      const filePath = path.join(this.uploadsDir, meeting.audioUrl);
      
      if (!fs.existsSync(filePath)) {
        throw new Error('Recording file not found');
      }

      meeting.status = 'transcribing';
      await meeting.save();

      // Transcribe audio
      const transcript = await transcribeAudio(filePath, 'audio/webm');
      meeting.transcript = transcript;
      
      meeting.status = 'summarizing';
      await meeting.save();

      // Generate summary and action items
      const [summary, actionItems] = await Promise.all([
        generateSummary(transcript),
        extractActionItems(transcript),
      ]);

      meeting.summary = summary;
      meeting.status = 'completed';
      meeting.processedAt = new Date();
      await meeting.save();

      // Create action items
      const ActionItem = (await import('../models/ActionItem')).default;
      if (actionItems.length > 0) {
        await ActionItem.insertMany(
          actionItems.map((item: any) => ({
            meeting: meeting._id,
            team: meeting.team,
            title: item.title,
            description: item.description,
            assignee: item.assignee,
            priority: item.priority,
            status: 'pending',
          }))
        );
      }

      console.log(`[BotService] Meeting ${meeting._id} processed successfully`);
    } catch (error) {
      console.error(`[BotService] Failed to process meeting ${meeting._id}:`, error);
      meeting.status = 'failed';
      meeting.errorMessage = error instanceof Error ? error.message : 'Processing failed';
      await meeting.save();
    }
  }

  private async getTeamOwner(teamId: string): Promise<string | null> {
    try {
      const team = await Team.findById(teamId).populate('members.user');
      if (!team) return null;
      
      const owner = team.members.find(m => m.role === 'owner');
      return owner?.user?._id?.toString() || null;
    } catch {
      return null;
    }
  }

  // Poll calendars for upcoming meetings with video links
  private async startCalendarPolling(teamId: string): Promise<void> {
    setInterval(async () => {
      try {
        await this.pollCalendarsForMeetings(teamId);
      } catch (error) {
        console.error(`[BotService] Calendar polling error for team ${teamId}:`, error);
      }
    }, 60000); // Poll every minute

    // Initial poll
    await this.pollCalendarsForMeetings(teamId);
  }

  private async pollCalendarsForMeetings(teamId: string): Promise<void> {
    const integrations = await Integration.find({
      team: teamId,
      type: { $in: ['google-calendar', 'outlook-calendar'] },
      status: 'connected',
      'settings.autoRecord': true,
    });

    for (const integration of integrations) {
      try {
        const meetings = await this.fetchCalendarMeetings(integration);
        
        for (const meeting of meetings) {
          // Check if meeting is starting soon (within 5 minutes)
          const meetingTime = new Date(meeting.startTime);
          const now = new Date();
          const diffMinutes = (meetingTime.getTime() - now.getTime()) / (1000 * 60);
          
          if (diffMinutes > 0 && diffMinutes <= 5) {
            // Extract meeting URL from description or location
            const meetingUrl = this.extractMeetingUrl(meeting);
            
            if (meetingUrl) {
              const platform = this.detectPlatformFromUrl(meetingUrl);
              
              // Check if we have a connected integration for this platform
              const platformIntegration = await Integration.findOne({
                team: teamId,
                type: platform,
                status: 'connected',
                'settings.autoRecord': true,
              });

              if (platformIntegration) {
                await this.joinMeeting(platform, meeting.id, meetingUrl, teamId);
              }
            }
          }
        }
      } catch (error) {
        console.error(`[BotService] Error polling calendar ${integration.type}:`, error);
      }
    }
  }

  private async fetchCalendarMeetings(integration: any): Promise<any[]> {
    // Implementation varies by calendar type
    switch (integration.type) {
      case 'google-calendar':
        return this.fetchGoogleCalendarEvents(integration);
      case 'outlook-calendar':
        return this.fetchOutlookCalendarEvents(integration);
      default:
        return [];
    }
  }

  private async fetchGoogleCalendarEvents(integration: any): Promise<any[]> {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}&timeMax=${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}&singleEvents=true`,
      {
        headers: { Authorization: `Bearer ${integration.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`);
    }

    const data: any = await response.json();
    return (data.items || []).map((event: any) => ({
      id: event.id,
      title: event.summary,
      startTime: event.start.dateTime || event.start.date,
      endTime: event.end.dateTime || event.end.date,
      description: event.description || '',
      location: event.location || '',
      meetLink: event.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === 'video')?.uri,
    }));
  }

  private async fetchOutlookCalendarEvents(integration: any): Promise<any[]> {
    const response = await fetch(
      'https://graph.microsoft.com/v1.0/me/events?$filter=start/dateTime ge \'' + new Date().toISOString() + '\'',
      {
        headers: { Authorization: `Bearer ${integration.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Outlook Calendar API error: ${response.status}`);
    }

    const data: any = await response.json();
    return (data.value || []).map((event: any) => ({
      id: event.id,
      title: event.subject,
      startTime: event.start.dateTime,
      endTime: event.end.dateTime,
      description: event.body?.content || '',
      location: event.location?.displayName || '',
      teamsLink: event.onlineMeeting?.joinUrl,
    }));
  }

  private extractMeetingUrl(event: any): string | null {
    // Check common locations for meeting URLs
    const searchText = `${event.location || ''} ${event.description || ''} ${event.meetLink || ''} ${event.teamsLink || ''}`;
    
    const patterns = [
      /(https:\/\/zoom\.us\/j\/\d+)/i,
      /(https:\/\/meet\.google\.com\/[a-z-]+)/i,
      /(https:\/\/teams\.microsoft\.com\/l\/meetup-join\/[^\s]+)/i,
      /(https:\/\/[a-z0-9-]+\.webex\.com\/[^\s]*meet\/[^\s]+)/i,
      /(https:\/\/app\.slido\/[^\s]+)/i,
    ];

    for (const pattern of patterns) {
      const match = searchText.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  private detectPlatformFromUrl(url: string): string {
    if (url.includes('zoom.us')) return 'zoom';
    if (url.includes('meet.google.com')) return 'google-meet';
    if (url.includes('teams.microsoft.com')) return 'teams';
    if (url.includes('webex.com')) return 'webex';
    return 'unknown';
  }

  // Webhook handlers for real-time meeting events
  async handleZoomWebhook(payload: any): Promise<void> {
    const { event, payload: eventPayload } = payload;
    
    if (event === 'meeting.started') {
      const meetingId = eventPayload.object.id;
      const joinUrl = eventPayload.object.join_url;
      
      // Find teams with Zoom integration
      const integrations = await Integration.find({
        type: 'zoom',
        status: 'connected',
        'settings.autoRecord': true,
      });

      for (const integration of integrations) {
        await this.joinMeeting('zoom', meetingId, joinUrl, integration.team.toString());
      }
    }
  }

  async handleTeamsWebhook(payload: any): Promise<void> {
    if (payload.eventType === 'callStarted') {
      const integrations = await Integration.find({
        type: 'teams',
        status: 'connected',
        'settings.autoRecord': true,
      });

      for (const integration of integrations) {
        await this.joinMeeting('teams', payload.callId, payload.joinUrl, integration.team.toString());
      }
    }
  }
}

export const meetingBotService = new MeetingBotService();

// Calendar service for managing calendar integrations
export const calendarService = {
  async getUpcomingMeetings(teamId: string): Promise<any[]> {
    const integrations = await Integration.find({
      team: teamId,
      type: { $in: ['google-calendar', 'outlook-calendar'] },
      status: 'connected',
    });

    const allMeetings: any[] = [];

    for (const integration of integrations) {
      try {
        let meetings: any[] = [];
        
        if (integration.type === 'google-calendar') {
          meetings = await meetingBotService['fetchGoogleCalendarEvents'](integration);
        } else if (integration.type === 'outlook-calendar') {
          meetings = await meetingBotService['fetchOutlookCalendarEvents'](integration);
        }

        allMeetings.push(...meetings.map(m => ({
          ...m,
          calendarType: integration.type,
          hasMeetingLink: !!meetingBotService['extractMeetingUrl'](m),
          platform: meetingBotService['detectPlatformFromUrl'](meetingBotService['extractMeetingUrl'](m) || ''),
        })));
      } catch (error) {
        console.error(`Error fetching calendar events from ${integration.type}:`, error);
      }
    }

    return allMeetings.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  },

  async syncCalendarChanges(payload: any): Promise<void> {
    // Handle Google Calendar push notification
    console.log('[CalendarService] Syncing calendar changes:', payload);
  },
};

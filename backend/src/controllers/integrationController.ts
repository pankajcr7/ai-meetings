import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Integration from '../models/Integration';
import Meeting from '../models/Meeting';
import Team from '../models/Team';
import { meetingBotService, calendarService } from '../services/meetingBotService';
import { IntegrationType } from '../models/Integration';

// Available integrations configuration
const AVAILABLE_INTEGRATIONS = [
  // Video Conferencing
  { type: 'zoom', name: 'Zoom', category: 'video', icon: 'video', requiresOAuth: true },
  { type: 'google-meet', name: 'Google Meet', category: 'video', icon: 'video', requiresOAuth: true },
  { type: 'teams', name: 'Microsoft Teams', category: 'video', icon: 'video', requiresOAuth: true },
  { type: 'webex', name: 'Cisco Webex', category: 'video', icon: 'video', requiresOAuth: true },
  // Productivity
  { type: 'slack', name: 'Slack', category: 'productivity', icon: 'message', requiresOAuth: true },
  { type: 'notion', name: 'Notion', category: 'productivity', icon: 'file-text', requiresOAuth: true },
  { type: 'asana', name: 'Asana', category: 'productivity', icon: 'check-square', requiresOAuth: true },
  { type: 'trello', name: 'Trello', category: 'productivity', icon: 'layout', requiresOAuth: true },
  // CRM & Sales
  { type: 'salesforce', name: 'Salesforce', category: 'crm', icon: 'cloud', requiresOAuth: true },
  { type: 'hubspot', name: 'HubSpot', category: 'crm', icon: 'target', requiresOAuth: true },
  { type: 'pipedrive', name: 'Pipedrive', category: 'crm', icon: 'bar-chart', requiresOAuth: true },
  { type: 'zapier', name: 'Zapier', category: 'crm', icon: 'zap', requiresOAuth: true },
  // Calendars
  { type: 'google-calendar', name: 'Google Calendar', category: 'calendar', icon: 'calendar', requiresOAuth: true },
  { type: 'outlook-calendar', name: 'Outlook Calendar', category: 'calendar', icon: 'calendar', requiresOAuth: true },
];

export const listIntegrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activeTeam = req.user.activeTeam;
    if (!activeTeam) {
      res.status(400).json({ success: false, error: { message: 'No active team selected', code: 'NO_TEAM' } });
      return;
    }

    // Get connected integrations for this team
    const connected = await Integration.find({ team: activeTeam }).select('type status settings.connectedAt');
    const connectedMap = new Map(connected.map((i: any) => [i.type as IntegrationType, { status: i.status, connectedAt: i.connectedAt }]));

    // Merge with available integrations
    const integrations = AVAILABLE_INTEGRATIONS.map(int => ({
      ...int,
      status: connectedMap.get(int.type as IntegrationType)?.status || 'disconnected',
      connectedAt: connectedMap.get(int.type as IntegrationType)?.connectedAt || null,
    }));

    res.json({ success: true, data: integrations });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'FETCH_FAILED' } });
  }
};

export const getIntegrationAuthUrl = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const redirectUri = `${process.env.BACKEND_URL}/api/integrations/${type}/callback`;
    
    let authUrl: string;
    
    switch (type) {
      case 'zoom':
        authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${redirectUri}`;
        break;
      case 'google-meet':
      case 'google-calendar':
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly`;
        break;
      case 'teams':
        authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=Calendars.Read OnlineMeetings.Read`;
        break;
      case 'slack':
        authUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=chat:write,channels:read,im:read&redirect_uri=${redirectUri}`;
        break;
      case 'notion':
        authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}`;
        break;
      default:
        // For integrations without OAuth, return a connect URL
        authUrl = `${process.env.FRONTEND_URL}/dashboard/integrations/${type}/connect`;
    }

    res.json({ success: true, data: { authUrl, type } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'AUTH_URL_FAILED' } });
  }
};

export const handleOAuthCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const { code, state } = req.query;

    if (!code) {
      res.status(400).json({ success: false, error: { message: 'Authorization code missing', code: 'MISSING_CODE' } });
      return;
    }

    // Exchange code for tokens (implementation varies by platform)
    let tokens: { accessToken: string; refreshToken?: string; expiresAt?: Date } | null = null;

    switch (type) {
      case 'zoom':
        tokens = await exchangeZoomCode(code as string);
        break;
      case 'google-meet':
      case 'google-calendar':
        tokens = await exchangeGoogleCode(code as string, type);
        break;
      case 'teams':
        tokens = await exchangeMicrosoftCode(code as string);
        break;
      case 'slack':
        tokens = await exchangeSlackCode(code as string);
        break;
      case 'notion':
        tokens = await exchangeNotionCode(code as string);
        break;
    }

    if (!tokens) {
      res.status(400).json({ success: false, error: { message: 'Failed to exchange authorization code', code: 'TOKEN_EXCHANGE_FAILED' } });
      return;
    }

    // Decode state to get user/team info (state should contain encoded userId and teamId)
    const stateData = JSON.parse(Buffer.from(state as string, 'base64').toString());
    
    // Save or update integration
    await Integration.findOneAndUpdate(
      { team: stateData.teamId, type },
      {
        user: stateData.userId,
        name: AVAILABLE_INTEGRATIONS.find(i => i.type === type)?.name || type,
        status: 'connected',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        settings: {
          autoRecord: true,
          autoSync: false,
          notifyOnComplete: true,
        },
      },
      { upsert: true, new: true }
    );

    // Redirect back to frontend
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/integrations?connected=${type}`);
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'CALLBACK_FAILED' } });
  }
};

export const connectIntegration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const activeTeam = req.user.activeTeam;
    
    if (!activeTeam) {
      res.status(400).json({ success: false, error: { message: 'No active team selected', code: 'NO_TEAM' } });
      return;
    }

    const { accessToken, refreshToken, externalId, externalName, settings } = req.body;

    const integration = await Integration.findOneAndUpdate(
      { team: activeTeam, type },
      {
        user: req.user._id,
        name: AVAILABLE_INTEGRATIONS.find(i => i.type === type)?.name || type,
        status: 'connected',
        accessToken,
        refreshToken,
        externalId,
        externalName,
        settings: {
          autoRecord: settings?.autoRecord ?? true,
          autoSync: settings?.autoSync ?? false,
          notifyOnComplete: settings?.notifyOnComplete ?? true,
          ...settings,
        },
        connectedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Start bot service if it's a video conferencing integration
    if (['zoom', 'google-meet', 'teams', 'webex'].includes(type)) {
      await meetingBotService.initializeForTeam(activeTeam.toString(), type);
    }

    res.json({ success: true, data: integration });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'CONNECT_FAILED' } });
  }
};

export const disconnectIntegration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const activeTeam = req.user.activeTeam;
    
    if (!activeTeam) {
      res.status(400).json({ success: false, error: { message: 'No active team selected', code: 'NO_TEAM' } });
      return;
    }

    // Stop bot service for this integration
    if (['zoom', 'google-meet', 'teams', 'webex'].includes(type)) {
      await meetingBotService.stopForTeam(activeTeam.toString(), type);
    }

    await Integration.findOneAndUpdate(
      { team: activeTeam, type },
      { status: 'disconnected', accessToken: null, refreshToken: null }
    );

    res.json({ success: true, data: { message: 'Integration disconnected' } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'DISCONNECT_FAILED' } });
  }
};

export const updateIntegrationSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const activeTeam = req.user.activeTeam;
    
    if (!activeTeam) {
      res.status(400).json({ success: false, error: { message: 'No active team selected', code: 'NO_TEAM' } });
      return;
    }

    const updates = req.body;

    const integration = await Integration.findOneAndUpdate(
      { team: activeTeam, type },
      { $set: { settings: updates } },
      { new: true }
    );

    if (!integration) {
      res.status(404).json({ success: false, error: { message: 'Integration not found', code: 'NOT_FOUND' } });
      return;
    }

    // Update bot service if auto-record setting changed
    if (updates.autoRecord !== undefined) {
      if (updates.autoRecord) {
        await meetingBotService.initializeForTeam(activeTeam.toString(), type);
      } else {
        await meetingBotService.stopForTeam(activeTeam.toString(), type);
      }
    }

    res.json({ success: true, data: integration });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'UPDATE_FAILED' } });
  }
};

export const listConnectedCalendars = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activeTeam = req.user.activeTeam;
    if (!activeTeam) {
      res.status(400).json({ success: false, error: { message: 'No active team selected', code: 'NO_TEAM' } });
      return;
    }

    const calendars = await Integration.find({
      team: activeTeam,
      type: { $in: ['google-calendar', 'outlook-calendar'] },
      status: 'connected',
    }).select('type name settings externalName');

    res.json({ success: true, data: calendars });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'FETCH_FAILED' } });
  }
};

export const getUpcomingMeetings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activeTeam = req.user.activeTeam;
    if (!activeTeam) {
      res.status(400).json({ success: false, error: { message: 'No active team selected', code: 'NO_TEAM' } });
      return;
    }

    // Get meetings from calendar service
    const meetings = await calendarService.getUpcomingMeetings(activeTeam.toString());

    res.json({ success: true, data: meetings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'FETCH_FAILED' } });
  }
};

export const toggleAutoRecording = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activeTeam = req.user.activeTeam;
    const { enabled } = req.body;
    
    if (!activeTeam) {
      res.status(400).json({ success: false, error: { message: 'No active team selected', code: 'NO_TEAM' } });
      return;
    }

    // Update all video conferencing integrations
    await Integration.updateMany(
      { 
        team: activeTeam, 
        type: { $in: ['zoom', 'google-meet', 'teams', 'webex'] },
        status: 'connected'
      },
      { $set: { 'settings.autoRecord': enabled } }
    );

    if (enabled) {
      await meetingBotService.startAutoRecording(activeTeam.toString());
    } else {
      await meetingBotService.stopAutoRecording(activeTeam.toString());
    }

    res.json({ success: true, data: { autoRecording: enabled } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'TOGGLE_FAILED' } });
  }
};

export const getRecordingBotStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activeTeam = req.user.activeTeam;
    if (!activeTeam) {
      res.status(400).json({ success: false, error: { message: 'No active team selected', code: 'NO_TEAM' } });
      return;
    }

    const status = await meetingBotService.getStatus(activeTeam.toString());

    res.json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'FETCH_FAILED' } });
  }
};

// Helper functions for OAuth token exchange
async function exchangeZoomCode(code: string) {
  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.BACKEND_URL}/api/integrations/zoom/callback`,
  });
  
  const data: any = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

async function exchangeGoogleCode(code: string, type: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.BACKEND_URL}/api/integrations/${type}/callback&grant_type=authorization_code`,
  });
  
  const data: any = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

async function exchangeMicrosoftCode(code: string) {
  const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=${process.env.MICROSOFT_CLIENT_ID}&client_secret=${process.env.MICROSOFT_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.BACKEND_URL}/api/integrations/teams/callback&grant_type=authorization_code`,
  });
  
  const data: any = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

async function exchangeSlackCode(code: string) {
  const response = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.BACKEND_URL}/api/integrations/slack/callback`,
  });
  
  const data: any = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
  };
}

async function exchangeNotionCode(code: string) {
  const response = await fetch('https://api.notion.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.BACKEND_URL}/api/integrations/notion/callback`,
    }),
  });
  
  const data: any = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: undefined,
    expiresAt: undefined,
  };
}

// Webhook handlers for platform events
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { platform } = req.params;
    
    // Acknowledge webhook immediately
    res.status(200).send('OK');

    // Process webhook asynchronously
    switch (platform) {
      case 'zoom':
        await handleZoomWebhook(req.body);
        break;
      case 'google-calendar':
        await handleGoogleCalendarWebhook(req.body);
        break;
      case 'teams':
        await handleTeamsWebhook(req.body);
        break;
    }
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(200).send('OK'); // Always return 200 to prevent retries
  }
};

async function handleZoomWebhook(payload: any) {
  if (payload.event === 'meeting.started') {
    await meetingBotService.joinMeeting('zoom', payload.payload.object.id, payload.payload.object.join_url);
  }
}

async function handleGoogleCalendarWebhook(payload: any) {
  // Process Google Calendar push notifications
  await calendarService.syncCalendarChanges(payload);
}

async function handleTeamsWebhook(payload: any) {
  if (payload.eventType === 'callStarted') {
    await meetingBotService.joinMeeting('teams', payload.callId, payload.joinUrl);
  }
}

// Webhook handler is already exported above as handleWebhook

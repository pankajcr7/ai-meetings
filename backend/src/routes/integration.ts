import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  listIntegrations,
  connectIntegration,
  disconnectIntegration,
  updateIntegrationSettings,
  getIntegrationAuthUrl,
  handleOAuthCallback,
  listConnectedCalendars,
  getUpcomingMeetings,
  toggleAutoRecording,
  getRecordingBotStatus,
} from '../controllers/integrationController';

const router = Router();

// List all available integrations and their status
router.get('/', auth, listIntegrations);

// Get OAuth URL for a specific integration
router.get('/:type/auth-url', auth, getIntegrationAuthUrl);

// Handle OAuth callback
router.get('/:type/callback', handleOAuthCallback);

// Connect an integration
router.post('/:type/connect', auth, connectIntegration);

// Disconnect an integration
router.delete('/:type/disconnect', auth, disconnectIntegration);

// Update integration settings (auto-record, etc)
router.patch('/:type/settings', auth, updateIntegrationSettings);

// Calendar-specific routes
router.get('/calendars/connected', auth, listConnectedCalendars);
router.get('/calendars/upcoming', auth, getUpcomingMeetings);

// Bot recording management
router.post('/bot/toggle', auth, toggleAutoRecording);
router.get('/bot/status', auth, getRecordingBotStatus);

// Webhook endpoints for platform events
router.post('/webhooks/:platform', handleOAuthCallback);

export default router;

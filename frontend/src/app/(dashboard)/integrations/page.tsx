'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  Check, 
  X, 
  ExternalLink, 
  Calendar, 
  Bot, 
  RefreshCw,
  ChevronRight,
  Video,
  MessageSquare,
  Cloud,
  Zap,
  Layout,
  CheckSquare,
  Target,
  BarChart3,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Integration {
  type: string;
  name: string;
  category: 'video' | 'productivity' | 'crm' | 'calendar';
  icon: string;
  requiresOAuth: boolean;
  status: 'connected' | 'disconnected' | 'error';
  connectedAt?: string;
  settings?: {
    autoRecord?: boolean;
    autoSync?: boolean;
    notifyOnComplete?: boolean;
  };
}

interface UpcomingMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  platform: string;
  calendarType: string;
  hasMeetingLink: boolean;
}

interface BotStatus {
  platform: string;
  status: string;
  recording: boolean;
}

const categoryIcons = {
  video: Video,
  productivity: Layout,
  crm: Cloud,
  calendar: Calendar,
};

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'zoom': Video,
  'google-meet': Video,
  'teams': MessageSquare,
  'webex': Video,
  'slack': MessageSquare,
  'notion': Layout,
  'asana': CheckSquare,
  'trello': Layout,
  'salesforce': Cloud,
  'hubspot': Target,
  'pipedrive': BarChart3,
  'zapier': Zap,
  'google-calendar': Calendar,
  'outlook-calendar': Calendar,
};

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<UpcomingMeeting[]>([]);
  const [botStatus, setBotStatus] = useState<BotStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [autoRecording, setAutoRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'productivity' | 'crm' | 'calendar'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [intRes, meetingsRes, botRes] = await Promise.all([
        api.get('/integrations'),
        api.get('/integrations/calendars/upcoming'),
        api.get('/integrations/bot/status'),
      ]);

      setIntegrations(intRes.data.data || []);
      setUpcomingMeetings(meetingsRes.data.data || []);
      setBotStatus(botRes.data.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load integrations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (type: string) => {
    try {
      setConnecting(type);
      const { data } = await api.get(`/integrations/${type}/auth-url`);
      
      // Open OAuth in popup or redirect
      if (data.data.authUrl.includes('http')) {
        window.open(data.data.authUrl, '_blank', 'width=600,height=600');
      } else {
        // For non-OAuth integrations, show connect dialog
        await api.post(`/integrations/${type}/connect`, {
          accessToken: 'demo-token',
          settings: { autoRecord: true, autoSync: false, notifyOnComplete: true }
        });
        toast({
          title: 'Connected',
          description: `${type} connected successfully`,
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to initiate connection',
        variant: 'destructive',
      });
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (type: string) => {
    try {
      await api.delete(`/integrations/${type}/disconnect`);
      toast({
        title: 'Disconnected',
        description: `${type} has been disconnected`,
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect',
        variant: 'destructive',
      });
    }
  };

  const toggleAutoRecording = async () => {
    try {
      const newState = !autoRecording;
      await api.post('/integrations/bot/toggle', { enabled: newState });
      setAutoRecording(newState);
      toast({
        title: newState ? 'Auto-Recording Enabled' : 'Auto-Recording Disabled',
        description: newState 
          ? 'Bot will automatically join and record your meetings' 
          : 'Bot will no longer auto-join meetings',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle auto-recording',
        variant: 'destructive',
      });
    }
  };

  const filteredIntegrations = activeTab === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeTab);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const videoConnected = integrations.filter(i => i.category === 'video' && i.status === 'connected').length;
  const hasAutoRecordingEnabled = integrations.some(
    i => i.category === 'video' && i.status === 'connected' && i.settings?.autoRecord
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Connect your tools and automate meeting recordings
          </p>
        </div>
        <Button variant="outline" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{connectedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">of {integrations.length} integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Video Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{videoConnected}</div>
            <p className="text-xs text-muted-foreground mt-1">connected for auto-recording</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingMeetings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">detected in next 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bot Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${hasAutoRecordingEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="font-semibold">{hasAutoRecordingEnabled ? 'Active' : 'Idle'}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {botStatus.filter(b => b.recording).length} recording now
              </p>
            </div>
            <Switch 
              checked={hasAutoRecordingEnabled} 
              onCheckedChange={toggleAutoRecording}
            />
          </CardContent>
        </Card>
      </div>

      {/* Auto-Recording Banner */}
      {videoConnected > 0 && (
        <Card className={`border-l-4 ${hasAutoRecordingEnabled ? 'border-l-green-500 bg-green-50/50' : 'border-l-amber-500 bg-amber-50/50'}`}>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${hasAutoRecordingEnabled ? 'bg-green-100' : 'bg-amber-100'}`}>
                <Bot className={`h-5 w-5 ${hasAutoRecordingEnabled ? 'text-green-600' : 'text-amber-600'}`} />
              </div>
              <div>
                <h3 className="font-semibold">
                  {hasAutoRecordingEnabled ? 'Auto-Recording Bot is Active' : 'Auto-Recording is Disabled'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {hasAutoRecordingEnabled 
                    ? `Bot will automatically join ${videoConnected} connected video platforms and record meetings`
                    : 'Enable to let the bot auto-join and record your meetings from connected calendars'}
                </p>
              </div>
            </div>
            <Button 
              onClick={toggleAutoRecording}
              variant={hasAutoRecordingEnabled ? 'outline' : 'default'}
            >
              {hasAutoRecordingEnabled ? 'Disable' : 'Enable Auto-Recording'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Integrations List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            {(['all', 'video', 'productivity', 'crm', 'calendar'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === 'all' ? 'All' : tab}
              </Button>
            ))}
          </div>

          <div className="grid gap-3">
            <AnimatePresence>
              {filteredIntegrations.map((integration) => {
                const Icon = platformIcons[integration.type] || categoryIcons[integration.category];
                const isConnected = integration.status === 'connected';

                return (
                  <motion.div
                    key={integration.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className={`group transition-all ${isConnected ? 'border-green-200 bg-green-50/30' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${isConnected ? 'bg-green-100' : 'bg-muted'}`}>
                              <Icon className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{integration.name}</h3>
                                {isConnected && (
                                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                    <Check className="h-3 w-3 mr-1" />
                                    Connected
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground capitalize">
                                {integration.category} • {integration.requiresOAuth ? 'OAuth' : 'API Key'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {isConnected ? (
                              <>
                                {integration.category === 'video' && (
                                  <div className="flex items-center gap-2 mr-4">
                                    <span className="text-sm text-muted-foreground">Auto-record</span>
                                    <Switch 
                                      checked={integration.settings?.autoRecord}
                                      onCheckedChange={(checked) => {
                                        api.patch(`/integrations/${integration.type}/settings`, {
                                          autoRecord: checked
                                        }).then(() => loadData());
                                      }}
                                    />
                                  </div>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDisconnect(integration.type)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Disconnect
                                </Button>
                              </>
                            ) : (
                              <Button 
                                size="sm"
                                onClick={() => handleConnect(integration.type)}
                                disabled={connecting === integration.type}
                              >
                                {connecting === integration.type ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                )}
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Upcoming Meetings Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Meetings
              </CardTitle>
              <CardDescription>
                Detected from connected calendars
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No upcoming meetings found</p>
                  <p className="text-xs mt-1">Connect a calendar to see meetings</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingMeetings.slice(0, 5).map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(meeting.startTime).toLocaleString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                        {meeting.hasMeetingLink && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {meeting.platform} link detected
                          </Badge>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connected Calendars */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Connected Calendars</CardTitle>
            </CardHeader>
            <CardContent>
              {integrations.filter(i => i.category === 'calendar' && i.status === 'connected').length === 0 ? (
                <p className="text-sm text-muted-foreground">No calendars connected</p>
              ) : (
                <div className="space-y-2">
                  {integrations
                    .filter(i => i.category === 'calendar' && i.status === 'connected')
                    .map(calendar => (
                      <div key={calendar.type} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {calendar.name}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

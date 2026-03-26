'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Meeting, ActionItem, User } from '@/types';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileAudio,
  Mic,
  Upload,
  Trash2,
  User as UserIcon,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Scale,
  Smile,
  Gavel,
  DollarSign,
  Volume2,
  Brain,
  Search,
  Zap,
} from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string }> = {
  uploading: { label: 'Uploading', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  transcribing: { label: 'Transcribing', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  summarizing: { label: 'Summarizing', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800 border-red-200' },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low: { label: 'Low', className: 'bg-green-100 text-green-700 border-green-200' },
};

const impactConfig: Record<string, { label: string; className: string }> = {
  high: { label: 'High Impact', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  medium: { label: 'Medium Impact', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  low: { label: 'Low Impact', className: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const decisionStatusConfig: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700 border-green-200' },
  proposed: { label: 'Proposed', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
};

const sentimentConfig: Record<string, { label: string; className: string; emoji: string }> = {
  positive: { label: 'Positive', className: 'bg-green-100 text-green-700 border-green-200', emoji: '😊' },
  neutral: { label: 'Neutral', className: 'bg-gray-100 text-gray-700 border-gray-200', emoji: '😐' },
  negative: { label: 'Negative', className: 'bg-red-100 text-red-700 border-red-200', emoji: '😔' },
};

const severityConfig: Record<string, { label: string; className: string }> = {
  serious: { label: 'Serious', className: 'bg-red-100 text-red-700 border-red-200' },
  moderate: { label: 'Moderate', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  minor: { label: 'Minor', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

function formatDuration(seconds?: number): string {
  if (!seconds) return 'Unknown';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function getUserInfo(uploadedBy: User | string): { name: string; avatar?: string; initials: string } {
  if (typeof uploadedBy === 'string') return { name: 'Unknown', initials: 'U' };
  const initials = uploadedBy.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return { name: uploadedBy.name, avatar: uploadedBy.avatar, initials };
}

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptInput, setTranscriptInput] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchMeeting = useCallback(async () => {
    try {
      const res = await api.get(`/meetings/${id}`);
      setMeeting(res.data.data);
      if (res.data.data.transcript) {
        setTranscriptInput(res.data.data.transcript);
      }
    } catch {
      toast.error('Failed to load meeting');
      router.push('/meetings');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const fetchActionItems = useCallback(async () => {
    try {
      const res = await api.get(`/meetings/${id}/action-items`);
      setActionItems(res.data.data);
    } catch {}
  }, [id]);

  useEffect(() => {
    fetchMeeting();
    fetchActionItems();
  }, [fetchMeeting, fetchActionItems]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/meetings/${id}`);
      toast.success('Meeting deleted');
      router.push('/meetings');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  const handleProcess = async () => {
    if (!transcriptInput.trim()) {
      toast.error('Please enter or paste a transcript first');
      return;
    }

    setProcessing(true);
    try {
      const res = await api.post(`/meetings/${id}/process`, {
        transcript: transcriptInput,
      });
      setMeeting(res.data.data.meeting);
      setActionItems(res.data.data.actionItems);
      toast.success('AI processing complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'AI processing failed');
      fetchMeeting();
    } finally {
      setProcessing(false);
    }
  };

  const handleAutoTranscribe = async () => {
    setTranscribing(true);
    try {
      const res = await api.post(`/meetings/${id}/process`);
      setMeeting(res.data.data.meeting);
      setActionItems(res.data.data.actionItems);
      if (res.data.data.meeting?.transcript) {
        setTranscriptInput(res.data.data.meeting.transcript);
      }
      toast.success('Transcription & AI processing complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Auto-transcription failed');
      fetchMeeting();
    } finally {
      setTranscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!meeting) return null;

  const status = statusConfig[meeting.status] || statusConfig.processing;
  const user = getUserInfo(meeting.uploadedBy);
  const audioSrc = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/meetings/${meeting._id}/audio`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/meetings')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{meeting.title}</h1>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-2" disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete meeting?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the meeting recording and all associated data.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium">
                  {format(new Date(meeting.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">{formatDuration(meeting.duration)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                {meeting.recordingType === 'browser' ? (
                  <Mic className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Upload className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium capitalize">{meeting.recordingType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground">Uploaded by</p>
                <p className="text-sm font-medium">{user.name}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {meeting.audioUrl && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileAudio className="h-4 w-4" />
              Audio Player
            </CardTitle>
          </CardHeader>
          <CardContent>
            <audio
              ref={audioRef}
              controls
              className="w-full"
              src={token ? `${audioSrc}?token=${token}` : audioSrc}
              preload="metadata"
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="insights">
        <TabsList className="w-full justify-start flex-wrap gap-1">
          <TabsTrigger value="insights" className="gap-1">
            <Zap className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="actions">
            Actions
            {actionItems.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {actionItems.length}
              </Badge>
            )}
          </TabsTrigger>
          {meeting.quality && (
            <TabsTrigger value="quality" className="gap-1">
              <TrendingUp className="h-4 w-4" />
              Quality
              <Badge className="ml-1 h-5 px-1.5 text-xs bg-primary text-primary-foreground">
                {meeting.quality.overallScore}
              </Badge>
            </TabsTrigger>
          )}
          {meeting.decisions && meeting.decisions.length > 0 && (
            <TabsTrigger value="decisions" className="gap-1">
              <Gavel className="h-4 w-4" />
              Decisions
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {meeting.decisions.length}
              </Badge>
            </TabsTrigger>
          )}
          {meeting.sentimentTimeline && meeting.sentimentTimeline.length > 0 && (
            <TabsTrigger value="sentiment" className="gap-1">
              <Smile className="h-4 w-4" />
              Sentiment
            </TabsTrigger>
          )}
          {meeting.meetingCost && (
            <TabsTrigger value="cost" className="gap-1">
              <DollarSign className="h-4 w-4" />
              Cost
            </TabsTrigger>
          )}
          {meeting.conflicts && meeting.conflicts.length > 0 && (
            <TabsTrigger value="conflicts" className="gap-1">
              <Scale className="h-4 w-4" />
              Conflicts
              <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                {meeting.conflicts.length}
              </Badge>
            </TabsTrigger>
          )}
          {meeting.voiceSummaryUrl && (
            <TabsTrigger value="voice" className="gap-1">
              <Volume2 className="h-4 w-4" />
              Voice
            </TabsTrigger>
          )}
        </TabsList>
        {/* AI Insights Tab - Overview of all unique features */}
        <TabsContent value="insights">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                AI-Powered Meeting Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Meeting Quality Card */}
                {meeting.quality ? (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.querySelector('[value="quality"]')?.dispatchEvent(new Event('click'))}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Meeting Quality</p>
                        <p className="text-xs text-muted-foreground">AI Assessment</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`text-3xl font-bold ${getScoreColor(meeting.quality.overallScore)}`}>
                        {meeting.quality.overallScore}
                      </span>
                      <span className="text-sm text-muted-foreground mb-1">/100</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{meeting.quality.feedback}</p>
                    <div className="mt-3 flex gap-1">
                      {meeting.quality.improvements?.slice(0, 2).map((imp, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">{imp.substring(0, 25)}...</Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm text-muted-foreground">Quality analysis will appear after processing</p>
                  </div>
                )}

                {/* Meeting Cost Card */}
                {meeting.meetingCost ? (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Meeting Cost</p>
                        <p className="text-xs text-muted-foreground">Time = Money</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-green-600">${meeting.meetingCost.totalCost.toFixed(0)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {meeting.meetingCost.participantCount} people × {Math.round((meeting.duration || 0) / 60)} min × ${meeting.meetingCost.hourlyRate}/hr
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm text-muted-foreground">Cost calculation will appear after processing</p>
                  </div>
                )}

                {/* Decisions Card */}
                {meeting.decisions && meeting.decisions.length > 0 ? (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.querySelector('[value="decisions"]')?.dispatchEvent(new Event('click'))}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Gavel className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Decision Registry</p>
                        <p className="text-xs text-muted-foreground">AI-Tracked Decisions</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-purple-600">{meeting.decisions.length}</span>
                      <span className="text-sm text-muted-foreground mb-1">decisions</span>
                    </div>
                    <div className="mt-3 flex gap-1">
                      <Badge variant="outline" className="text-[10px] bg-green-100 text-green-700">
                        {meeting.decisions.filter(d => d.status === 'confirmed').length} confirmed
                      </Badge>
                      <Badge variant="outline" className="text-[10px] bg-yellow-100 text-yellow-700">
                        {meeting.decisions.filter(d => d.status === 'proposed').length} proposed
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm text-muted-foreground">No decisions detected in this meeting</p>
                  </div>
                )}

                {/* Sentiment Card */}
                {meeting.sentimentTimeline && meeting.sentimentTimeline.length > 0 ? (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.querySelector('[value="sentiment"]')?.dispatchEvent(new Event('click'))}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Smile className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sentiment Timeline</p>
                        <p className="text-xs text-muted-foreground">Emotional Journey</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const avg = meeting.sentimentTimeline!.reduce((a, b) => a + b.score, 0) / meeting.sentimentTimeline!.length;
                        return (
                          <>
                            <span className="text-2xl">{avg > 0.2 ? '😊' : avg < -0.2 ? '😔' : '😐'}</span>
                            <span className={`text-lg font-semibold ${avg > 0.2 ? 'text-green-600' : avg < -0.2 ? 'text-red-600' : 'text-gray-600'}`}>
                              {avg > 0.2 ? 'Positive' : avg < -0.2 ? 'Negative' : 'Neutral'}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {meeting.sentimentTimeline.length} data points tracked
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm text-muted-foreground">Sentiment analysis will appear after processing</p>
                  </div>
                )}

                {/* Conflicts Card */}
                {meeting.conflicts && meeting.conflicts.length > 0 ? (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.querySelector('[value="conflicts"]')?.dispatchEvent(new Event('click'))}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Scale className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Conflict Detector</p>
                        <p className="text-xs text-muted-foreground">Disagreements Found</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-orange-600">{meeting.conflicts.length}</span>
                      <span className="text-sm text-muted-foreground mb-1">conflicts detected</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {meeting.conflicts.filter(c => c.severity === 'serious').length} serious, {meeting.conflicts.filter(c => c.severity === 'moderate').length} moderate
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm text-muted-foreground">No conflicts detected 🎉</p>
                  </div>
                )}

                {/* Voice Summary Card */}
                {meeting.voiceSummaryUrl ? (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 hover:shadow-md transition-shadow cursor-pointer" onClick={() => document.querySelector('[value="voice"]')?.dispatchEvent(new Event('click'))}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Volume2 className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Voice Summary</p>
                        <p className="text-xs text-muted-foreground">Listen on the go</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-indigo-600">Audio Summary Available</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Click to listen to your meeting summary</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-sm text-muted-foreground">Voice summary will be available after processing</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Meeting Quality Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {meeting.quality ? (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/20" />
                        <circle 
                          cx="64" 
                          cy="64" 
                          r="56" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          fill="none" 
                          strokeDasharray={`${meeting.quality.overallScore * 3.52} 351.86`}
                          className={getScoreColor(meeting.quality.overallScore).replace('text-', 'text-')}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(meeting.quality.overallScore)}`}>
                          {meeting.quality.overallScore}
                        </span>
                        <span className="text-xs text-muted-foreground">Overall</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement</span>
                        <span className="font-medium">{meeting.quality.engagement}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${getScoreBgColor(meeting.quality.engagement)} transition-all`} style={{ width: `${meeting.quality.engagement}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Clarity</span>
                        <span className="font-medium">{meeting.quality.clarity}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${getScoreBgColor(meeting.quality.clarity)} transition-all`} style={{ width: `${meeting.quality.clarity}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Actionability</span>
                        <span className="font-medium">{meeting.quality.actionability}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${getScoreBgColor(meeting.quality.actionability)} transition-all`} style={{ width: `${meeting.quality.actionability}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Participation</span>
                        <span className="font-medium">{meeting.quality.participation}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${getScoreBgColor(meeting.quality.participation)} transition-all`} style={{ width: `${meeting.quality.participation}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  {meeting.quality.feedback && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-1">AI Feedback</p>
                      <p className="text-sm text-muted-foreground">{meeting.quality.feedback}</p>
                    </div>
                  )}

                  {/* Improvements */}
                  {meeting.quality.improvements && meeting.quality.improvements.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">💡 Suggested Improvements</p>
                      <ul className="space-y-1">
                        {meeting.quality.improvements.map((imp, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <TrendingUp className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Quality analysis will be available after AI processing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Gavel className="h-4 w-4" />
                Decision Registry
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {meeting.decisions && meeting.decisions.length > 0 ? (
                <div className="space-y-3">
                  {meeting.decisions.map((decision, index) => {
                    const impact = impactConfig[decision.impact];
                    const status = decisionStatusConfig[decision.status];
                    return (
                      <div key={index} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{decision.text}</p>
                            {decision.madeBy && (
                              <p className="text-xs text-muted-foreground mt-1">Proposed by: {decision.madeBy}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="outline" className={impact.className}>
                                {impact.label}
                              </Badge>
                              <Badge variant="outline" className={status.className}>
                                {status.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Gavel className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No decisions detected in this meeting</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Smile className="h-4 w-4" />
                Sentiment Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {meeting.sentimentTimeline && meeting.sentimentTimeline.length > 0 ? (
                <div className="space-y-4">
                  {/* Sentiment Summary */}
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    {(() => {
                      const avg = meeting.sentimentTimeline!.reduce((a, b) => a + b.score, 0) / meeting.sentimentTimeline!.length;
                      const positive = meeting.sentimentTimeline!.filter(s => s.label === 'positive').length;
                      const negative = meeting.sentimentTimeline!.filter(s => s.label === 'negative').length;
                      return (
                        <>
                          <div className="text-center">
                            <span className="text-3xl">{avg > 0.2 ? '😊' : avg < -0.2 ? '😔' : '😐'}</span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {avg > 0.2 ? 'Positive' : avg < -0.2 ? 'Negative' : 'Neutral'}
                            </p>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-lg font-semibold text-green-600">{positive}</p>
                              <p className="text-xs text-muted-foreground">Positive</p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-600">{meeting.sentimentTimeline!.filter(s => s.label === 'neutral').length}</p>
                              <p className="text-xs text-muted-foreground">Neutral</p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-red-600">{negative}</p>
                              <p className="text-xs text-muted-foreground">Negative</p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    {meeting.sentimentTimeline.map((point, index) => {
                      const config = sentimentConfig[point.label];
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                          <span className="text-xl">{config.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={config.className}>
                                {config.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{point.timestamp}</span>
                            </div>
                            {point.topic && (
                              <p className="text-sm text-muted-foreground mt-1">Topic: {point.topic}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-medium ${point.score > 0 ? 'text-green-600' : point.score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {point.score > 0 ? '+' : ''}{point.score.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Smile className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Sentiment analysis will be available after AI processing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Meeting Cost Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {meeting.meetingCost ? (
                <div className="space-y-6">
                  {/* Total Cost */}
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Meeting Cost</p>
                    <p className="text-4xl font-bold text-green-600">
                      ${meeting.meetingCost.totalCost.toFixed(2)} <span className="text-lg">{meeting.meetingCost.currency}</span>
                    </p>
                  </div>

                  {/* Calculation Breakdown */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-2xl font-semibold">{meeting.meetingCost.participantCount}</p>
                      <p className="text-xs text-muted-foreground">Participants</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-2xl font-semibold">{Math.round((meeting.duration || 0) / 60)}</p>
                      <p className="text-xs text-muted-foreground">Minutes</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-2xl font-semibold">${meeting.meetingCost.hourlyRate}</p>
                      <p className="text-xs text-muted-foreground">Avg Hourly Rate</p>
                    </div>
                  </div>

                  {/* Formula */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium mb-2">Calculation</p>
                    <p className="text-sm text-muted-foreground">
                      {meeting.meetingCost.participantCount} people × {Math.round((meeting.duration || 0) / 60)} minutes × ${meeting.meetingCost.hourlyRate}/hr
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      = ${meeting.meetingCost.totalCost.toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <DollarSign className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Cost calculation will be available after processing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Conflict Detector
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {meeting.conflicts && meeting.conflicts.length > 0 ? (
                <div className="space-y-3">
                  {meeting.conflicts.map((conflict, index) => {
                    const severity = severityConfig[conflict.severity];
                    return (
                      <div key={index} className="p-4 rounded-lg border bg-orange-50/50 dark:bg-orange-950/10">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                            <span className="text-sm">⚡</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium">{conflict.topic}</p>
                              <Badge variant="outline" className={severity.className}>
                                {severity.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Between: {conflict.participants.join(', ')}
                            </p>
                            {conflict.resolution && (
                              <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/20 rounded text-xs text-green-700">
                                ✓ Resolved: {conflict.resolution}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Scale className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No conflicts detected in this meeting 🎉</p>
                  <p className="text-xs text-muted-foreground mt-1">Healthy discussions lead to better outcomes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Voice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {meeting.voiceSummaryUrl ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Listen to an AI-generated audio summary of your meeting. Perfect for reviewing on the go!
                  </p>
                  <audio controls className="w-full" src={meeting.voiceSummaryUrl} />
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">🎧 Pro Tip</p>
                    <p className="text-sm text-muted-foreground">
                      Save this audio to your device or share it with team members who couldn't attend.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Volume2 className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Voice summary will be available after processing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcript">
          <Card>
            <CardContent className="pt-6">
              {meeting.transcript ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {meeting.transcript}
                </div>
              ) : (
                <div className="space-y-4">
                  {meeting.audioUrl && (
                    <div className="p-4 border rounded-lg bg-muted/30 space-y-2">
                      <p className="text-sm font-medium">Auto-transcribe from audio</p>
                      <p className="text-xs text-muted-foreground">
                        Use AI to automatically transcribe the audio recording, generate a summary, and extract action items.
                      </p>
                      <Button
                        onClick={handleAutoTranscribe}
                        disabled={transcribing || processing}
                        className="gap-2"
                      >
                        {transcribing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                        {transcribing ? 'Transcribing...' : 'Auto Transcribe & Process'}
                      </Button>
                    </div>
                  )}
                  {meeting.audioUrl && (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">or paste manually</span>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Paste your meeting transcript below, then click "Process with AI" to generate a summary and extract action items.
                  </p>
                  <textarea
                    className="w-full min-h-[200px] p-3 border rounded-lg text-sm resize-y bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Paste your meeting transcript here..."
                    value={transcriptInput}
                    onChange={(e) => setTranscriptInput(e.target.value)}
                    disabled={processing}
                  />
                  <Button
                    onClick={handleProcess}
                    disabled={processing || !transcriptInput.trim()}
                    className="gap-2"
                  >
                    {processing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {processing ? 'Processing...' : 'Process with AI'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary">
          <Card>
            <CardContent className="pt-6">
              {meeting.summary ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {meeting.summary}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {meeting.status === 'summarizing'
                      ? 'AI is generating the summary...'
                      : 'Add a transcript and click "Process with AI" to generate a summary.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="actions">
          <Card>
            <CardContent className="pt-6">
              {actionItems.length > 0 ? (
                <div className="space-y-3">
                  {actionItems.map((item) => {
                    const priority = priorityConfig[item.priority] || priorityConfig.medium;
                    return (
                      <div
                        key={item._id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className={priority.className}>
                              {priority.label}
                            </Badge>
                            {item.assignee && (
                              <Badge variant="outline" className="gap-1">
                                <UserIcon className="h-3 w-3" />
                                {item.assignee}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {meeting.status === 'completed'
                      ? 'No action items were found in this meeting.'
                      : 'Action items will be extracted after AI processing.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

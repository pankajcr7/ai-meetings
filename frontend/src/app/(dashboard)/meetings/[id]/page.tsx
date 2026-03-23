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

      <Tabs defaultValue="transcript">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="actions">
            Action Items
            {actionItems.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {actionItems.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
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

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
  teams: Team[];
  activeTeam?: Team;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  user: User | string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  owner: User | string;
  members: TeamMember[];
  inviteCode?: string;
  createdAt: string;
}

export interface MeetingQuality {
  overallScore: number;
  engagement: number;
  clarity: number;
  actionability: number;
  participation: number;
  feedback?: string;
  improvements?: string[];
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

export interface MeetingCost {
  totalCost: number;
  hourlyRate: number;
  participantCount: number;
  currency: string;
}

export interface Meeting {
  _id: string;
  title: string;
  team: Team | string;
  uploadedBy: User | string;
  audioUrl?: string;
  duration?: number;
  status: 'uploading' | 'processing' | 'transcribing' | 'summarizing' | 'completed' | 'failed';
  transcript?: string;
  summary?: string;
  participants: string[];
  recordingType: 'upload' | 'browser';
  fileSize?: number;
  mimeType?: string;
  errorMessage?: string;
  processedAt?: string;
  
  // Unique AI features
  quality?: MeetingQuality;
  decisions?: Decision[];
  sentimentTimeline?: SentimentPoint[];
  meetingCost?: MeetingCost;
  conflicts?: Conflict[];
  voiceSummaryUrl?: string;
  companyMemoryIndexed?: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface ActionItem {
  _id: string;
  meeting: Meeting | string;
  team: Team | string;
  title: string;
  description?: string;
  assignee?: string;
  assigneeUser?: User | string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  syncedTo: {
    platform: 'slack' | 'notion' | 'asana';
    externalId: string;
    syncedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Integration {
  _id: string;
  team: Team | string;
  type: 'slack' | 'notion' | 'asana';
  accessToken: string;
  refreshToken?: string;
  externalWorkspaceId?: string;
  externalWorkspaceName?: string;
  settings: {
    autoSync: boolean;
    channelId?: string;
    databaseId?: string;
    projectId?: string;
  };
  connectedBy?: User | string;
  connectedAt: string;
  updatedAt: string;
}

export interface Reminder {
  _id: string;
  actionItem: ActionItem | string;
  user: User | string;
  type: 'email' | 'in-app';
  message?: string;
  scheduledAt: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

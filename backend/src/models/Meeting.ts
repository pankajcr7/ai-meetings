import mongoose, { Document, Schema } from 'mongoose';

export interface ISentimentPoint {
  timestamp: string;
  score: number; // -1 to 1
  label: 'negative' | 'neutral' | 'positive';
  speaker?: string;
  topic?: string;
}

export interface IMeetingQuality {
  overallScore: number; // 0-100
  engagement: number; // 0-100
  clarity: number; // 0-100
  actionability: number; // 0-100
  participation: number; // 0-100
  feedback?: string;
  improvements?: string[];
}

export interface IMeetingCost {
  totalCost: number;
  hourlyRate: number;
  participantCount: number;
  currency: string;
}

export interface IDecision {
  text: string;
  madeBy?: string;
  timestamp?: string;
  impact: 'low' | 'medium' | 'high';
  status: 'proposed' | 'confirmed' | 'rejected';
}

export interface IConflict {
  topic: string;
  participants: string[];
  timestamp: string;
  severity: 'minor' | 'moderate' | 'serious';
  resolution?: string;
}

export interface IMeeting extends Document {
  title: string;
  team: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
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
  processedAt?: Date;
  
  // New unique features
  quality?: IMeetingQuality;
  decisions?: IDecision[];
  sentimentTimeline?: ISentimentPoint[];
  meetingCost?: IMeetingCost;
  conflicts?: IConflict[];
  preMeetingContext?: {
    previousDecisions: string[];
    outstandingActionItems: string[];
    relatedMeetings: string[];
    keyPeople: string[];
  };
  voiceSummaryUrl?: string;
  companyMemoryIndexed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const meetingSchema = new Schema<IMeeting>({
  title: {
    type: String,
    required: true,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  audioUrl: {
    type: String,
  },
  duration: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'transcribing', 'summarizing', 'completed', 'failed'],
    default: 'uploading',
  },
  transcript: {
    type: String,
  },
  summary: {
    type: String,
  },
  participants: [{
    type: String,
  }],
  recordingType: {
    type: String,
    enum: ['upload', 'browser'],
    default: 'upload',
  },
  fileSize: {
    type: Number,
  },
  mimeType: {
    type: String,
  },
  errorMessage: {
    type: String,
  },
  processedAt: {
    type: Date,
  },
  
  // Meeting Quality Score
  quality: {
    overallScore: { type: Number, min: 0, max: 100 },
    engagement: { type: Number, min: 0, max: 100 },
    clarity: { type: Number, min: 0, max: 100 },
    actionability: { type: Number, min: 0, max: 100 },
    participation: { type: Number, min: 0, max: 100 },
    feedback: { type: String },
    improvements: [{ type: String }],
  },
  
  // Decision Registry
  decisions: [{
    text: { type: String, required: true },
    madeBy: { type: String },
    timestamp: { type: String },
    impact: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['proposed', 'confirmed', 'rejected'], default: 'proposed' },
  }],
  
  // Sentiment Timeline
  sentimentTimeline: [{
    timestamp: { type: String, required: true },
    score: { type: Number, min: -1, max: 1 },
    label: { type: String, enum: ['negative', 'neutral', 'positive'] },
    speaker: { type: String },
    topic: { type: String },
  }],
  
  // Meeting Cost Calculator
  meetingCost: {
    totalCost: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 75 },
    participantCount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  
  // Conflict Detector
  conflicts: [{
    topic: { type: String, required: true },
    participants: [{ type: String }],
    timestamp: { type: String },
    severity: { type: String, enum: ['minor', 'moderate', 'serious'] },
    resolution: { type: String },
  }],
  
  // Pre-Meeting Intelligence
  preMeetingContext: {
    previousDecisions: [{ type: String }],
    outstandingActionItems: [{ type: String }],
    relatedMeetings: [{ type: String }],
    keyPeople: [{ type: String }],
  },
  
  // Voice Summary
  voiceSummaryUrl: { type: String },
  
  // Company Memory Search
  companyMemoryIndexed: { type: Boolean, default: false },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text index for Company Memory Search
meetingSchema.index({ transcript: 'text', summary: 'text', title: 'text' });
meetingSchema.index({ team: 1, status: 1 });
meetingSchema.index({ team: 1, createdAt: -1 });

meetingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IMeeting>('Meeting', meetingSchema);

import mongoose, { Document, Schema } from 'mongoose';

export type IntegrationType = 
  | 'zoom' | 'google-meet' | 'teams' | 'webex'
  | 'slack' | 'notion' | 'asana' | 'trello'
  | 'salesforce' | 'hubspot' | 'pipedrive' | 'zapier'
  | 'google-calendar' | 'outlook-calendar';

export interface IIntegration extends Document {
  team: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: IntegrationType;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  externalId?: string;
  externalName?: string;
  settings: {
    autoRecord: boolean;
    autoSync: boolean;
    defaultChannel?: string;
    defaultDatabase?: string;
    defaultProject?: string;
    notifyOnComplete: boolean;
    summaryTemplate?: string;
  };
  webhooks?: {
    url: string;
    events: string[];
    secret?: string;
  }[];
  metadata?: Record<string, any>;
  lastUsedAt?: Date;
  lastError?: string;
  connectedAt: Date;
  updatedAt: Date;
}

const integrationSchema = new Schema<IIntegration>({
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'zoom', 'google-meet', 'teams', 'webex',
      'slack', 'notion', 'asana', 'trello',
      'salesforce', 'hubspot', 'pipedrive', 'zapier',
      'google-calendar', 'outlook-calendar'
    ],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error'],
    default: 'connected',
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
  externalId: {
    type: String,
  },
  externalName: {
    type: String,
  },
  settings: {
    autoRecord: {
      type: Boolean,
      default: true,
    },
    autoSync: {
      type: Boolean,
      default: false,
    },
    defaultChannel: {
      type: String,
    },
    defaultDatabase: {
      type: String,
    },
    defaultProject: {
      type: String,
    },
    notifyOnComplete: {
      type: Boolean,
      default: true,
    },
    summaryTemplate: {
      type: String,
    },
  },
  webhooks: [{
    url: String,
    events: [String],
    secret: String,
  }],
  metadata: {
    type: Schema.Types.Mixed,
  },
  lastUsedAt: {
    type: Date,
  },
  lastError: {
    type: String,
  },
  connectedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

integrationSchema.index({ team: 1, type: 1 }, { unique: true });
integrationSchema.index({ user: 1 });
integrationSchema.index({ status: 1 });

integrationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IIntegration>('Integration', integrationSchema);

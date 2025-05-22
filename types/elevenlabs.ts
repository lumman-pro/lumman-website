// Types for the Eleven Labs SDK
export interface ConversationOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: any) => void;
  onError?: (error: any) => void;
}

export interface SessionOptions {
  url?: string;
  agentId?: string;
}

export interface VolumeOptions {
  volume: number;
}

declare module "@11labs/react" {
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

  export interface ConversationHook {
    status: "connected" | "disconnected";
    isSpeaking: boolean;
    startSession: (options: SessionOptions) => Promise<string>;
    endSession: () => Promise<void>;
    setVolume: (options: VolumeOptions) => Promise<void>;
  }

  export function useConversation(
    options?: ConversationOptions,
  ): ConversationHook;
}

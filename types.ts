
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface ChatMessagePart {
  text?: string;
  imageUrl?: string;
}

export interface ChatMessage {
  role: Role;
  parts: ChatMessagePart[];
  timestamp: string;
}

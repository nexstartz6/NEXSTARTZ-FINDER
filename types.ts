// FIX: Added AppView enum for navigation component
export enum AppView {
  FINDER = 'FINDER',
  LIVE = 'LIVE',
  CHAT = 'CHAT',
}

// FIX: Added Message interface for chat component
export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        reviewText: string;
      }[];
    }[];
  };
}

export interface SearchResult {
  text: string;
  groundingChunks?: GroundingChunk[];
}
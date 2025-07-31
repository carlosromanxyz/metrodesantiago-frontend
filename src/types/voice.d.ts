// Voice API Type Declarations for better TypeScript support

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: 
      | 'no-speech' 
      | 'aborted' 
      | 'audio-capture' 
      | 'network' 
      | 'not-allowed' 
      | 'service-not-allowed' 
      | 'bad-grammar' 
      | 'language-not-supported';
    readonly message?: string;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
    readonly resultIndex: number;
  }
}

// Voice Control Types
export interface VoiceControlHook {
  readonly isSupported: boolean;
  readonly isListening: boolean;
  readonly error: VoiceError | null;
  readonly lastCommand: string | null;
  readonly startListening: () => Promise<void>;
  readonly stopListening: () => void;
  readonly announceText: (text: string) => Promise<void>;
}

export type VoiceError = 
  | { type: 'not-supported'; message: string }
  | { type: 'permission-denied'; message: string }
  | { type: 'network-error'; message: string }
  | { type: 'no-speech'; message: string }
  | { type: 'unknown'; message: string };

export type VoiceCommand = 
  | 'trip-planner'
  | 'service-status' 
  | 'help'
  | 'unknown';

export {};
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceControlHook, VoiceError, VoiceCommand } from '@/types/voice';

const VOICE_COMMANDS = {
  TRIP_PLANNER: ['planificar', 'viaje', 'ruta'],
  SERVICE_STATUS: ['estado', 'servicio', 'información'],
  HELP: ['ayuda', 'asistencia', 'soporte'],
  ALTERNATIVE_ROUTES: ['alternativa', 'otro', 'diferente']
} as const;

const getSpeechRecognition = (): any => {
  if (typeof window === 'undefined') return null;
  
  const win = window as any;
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
};

const createVoiceError = (type: VoiceError['type'], message: string): VoiceError => ({
  type,
  message
});

const parseVoiceCommand = (transcript: string): VoiceCommand => {
  const lowercaseTranscript = transcript.toLowerCase();
  
  if (VOICE_COMMANDS.TRIP_PLANNER.some(cmd => lowercaseTranscript.includes(cmd))) {
    return 'trip-planner';
  }
  
  if (VOICE_COMMANDS.SERVICE_STATUS.some(cmd => lowercaseTranscript.includes(cmd))) {
    return 'service-status';
  }
  
  if (VOICE_COMMANDS.HELP.some(cmd => lowercaseTranscript.includes(cmd))) {
    return 'help';
  }
  
  return 'unknown';
};

export const useEnhancedVoiceControl = (
  enabled: boolean,
  onCommand?: (command: VoiceCommand, transcript: string) => void
): VoiceControlHook => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<VoiceError | null>(null);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const SpeechRecognition = getSpeechRecognition();
    
    if (!SpeechRecognition) {
      setError(createVoiceError('not-supported', 'Speech recognition is not supported in this browser'));
      return;
    }

    setIsSupported(true);
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-CL';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (recognition) {
          recognition.stop();
        }
      }, 10000);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      try {
        if (event.results.length > 0 && event.results[0].length > 0) {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          
          setLastCommand(transcript);
          
          // Only process commands with reasonable confidence
          if (confidence > 0.5) {
            const command = parseVoiceCommand(transcript);
            onCommand?.(command, transcript);
          } else {
            setError(createVoiceError('no-speech', 'Command not clearly understood. Please try again.'));
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error processing voice command';
        setError(createVoiceError('unknown', message));
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      switch (event.error) {
        case 'not-allowed':
          setError(createVoiceError('permission-denied', 'Microphone access denied. Please enable microphone permissions.'));
          break;
        case 'no-speech':
          setError(createVoiceError('no-speech', 'No speech detected. Please try again.'));
          break;
        case 'network':
          setError(createVoiceError('network-error', 'Network error occurred. Please check your connection.'));
          break;
        default:
          setError(createVoiceError('unknown', `Voice recognition error: ${event.error}`));
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, onCommand]);

  const startListening = useCallback(async (): Promise<void> => {
    if (!recognitionRef.current || isListening) return;

    try {
      setError(null);
      
      // Check microphone permissions
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permission.state === 'denied') {
          throw new Error('Microphone permission denied');
        }
      }
      
      recognitionRef.current.start();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start voice recognition';
      setError(createVoiceError('permission-denied', message));
    }
  }, [isListening]);

  const stopListening = useCallback((): void => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const announceText = useCallback(async (text: string): Promise<void> => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CL';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
        
        speechSynthesis.speak(utterance);
        
        // Fallback timeout
        setTimeout(() => {
          if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            resolve();
          }
        }, 10000);
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  return {
    isSupported,
    isListening,
    error,
    lastCommand,
    startListening,
    stopListening,
    announceText
  };
};
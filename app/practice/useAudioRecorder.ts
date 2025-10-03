'use client';

import { useState, useRef, useEffect } from 'react';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  audioURL: string | null;
  audioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearRecording: () => void;
  getTranscript: () => Promise<string>;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Debug logging
      console.log('navigator.mediaDevices:', navigator.mediaDevices);
      console.log('getUserMedia:', navigator.mediaDevices?.getUserMedia);
      console.log('MediaRecorder:', typeof MediaRecorder);

      // Check if MediaRecorder is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('MediaDevices not supported');
        const isSecureContext = window.isSecureContext;
        const hostname = window.location.hostname;

        if (!isSecureContext && hostname !== 'localhost' && hostname !== '127.0.0.1') {
          alert('⚠️ Audio recording requires a secure connection.\n\n' +
                'Please access the site using:\n' +
                '• http://localhost:3001 (not the IP address)\n' +
                '• Or use HTTPS\n\n' +
                'Current URL: ' + window.location.href);
        } else {
          alert('Your browser does not support audio recording. Please use Chrome, Firefox, or Edge.');
        }
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Check for supported MIME types
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' :
                       MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' :
                       MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg' : '';

      if (!mimeType) {
        alert('No supported audio format found in your browser.');
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Recording error occurred. Please try again.');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error: any) {
      console.error('Error accessing microphone:', error);

      let errorMessage = 'Unable to access microphone. ';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Please allow microphone permissions in your browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage += 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage += 'Microphone is already in use by another application.';
      } else {
        errorMessage += 'Error: ' + error.message;
      }

      alert(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const clearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const getTranscript = async (): Promise<string> => {
    if (!audioBlob) {
      throw new Error('No audio recording available');
    }

    // Send audio to backend for transcription
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Create a detailed error message based on the error code
        let errorMessage = 'Transcription failed';

        if (data.code === 'quota_exceeded') {
          errorMessage = `OpenAI Quota Exceeded: ${data.message}`;
        } else if (data.code === 'rate_limit') {
          errorMessage = `Rate Limit: ${data.message}`;
        } else if (data.message) {
          errorMessage = data.message;
        }

        throw new Error(errorMessage);
      }

      return data.transcript || '[No speech detected]';
    } catch (error: any) {
      console.error('Transcription error:', error);

      // Re-throw with the original error message if available
      if (error.message) {
        throw error;
      }

      throw new Error('Failed to transcribe audio. Please check your internet connection and try again.');
    }
  };

  return {
    isRecording,
    recordingTime,
    audioURL,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    getTranscript
  };
}

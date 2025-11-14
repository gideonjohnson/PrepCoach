'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  audioURL: string | null;
  audioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearRecording: () => void;
  getTranscript: () => Promise<string>;
  isSupported: boolean;
  permissionStatus: 'unknown' | 'granted' | 'denied' | 'prompt';
}

// Check browser compatibility
function checkBrowserSupport(): { supported: boolean; reason?: string } {
  if (typeof window === 'undefined') {
    return { supported: false, reason: 'Not in browser environment' };
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { supported: false, reason: 'MediaDevices API not supported' };
  }

  if (typeof MediaRecorder === 'undefined') {
    return { supported: false, reason: 'MediaRecorder API not supported' };
  }

  // Check if running on HTTPS or localhost
  const isSecureContext = window.isSecureContext;
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';

  if (!isSecureContext && !isLocalhost) {
    return { supported: false, reason: 'Secure context (HTTPS or localhost) required' };
  }

  return { supported: true };
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check browser support on mount
  useEffect(() => {
    const support = checkBrowserSupport();
    setIsSupported(support.supported);

    if (!support.supported && support.reason) {
      console.warn('Audio recording not supported:', support.reason);
    }

    // Check permission status if supported
    if (support.supported && navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(permissionObj => {
          setPermissionStatus(permissionObj.state as any);

          // Listen for permission changes
          permissionObj.onchange = () => {
            setPermissionStatus(permissionObj.state as any);
          };
        })
        .catch(err => {
          console.warn('Could not query microphone permission:', err);
        });
    }
  }, []);

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
      // Check browser support first
      const support = checkBrowserSupport();
      if (!support.supported) {
        if (support.reason === 'Secure context (HTTPS or localhost) required') {
          toast.error(
            (t) => (
              <div className="flex flex-col gap-2">
                <div className="font-semibold">Secure Connection Required</div>
                <div className="text-sm">
                  Audio recording requires HTTPS or localhost.
                  <br />
                  Current URL: <span className="font-mono text-xs">{window.location.hostname}</span>
                </div>
                <div className="text-xs text-gray-200 mt-1">
                  Try accessing via <span className="font-mono">localhost</span> instead of the IP address.
                </div>
              </div>
            ),
            { duration: 8000 }
          );
        } else {
          toast.error(
            'Your browser does not support audio recording. Please use Chrome, Firefox, or Edge.',
            { duration: 6000 }
          );
        }
        return;
      }

      // Request microphone access with better UX
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      streamRef.current = stream;

      // Check for supported MIME types with fallbacks
      let mimeType = '';
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/ogg'
      ];

      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      if (!mimeType) {
        toast.error('No supported audio format found in your browser. Please update your browser.');
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
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

      mediaRecorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event);
        toast.error('Recording error occurred. Please try again.', { duration: 5000 });
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setPermissionStatus('granted');

      // Show success feedback
      toast.success('Recording started!', { duration: 2000 });

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error: any) {
      console.error('Error accessing microphone:', error);

      // Detailed error handling with user-friendly messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
        toast.error(
          (t) => (
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Microphone Permission Denied</div>
              <div className="text-sm">
                Please allow microphone access in your browser settings and try again.
              </div>
              <div className="text-xs text-gray-200 mt-1">
                Look for the lock or camera icon in your browser's address bar.
              </div>
            </div>
          ),
          { duration: 7000 }
        );
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        toast.error(
          'No microphone found. Please connect a microphone and try again.',
          { duration: 6000 }
        );
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        toast.error(
          'Microphone is already in use. Please close other applications using your microphone and try again.',
          { duration: 6000 }
        );
      } else if (error.name === 'OverconstrainedError') {
        toast.error(
          'Your microphone does not meet the requirements. Try using a different microphone.',
          { duration: 6000 }
        );
      } else {
        toast.error(
          `Unable to access microphone: ${error.message || 'Unknown error'}`,
          { duration: 5000 }
        );
      }
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

      // Show success feedback
      toast.success('Recording stopped successfully!', { duration: 2000 });
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
    getTranscript,
    isSupported,
    permissionStatus
  };
}

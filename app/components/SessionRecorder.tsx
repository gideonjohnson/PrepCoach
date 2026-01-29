'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

interface SessionRecorderProps {
  sessionId: string;
  sessionType: 'interview' | 'coding' | 'system_design';
  onRecordingStart?: () => void;
  onRecordingStop?: (recordingData: {
    audioBlob?: Blob;
    videoBlob?: Blob;
    screenBlob?: Blob;
    duration: number;
  }) => void;
  onTimestamp?: (event: string, data?: Record<string, unknown>) => void;
  enableVideo?: boolean;
  enableScreen?: boolean;
  enableAudio?: boolean;
}

type RecordingState = 'idle' | 'requesting' | 'recording' | 'paused' | 'stopped';

export default function SessionRecorder({
  sessionId,
  sessionType,
  onRecordingStart,
  onRecordingStop,
  onTimestamp,
  enableVideo = false,
  enableScreen = false,
  enableAudio = true,
}: SessionRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const screenChunksRef = useRef<Blob[]>([]);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Update audio level visualization
  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 255);
    }
    if (recordingState === 'recording') {
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [recordingState]);

  const startRecording = async () => {
    try {
      setRecordingState('requesting');
      audioChunksRef.current = [];
      videoChunksRef.current = [];
      screenChunksRef.current = [];

      // Request audio stream
      if (enableAudio) {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Set up audio level analysis
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(audioStream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);

        audioRecorderRef.current = new MediaRecorder(audioStream, {
          mimeType: 'audio/webm;codecs=opus',
        });

        audioRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        audioRecorderRef.current.start(1000); // Collect data every second
      }

      // Request video stream
      if (enableVideo) {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });

        mediaRecorderRef.current = new MediaRecorder(videoStream, {
          mimeType: 'video/webm;codecs=vp9',
        });

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            videoChunksRef.current.push(e.data);
          }
        };

        mediaRecorderRef.current.start(1000);
      }

      // Request screen share
      if (enableScreen) {
        try {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { width: 1920, height: 1080 },
            audio: false,
          });

          screenRecorderRef.current = new MediaRecorder(screenStream, {
            mimeType: 'video/webm;codecs=vp9',
          });

          screenRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
              screenChunksRef.current.push(e.data);
            }
          };

          screenRecorderRef.current.start(1000);
        } catch (err) {
          console.log('Screen share declined or not available');
        }
      }

      // Start timer
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      setRecordingState('recording');
      updateAudioLevel();
      onRecordingStart?.();
      onTimestamp?.('recording_started');
      toast.success('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setRecordingState('idle');
      toast.error('Failed to start recording. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (recordingState !== 'recording') return;

    audioRecorderRef.current?.pause();
    mediaRecorderRef.current?.pause();
    screenRecorderRef.current?.pause();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setRecordingState('paused');
    onTimestamp?.('recording_paused', { duration });
  };

  const resumeRecording = () => {
    if (recordingState !== 'paused') return;

    const pausedDuration = duration;
    const resumeTime = Date.now();

    audioRecorderRef.current?.resume();
    mediaRecorderRef.current?.resume();
    screenRecorderRef.current?.resume();

    timerRef.current = setInterval(() => {
      setDuration(pausedDuration + Math.floor((Date.now() - resumeTime) / 1000));
    }, 1000);

    setRecordingState('recording');
    updateAudioLevel();
    onTimestamp?.('recording_resumed');
  };

  const stopRecording = useCallback(() => {
    if (recordingState === 'idle' || recordingState === 'stopped') return;

    // Stop all recorders
    const stopPromises: Promise<Blob | undefined>[] = [];

    if (audioRecorderRef.current && audioRecorderRef.current.state !== 'inactive') {
      stopPromises.push(
        new Promise((resolve) => {
          audioRecorderRef.current!.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            resolve(blob);
          };
          audioRecorderRef.current!.stop();
          audioRecorderRef.current!.stream.getTracks().forEach((track) => track.stop());
        })
      );
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      stopPromises.push(
        new Promise((resolve) => {
          mediaRecorderRef.current!.onstop = () => {
            const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
            resolve(blob);
          };
          mediaRecorderRef.current!.stop();
          mediaRecorderRef.current!.stream.getTracks().forEach((track) => track.stop());
        })
      );
    }

    if (screenRecorderRef.current && screenRecorderRef.current.state !== 'inactive') {
      stopPromises.push(
        new Promise((resolve) => {
          screenRecorderRef.current!.onstop = () => {
            const blob = new Blob(screenChunksRef.current, { type: 'video/webm' });
            resolve(blob);
          };
          screenRecorderRef.current!.stop();
          screenRecorderRef.current!.stream.getTracks().forEach((track) => track.stop());
        })
      );
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    Promise.all(stopPromises).then((blobs) => {
      setRecordingState('stopped');
      onTimestamp?.('recording_stopped', { duration });

      onRecordingStop?.({
        audioBlob: blobs[0],
        videoBlob: enableVideo ? blobs[1] : undefined,
        screenBlob: enableScreen ? blobs[enableVideo ? 2 : 1] : undefined,
        duration,
      });

      toast.success('Recording saved');
    });
  }, [recordingState, duration, enableVideo, enableScreen, onRecordingStop, onTimestamp]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-900 rounded-xl">
      {/* Recording indicator */}
      <div className="flex items-center gap-2">
        {recordingState === 'recording' && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500 text-sm font-medium">REC</span>
          </span>
        )}
        {recordingState === 'paused' && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-yellow-500 text-sm font-medium">PAUSED</span>
          </span>
        )}
      </div>

      {/* Duration */}
      <div className="text-white font-mono text-lg min-w-[60px]">
        {formatDuration(duration)}
      </div>

      {/* Audio level meter */}
      {enableAudio && recordingState === 'recording' && (
        <div className="flex items-center gap-1 h-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-75 ${
                i / 10 < audioLevel
                  ? i < 7
                    ? 'bg-green-500'
                    : i < 9
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                  : 'bg-gray-600'
              }`}
              style={{ height: `${4 + i * 2}px` }}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2 ml-auto">
        {recordingState === 'idle' && (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="6" />
            </svg>
            Start Recording
          </button>
        )}

        {recordingState === 'recording' && (
          <>
            <button
              onClick={pauseRecording}
              className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              title="Pause"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="6" width="8" height="8" rx="1" />
              </svg>
              Stop
            </button>
          </>
        )}

        {recordingState === 'paused' && (
          <>
            <button
              onClick={resumeRecording}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Resume"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="6" width="8" height="8" rx="1" />
              </svg>
              Stop
            </button>
          </>
        )}

        {recordingState === 'stopped' && (
          <span className="text-green-500 text-sm font-medium">Recording saved</span>
        )}

        {recordingState === 'requesting' && (
          <span className="text-yellow-500 text-sm font-medium flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Requesting permissions...
          </span>
        )}
      </div>

      {/* Settings indicators */}
      <div className="flex items-center gap-1 text-gray-400">
        {enableAudio && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        )}
        {enableVideo && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        )}
        {enableScreen && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321a.75.75 0 01-.508 1.411l-3.607-1.803a.75.75 0 010-1.336l1.196-.598.106-.425H7.22l.106.425 1.196.598a.75.75 0 01-.508 1.336l-3.607 1.803a.75.75 0 01-.508-1.411l.804-.321L5.22 15H3a2 2 0 01-2-2V5zm2 0h10v8H5V5z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </div>
  );
}

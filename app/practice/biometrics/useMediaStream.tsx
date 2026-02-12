'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface MediaStreamConfig {
  video: boolean;
  audio: boolean;
  facingMode?: 'user' | 'environment';
}

export interface UseMediaStreamReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  audioContext: AudioContext | null;
  analyzer: AnalyserNode | null;
  isStreaming: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  startStream: (config?: MediaStreamConfig) => Promise<void>;
  stopStream: () => void;
  captureFrame: () => ImageData | null;
  getAudioData: () => Uint8Array;
  getFrequencyData: () => Uint8Array;
  stream: MediaStream | null;
}

export function useMediaStream(): UseMediaStreamReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const startStream = useCallback(async (config: MediaStreamConfig = { video: true, audio: true }) => {
    try {
      const constraints: MediaStreamConstraints = {
        video: config.video
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: config.facingMode || 'user',
            }
          : false,
        audio: config.audio
          ? {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      // Setup video
      if (config.video && videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setHasVideo(true);
      }

      // Setup audio analysis
      if (config.audio) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 2048;
        analyserNode.smoothingTimeConstant = 0.8;

        const source = ctx.createMediaStreamSource(mediaStream);
        source.connect(analyserNode);

        audioContextRef.current = ctx;
        analyzerRef.current = analyserNode;
        sourceRef.current = source;

        setAudioContext(ctx);
        setAnalyzer(analyserNode);
        setHasAudio(true);
      }

      setIsStreaming(true);
      toast.success('Camera and microphone connected!', { duration: 2000 });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      const err = error as { name?: string; message?: string };

      if (err.name === 'NotAllowedError') {
        toast.error('Camera/microphone permission denied. Please allow access and try again.', {
          duration: 6000,
        });
      } else if (err.name === 'NotFoundError') {
        toast.error('No camera or microphone found. Please connect devices and try again.', {
          duration: 6000,
        });
      } else {
        toast.error(`Failed to access media devices: ${err.message || 'Unknown error'}`, { duration: 5000 });
      }
    }
  }, []);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (audioContextRef.current) {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (analyzerRef.current) {
        analyzerRef.current.disconnect();
      }
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyzerRef.current = null;
      sourceRef.current = null;
      setAudioContext(null);
      setAnalyzer(null);
    }

    setIsStreaming(false);
    setHasVideo(false);
    setHasAudio(false);
  }, [stream]);

  const captureFrame = useCallback((): ImageData | null => {
    if (!videoRef.current || !canvasRef.current || !hasVideo) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, [hasVideo]);

  const getAudioData = useCallback((): Uint8Array => {
    if (!analyzerRef.current) {
      return new Uint8Array(0);
    }

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzerRef.current.getByteTimeDomainData(dataArray);

    return dataArray;
  }, []);

  const getFrequencyData = useCallback((): Uint8Array => {
    if (!analyzerRef.current) {
      return new Uint8Array(0);
    }

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzerRef.current.getByteFrequencyData(dataArray);

    return dataArray;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    videoRef,
    canvasRef,
    audioContext,
    analyzer,
    isStreaming,
    hasVideo,
    hasAudio,
    startStream,
    stopStream,
    captureFrame,
    getAudioData,
    getFrequencyData,
    stream,
  };
}

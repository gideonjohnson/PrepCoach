'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

// Import MediaPipe types
interface FaceLandmark {
  x: number;
  y: number;
  z?: number;
}

interface FaceDetectionResult {
  landmarks: FaceLandmark[];
  boundingBox?: {
    xMin: number;
    yMin: number;
    width: number;
    height: number;
  };
}

interface PoseDetectionResult {
  landmarks: FaceLandmark[];
  visibility?: number[];
}

export interface UseMediaPipeReturn {
  isLoaded: boolean;
  error: string | null;
  analyzeFace: (imageData: ImageData) => Promise<FaceDetectionResult | null>;
  analyzePose: (imageData: ImageData) => Promise<PoseDetectionResult | null>;
  cleanup: () => void;
}

// MediaPipe model interfaces
interface MediaPipeModel {
  setOptions: (options: Record<string, unknown>) => void;
  initialize: () => Promise<void>;
  onResults: (callback: (results: MediaPipeResults) => void) => void;
  send: (input: { image: HTMLCanvasElement }) => void;
  close: () => void;
}

interface MediaPipeResults {
  multiFaceLandmarks?: Array<Array<{ x: number; y: number; z: number }>>;
  poseLandmarks?: Array<{ x: number; y: number; z: number; visibility?: number }>;
}

export function useMediaPipe(): UseMediaPipeReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const faceMeshRef = useRef<MediaPipeModel | null>(null);
  const poseRef = useRef<MediaPipeModel | null>(null);
  const isInitializing = useRef(false);

  // Initialize MediaPipe models
  useEffect(() => {
    if (isInitializing.current || typeof window === 'undefined') return;
    isInitializing.current = true;

    const initializeMediaPipe = async () => {
      try {
        console.log('🔄 Loading MediaPipe models...');

        // Dynamically import MediaPipe modules with error handling
        const [faceMeshModule, poseModule] = await Promise.all([
          import('@mediapipe/face_mesh').catch((err) => {
            console.warn('Face Mesh import failed:', err.message);
            return null;
          }),
          import('@mediapipe/pose').catch((err) => {
            console.warn('Pose import failed:', err.message);
            return null;
          }),
        ]);

        if (!faceMeshModule && !poseModule) {
          throw new Error('Failed to import MediaPipe modules. Visual analytics unavailable.');
        }

        // Initialize Face Mesh if available
        if (faceMeshModule) {
          try {
            const { FaceMesh } = faceMeshModule;
            const faceMesh = new FaceMesh({
              locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
              },
            });

            faceMesh.setOptions({
              maxNumFaces: 1,
              refineLandmarks: true,
              minDetectionConfidence: 0.5,
              minTrackingConfidence: 0.5,
            });

            await faceMesh.initialize();
            faceMeshRef.current = faceMesh;
            console.log('✅ Face Mesh loaded');
          } catch (err) {
            console.warn('Face Mesh initialization failed:', err instanceof Error ? err.message : String(err));
          }
        }

        // Initialize Pose if available
        if (poseModule) {
          try {
            const { Pose } = poseModule;
            const pose = new Pose({
              locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
              },
            });

            pose.setOptions({
              modelComplexity: 0, // Use lite model for better performance
              smoothLandmarks: true,
              enableSegmentation: false,
              minDetectionConfidence: 0.5,
              minTrackingConfidence: 0.5,
            });

            await pose.initialize();
            poseRef.current = pose;
            console.log('✅ Pose detection loaded');
          } catch (err) {
            console.warn('Pose initialization failed:', err instanceof Error ? err.message : String(err));
          }
        }

        // Consider loaded if at least one model is available
        if (faceMeshRef.current || poseRef.current) {
          setIsLoaded(true);
          console.log('✅ MediaPipe models loaded successfully');
        } else {
          throw new Error('No MediaPipe models could be initialized');
        }
      } catch (err) {
        console.error('❌ Failed to load MediaPipe:', err);
        const errMessage = err instanceof Error ? err.message : 'Failed to initialize MediaPipe models';
        const errorMessage =
          errMessage.includes('arguments_')
            ? 'Visual analytics temporarily unavailable. Vocal analysis will continue.'
            : errMessage;
        setError(errorMessage);
        setIsLoaded(false);
      }
    };

    initializeMediaPipe();

    return () => {
      // Cleanup
      try {
        if (faceMeshRef.current) {
          faceMeshRef.current.close();
        }
        if (poseRef.current) {
          poseRef.current.close();
        }
      } catch (err) {
        console.warn('MediaPipe cleanup warning:', err);
      }
    };
  }, []);

  const analyzeFace = useCallback(async (imageData: ImageData): Promise<FaceDetectionResult | null> => {
    if (!faceMeshRef.current || !isLoaded) {
      return null;
    }

    try {
      // Create a canvas from ImageData
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.putImageData(imageData, 0, 0);

      // Run face mesh detection
      const results = await new Promise<MediaPipeResults>((resolve) => {
        faceMeshRef.current!.onResults(resolve);
        faceMeshRef.current!.send({ image: canvas });
      });

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        return {
          landmarks: landmarks.map((lm: { x: number; y: number; z: number }) => ({
            x: lm.x,
            y: lm.y,
            z: lm.z,
          })),
        };
      }

      return null;
    } catch (err) {
      console.error('Error analyzing face:', err);
      return null;
    }
  }, [isLoaded]);

  const analyzePose = useCallback(async (imageData: ImageData): Promise<PoseDetectionResult | null> => {
    if (!poseRef.current || !isLoaded) {
      return null;
    }

    try {
      // Create a canvas from ImageData
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.putImageData(imageData, 0, 0);

      // Run pose detection
      const results = await new Promise<MediaPipeResults>((resolve) => {
        poseRef.current!.onResults(resolve);
        poseRef.current!.send({ image: canvas });
      });

      if (results.poseLandmarks && results.poseLandmarks.length > 0) {
        return {
          landmarks: results.poseLandmarks.map((lm: { x: number; y: number; z: number; visibility?: number }) => ({
            x: lm.x,
            y: lm.y,
            z: lm.z,
          })),
          visibility: results.poseLandmarks.map((lm: { visibility?: number }) => lm.visibility || 0),
        };
      }

      return null;
    } catch (err) {
      console.error('Error analyzing pose:', err);
      return null;
    }
  }, [isLoaded]);

  const cleanup = useCallback(() => {
    if (faceMeshRef.current) {
      faceMeshRef.current.close();
      faceMeshRef.current = null;
    }
    if (poseRef.current) {
      poseRef.current.close();
      poseRef.current = null;
    }
    setIsLoaded(false);
  }, []);

  return {
    isLoaded,
    error,
    analyzeFace,
    analyzePose,
    cleanup,
  };
}

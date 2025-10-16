'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

// Import TensorFlow types
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

export interface UseTensorFlowVisionReturn {
  isLoaded: boolean;
  error: string | null;
  analyzeFace: (imageData: ImageData) => Promise<FaceDetectionResult | null>;
  analyzePose: (imageData: ImageData) => Promise<PoseDetectionResult | null>;
  cleanup: () => void;
}

export function useTensorFlowVision(): UseTensorFlowVisionReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const faceDetectorRef = useRef<any>(null);
  const poseDetectorRef = useRef<any>(null);
  const isInitializing = useRef(false);

  // Initialize TensorFlow.js models
  useEffect(() => {
    if (isInitializing.current || typeof window === 'undefined') return;
    isInitializing.current = true;

    const initializeTensorFlow = async () => {
      try {
        console.log('🔄 Loading TensorFlow.js models...');

        // Import TensorFlow.js modules
        const [tfCore, tfBackend, faceLandmarksDetection, poseDetection] = await Promise.all([
          import('@tensorflow/tfjs-core'),
          import('@tensorflow/tfjs-backend-webgl'),
          import('@tensorflow-models/face-landmarks-detection'),
          import('@tensorflow-models/pose-detection'),
        ]);

        // Set TensorFlow backend to WebGL
        await tfCore.setBackend('webgl');
        await tfCore.ready();
        console.log('✅ TensorFlow.js backend ready');

        // Initialize Face Landmarks Detection
        try {
          const faceModel = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
          const faceDetectorConfig: faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig = {
            runtime: 'tfjs',
            maxFaces: 1,
            refineLandmarks: true,
          };

          const faceDetector = await faceLandmarksDetection.createDetector(
            faceModel,
            faceDetectorConfig
          );

          faceDetectorRef.current = faceDetector;
          console.log('✅ Face landmarks detector loaded');
        } catch (err: any) {
          console.warn('Face detector initialization failed:', err.message);
        }

        // Initialize Pose Detection
        try {
          const poseModel = poseDetection.SupportedModels.MoveNet;
          const poseDetectorConfig: poseDetection.MoveNetModelConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING, // Fastest model
            enableSmoothing: true,
          };

          const detector = await poseDetection.createDetector(
            poseModel,
            poseDetectorConfig
          );

          poseDetectorRef.current = detector;
          console.log('✅ Pose detector loaded');
        } catch (err: any) {
          console.warn('Pose detector initialization failed:', err.message);
        }

        // Consider loaded if at least one model is available
        if (faceDetectorRef.current || poseDetectorRef.current) {
          setIsLoaded(true);
          console.log('✅ TensorFlow.js vision models loaded successfully');
        } else {
          throw new Error('No vision models could be initialized');
        }
      } catch (err: any) {
        console.error('❌ Failed to load TensorFlow.js:', err);
        const errorMessage = err.message || 'Failed to initialize TensorFlow.js models';
        setError(errorMessage);
        setIsLoaded(false);
      }
    };

    initializeTensorFlow();

    return () => {
      // Cleanup
      try {
        faceDetectorRef.current = null;
        poseDetectorRef.current = null;
      } catch (err) {
        console.warn('TensorFlow cleanup warning:', err);
      }
    };
  }, []);

  const analyzeFace = useCallback(async (imageData: ImageData): Promise<FaceDetectionResult | null> => {
    if (!faceDetectorRef.current || !isLoaded) {
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

      // Run face detection
      const faces = await faceDetectorRef.current.estimateFaces(canvas, {
        flipHorizontal: false,
      });

      if (faces && faces.length > 0) {
        const face = faces[0];

        // Convert keypoints to our format
        const landmarks: FaceLandmark[] = face.keypoints.map((kp: any) => ({
          x: kp.x / imageData.width,  // Normalize to 0-1
          y: kp.y / imageData.height,
          z: kp.z || 0,
        }));

        return {
          landmarks,
          boundingBox: face.box ? {
            xMin: face.box.xMin / imageData.width,
            yMin: face.box.yMin / imageData.height,
            width: face.box.width / imageData.width,
            height: face.box.height / imageData.height,
          } : undefined,
        };
      }

      return null;
    } catch (err) {
      console.error('Error analyzing face:', err);
      return null;
    }
  }, [isLoaded]);

  const analyzePose = useCallback(async (imageData: ImageData): Promise<PoseDetectionResult | null> => {
    if (!poseDetectorRef.current || !isLoaded) {
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
      const poses = await poseDetectorRef.current.estimatePoses(canvas, {
        flipHorizontal: false,
      });

      if (poses && poses.length > 0) {
        const pose = poses[0];

        // Convert keypoints to our format
        const landmarks: FaceLandmark[] = pose.keypoints.map((kp: any) => ({
          x: kp.x / imageData.width,  // Normalize to 0-1
          y: kp.y / imageData.height,
          z: 0,
        }));

        const visibility = pose.keypoints.map((kp: any) => kp.score || 0);

        return {
          landmarks,
          visibility,
        };
      }

      return null;
    } catch (err) {
      console.error('Error analyzing pose:', err);
      return null;
    }
  }, [isLoaded]);

  const cleanup = useCallback(() => {
    faceDetectorRef.current = null;
    poseDetectorRef.current = null;
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

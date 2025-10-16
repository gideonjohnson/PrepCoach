import { VisualMetrics } from './types';

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

export class VisualAnalyzer {
  private eyeContactHistory: boolean[] = [];
  private postureScores: number[] = [];
  private facialConfidenceScores: number[] = [];
  private gestureCount: number = 0;
  private lastGestureTime: number = 0;
  private startTime: number = Date.now();
  private frameCount: number = 0;
  private lastHeadPosition: { x: number; y: number } | null = null;
  private headMovementTotal: number = 0;

  // Face landmark indices (MediaPipe Face Mesh)
  private readonly LEFT_EYE_INDICES = [33, 133, 160, 159, 158, 157, 173];
  private readonly RIGHT_EYE_INDICES = [362, 263, 387, 386, 385, 384, 398];
  private readonly NOSE_TIP = 1;
  private readonly LEFT_IRIS = 468;
  private readonly RIGHT_IRIS = 473;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Analyze a video frame for visual metrics
   */
  analyzeFrame(
    faceResult: FaceDetectionResult | null,
    poseResult: PoseDetectionResult | null
  ): void {
    this.frameCount++;

    if (faceResult && faceResult.landmarks.length > 0) {
      // Eye contact analysis
      const isLookingAtCamera = this.detectEyeContact(faceResult.landmarks);
      this.eyeContactHistory.push(isLookingAtCamera);

      // Keep only last 300 frames (~10 seconds at 30fps)
      if (this.eyeContactHistory.length > 300) {
        this.eyeContactHistory.shift();
      }

      // Facial confidence (based on expression stability)
      const confidenceScore = this.calculateFacialConfidence(faceResult.landmarks);
      this.facialConfidenceScores.push(confidenceScore);

      if (this.facialConfidenceScores.length > 100) {
        this.facialConfidenceScores.shift();
      }

      // Head movement tracking
      this.trackHeadMovement(faceResult.landmarks);

      // Gesture detection
      this.detectGestures(faceResult.landmarks);
    }

    if (poseResult && poseResult.landmarks.length > 0) {
      // Posture analysis
      const postureScore = this.analyzePosture(poseResult.landmarks, poseResult.visibility);
      this.postureScores.push(postureScore);

      if (this.postureScores.length > 100) {
        this.postureScores.shift();
      }
    }
  }

  /**
   * Detect if the person is making eye contact with the camera
   */
  private detectEyeContact(landmarks: FaceLandmark[]): boolean {
    if (landmarks.length < 478) return false; // MediaPipe Face Mesh has 478 landmarks

    try {
      // Get iris positions
      const leftIris = landmarks[this.LEFT_IRIS];
      const rightIris = landmarks[this.RIGHT_IRIS];

      // Get eye corner positions
      const leftEyeLeft = landmarks[33];
      const leftEyeRight = landmarks[133];
      const rightEyeLeft = landmarks[362];
      const rightEyeRight = landmarks[263];

      // Calculate iris position relative to eye corners
      const leftIrisRatio = (leftIris.x - leftEyeLeft.x) / (leftEyeRight.x - leftEyeLeft.x);
      const rightIrisRatio = (rightIris.x - rightEyeLeft.x) / (rightEyeRight.x - rightEyeLeft.x);

      // Good eye contact: iris centered in eye (ratio ~0.5)
      // Allow some tolerance (0.35 - 0.65)
      const leftEyeGood = leftIrisRatio > 0.35 && leftIrisRatio < 0.65;
      const rightEyeGood = rightIrisRatio > 0.35 && rightIrisRatio < 0.65;

      return leftEyeGood && rightEyeGood;
    } catch (error) {
      console.error('Error detecting eye contact:', error);
      return false;
    }
  }

  /**
   * Calculate facial confidence based on expression stability
   */
  private calculateFacialConfidence(landmarks: FaceLandmark[]): number {
    if (landmarks.length < 478) return 50;

    try {
      // Analyze mouth shape (smile detection)
      const mouthLeft = landmarks[61];
      const mouthRight = landmarks[291];
      const mouthTop = landmarks[13];
      const mouthBottom = landmarks[14];

      const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x);
      const mouthHeight = Math.abs(mouthBottom.y - mouthTop.y);
      const mouthRatio = mouthHeight / (mouthWidth + 0.001);

      // Analyze eyebrow position (tension indicator)
      const leftEyebrowInner = landmarks[55];
      const rightEyebrowInner = landmarks[285];
      const noseBridge = landmarks[6];

      const leftBrowDistance = Math.abs(leftEyebrowInner.y - noseBridge.y);
      const rightBrowDistance = Math.abs(rightEyebrowInner.y - noseBridge.y);
      const avgBrowDistance = (leftBrowDistance + rightBrowDistance) / 2;

      // Calculate confidence score
      // Higher mouth ratio (smile) = higher confidence
      // Lower brow distance (relaxed) = higher confidence
      let confidenceScore = 50;

      if (mouthRatio > 0.3 && mouthRatio < 0.6) {
        confidenceScore += 20; // Natural expression
      }

      if (avgBrowDistance > 0.05) {
        confidenceScore += 15; // Relaxed eyebrows
      }

      // Check for stable eye openness
      const leftEyeTop = landmarks[159];
      const leftEyeBottom = landmarks[145];
      const rightEyeTop = landmarks[386];
      const rightEyeBottom = landmarks[374];

      const leftEyeHeight = Math.abs(leftEyeTop.y - leftEyeBottom.y);
      const rightEyeHeight = Math.abs(rightEyeTop.y - rightEyeBottom.y);
      const avgEyeHeight = (leftEyeHeight + rightEyeHeight) / 2;

      if (avgEyeHeight > 0.015) {
        confidenceScore += 15; // Eyes properly open
      }

      return Math.max(0, Math.min(100, confidenceScore));
    } catch (error) {
      console.error('Error calculating facial confidence:', error);
      return 50;
    }
  }

  /**
   * Track head movement
   */
  private trackHeadMovement(landmarks: FaceLandmark[]): void {
    if (landmarks.length < 1) return;

    const noseTip = landmarks[this.NOSE_TIP];
    const currentPosition = { x: noseTip.x, y: noseTip.y };

    if (this.lastHeadPosition) {
      const dx = currentPosition.x - this.lastHeadPosition.x;
      const dy = currentPosition.y - this.lastHeadPosition.y;
      const movement = Math.sqrt(dx * dx + dy * dy);

      // Scale movement (landmarks are normalized 0-1)
      this.headMovementTotal += movement * 1000; // Convert to pixel-equivalent
    }

    this.lastHeadPosition = currentPosition;
  }

  /**
   * Detect gestures (simplified - looks for significant hand movements)
   */
  private detectGestures(landmarks: FaceLandmark[]): void {
    const currentTime = Date.now();

    // Detect gestures based on head movement patterns
    // In a real implementation, this would use hand tracking
    if (this.lastGestureTime && currentTime - this.lastGestureTime > 2000) {
      // Check for significant head movement that might indicate gesturing
      if (this.lastHeadPosition) {
        const recentMovement = this.headMovementTotal / (this.frameCount + 1);
        if (recentMovement > 5) {
          // Threshold for gesture
          this.gestureCount++;
          this.lastGestureTime = currentTime;
        }
      }
    }

    if (!this.lastGestureTime) {
      this.lastGestureTime = currentTime;
    }
  }

  /**
   * Analyze posture from pose landmarks
   */
  private analyzePosture(landmarks: FaceLandmark[], visibility?: number[]): number {
    if (landmarks.length < 33) return 50; // MediaPipe Pose has 33 landmarks

    try {
      // Key pose landmarks
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];
      const nose = landmarks[0];

      let postureScore = 50;

      // Check shoulder alignment (should be level)
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      if (shoulderDiff < 0.05) {
        postureScore += 20; // Good shoulder alignment
      } else if (shoulderDiff > 0.1) {
        postureScore -= 10; // Poor alignment
      }

      // Check spine alignment (vertical from shoulders to hips)
      const shoulderCenter = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2,
      };
      const hipCenter = {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2,
      };

      const spineAngle = Math.abs(Math.atan2(
        shoulderCenter.x - hipCenter.x,
        hipCenter.y - shoulderCenter.y
      ));

      if (spineAngle < 0.2) {
        postureScore += 20; // Good spine alignment
      } else if (spineAngle > 0.4) {
        postureScore -= 10; // Leaning too much
      }

      // Check head position (should be above shoulders)
      if (nose.y < shoulderCenter.y) {
        postureScore += 10; // Head upright
      } else {
        postureScore -= 10; // Head drooping
      }

      // Check for visibility (if landmarks are not visible, posture might be poor)
      if (visibility) {
        const avgVisibility = visibility.reduce((a, b) => a + b, 0) / visibility.length;
        if (avgVisibility < 0.5) {
          postureScore -= 10; // Poor visibility suggests poor posture
        }
      }

      return Math.max(0, Math.min(100, postureScore));
    } catch (error) {
      console.error('Error analyzing posture:', error);
      return 50;
    }
  }

  /**
   * Get comprehensive visual metrics
   */
  getMetrics(): VisualMetrics {
    const eyeContactPercentage = this.eyeContactHistory.length > 0
      ? Math.round((this.eyeContactHistory.filter(Boolean).length / this.eyeContactHistory.length) * 100)
      : 0;

    const eyeContactDuration = this.eyeContactHistory.length > 0
      ? this.eyeContactHistory.filter(Boolean).length / 30 // Assuming 30fps
      : 0;

    const facialConfidence = this.facialConfidenceScores.length > 0
      ? Math.round(this.facialConfidenceScores.reduce((a, b) => a + b, 0) / this.facialConfidenceScores.length)
      : 0;

    const postureScore = this.postureScores.length > 0
      ? Math.round(this.postureScores.reduce((a, b) => a + b, 0) / this.postureScores.length)
      : 0;

    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    const smileFrequency = elapsedMinutes > 0
      ? this.facialConfidenceScores.filter(s => s > 70).length / elapsedMinutes
      : 0;

    const gestureFrequency = elapsedMinutes > 0
      ? this.gestureCount / elapsedMinutes
      : 0;

    const gestureAppropriacy = gestureFrequency >= 2 && gestureFrequency <= 3
      ? 100
      : gestureFrequency < 1
      ? 60
      : 70;

    const headMovement = Math.round(this.headMovementTotal / (this.frameCount + 1));

    const facingCamera = this.eyeContactHistory.length > 0
      ? this.eyeContactHistory.slice(-30).filter(Boolean).length > 15 // Last 30 frames
      : true;

    return {
      eyeContactPercentage,
      eyeContactDuration: Math.round(eyeContactDuration * 10) / 10,
      facialConfidence,
      smileFrequency: Math.round(smileFrequency * 10) / 10,
      postureScore,
      gestureFrequency: Math.round(gestureFrequency * 10) / 10,
      gestureAppropriacy,
      headMovement,
      facingCamera,
    };
  }

  /**
   * Reset analyzer for new session
   */
  reset(): void {
    this.eyeContactHistory = [];
    this.postureScores = [];
    this.facialConfidenceScores = [];
    this.gestureCount = 0;
    this.lastGestureTime = 0;
    this.startTime = Date.now();
    this.frameCount = 0;
    this.lastHeadPosition = null;
    this.headMovementTotal = 0;
  }
}

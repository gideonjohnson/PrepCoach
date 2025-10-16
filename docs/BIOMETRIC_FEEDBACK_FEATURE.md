# Interview Rehearsal Studio with Real-time Biometric Feedback

## Feature Overview

The Interview Rehearsal Studio is a comprehensive biometric analysis system that transforms PrepCoach into a professional interview training platform with real-time feedback on both verbal and non-verbal communication.

---

## ✅ Implemented Components

### 1. Type System (`app/practice/biometrics/types.ts`)

**Complete type definitions for:**
- `VocalMetrics` - Speech analysis (pace, pitch, volume, filler words)
- `VisualMetrics` - Body language and presence
- `StressMetrics` - Physiological indicators
- `BiometricSnapshot` - Time-series data points
- `BiometricSession` - Complete session data
- `FeedbackReport` - Detailed post-session analysis
- `InterviewerPersonality` - Three interviewer modes

**Pre-configured Interviewer Personalities:**
- **Friendly (Sarah Chen)** - Warm HR recruiter (difficulty: 4/10)
- **Tough (Marcus Rodriguez)** - Challenging technical interviewer (difficulty: 8/10)
- **Stoic (Dr. Elizabeth Warren)** - Reserved executive (difficulty: 7/10)

**Filler Word Detection:**
- 14 common filler words/phrases tracked
- Severity levels (high/medium/low)
- Regex patterns for accurate detection

### 2. Media Stream Manager (`app/practice/biometrics/useMediaStream.tsx`)

**Features:**
- Webcam access with HD resolution (1280x720)
- Audio capture with noise suppression
- Real-time frame capture from video
- Audio analysis with Web Audio API
- Frequency spectrum analysis
- Time-domain audio data
- Clean resource management

**API:**
```typescript
const {
  videoRef,           // Video element reference
  canvasRef,          // Canvas for frame capture
  isStreaming,        // Stream status
  hasVideo,           // Video available
  hasAudio,           // Audio available
  startStream,        // Initialize media
  stopStream,         // Clean shutdown
  captureFrame,       // Get ImageData
  getAudioData,       // Time-domain data
  getFrequencyData,   // Frequency data
} = useMediaStream();
```

### 3. Vocal Analytics Engine (`app/practice/biometrics/vocalAnalytics.ts`)

**VocalAnalyzer Class:**

**Metrics Calculated:**
1. **Speaking Pace** - Words per minute (ideal: 130-150 WPM)
2. **Pitch Analysis** - Average frequency and variation
3. **Volume Analysis** - Average volume and consistency (0-100)
4. **Energy Level** - Speech intensity from frequency data
5. **Filler Word Detection** - Count and categorization
6. **Pause Analysis** - Frequency and duration of pauses
7. **Clarity Score** - Overall speech quality (0-100)

**Usage:**
```typescript
const analyzer = new VocalAnalyzer();

// Feed data continuously
analyzer.addAudioFrame(timeData, frequencyData);
analyzer.setTranscript(transcript);

// Get comprehensive metrics
const metrics = analyzer.getMetrics();
```

**Key Algorithms:**
- FFT-based pitch detection
- RMS volume calculation
- Pattern matching for filler words
- Silence detection for pauses
- Multi-factor clarity scoring

---

## 🔧 Integration Architecture

### Data Flow

```
User Camera/Mic
      ↓
useMediaStream Hook
      ↓
┌─────────────┬────────────────┬──────────────┐
│             │                │              │
Video Frames  Audio Time Data  Frequency Data
│             │                │              │
↓             ↓                ↓              │
Visual        Vocal            Stress         │
Analyzer      Analyzer         Analyzer       │
↓             ↓                ↓              │
└─────────────┴────────────────┴──────────────┘
                     ↓
            BiometricSnapshot (every 1s)
                     ↓
             BiometricSession
                     ↓
            FeedbackReport Component
```

### Integration Points

**1. Practice Session Enhancement**
```typescript
// In practice/page.tsx - InterviewSession component

import { useMediaStream } from './biometrics/useMediaStream';
import { VocalAnalyzer } from './biometrics/vocalAnalytics';

function InterviewSession() {
  const mediaStream = useMediaStream();
  const vocalAnalyzer = useRef(new VocalAnalyzer());

  // Start biometric tracking
  useEffect(() => {
    if (isRecording) {
      mediaStream.startStream({ video: true, audio: true });

      const interval = setInterval(() => {
        const audioData = mediaStream.getAudioData();
        const freqData = mediaStream.getFrequencyData();
        vocalAnalyzer.current.addAudioFrame(audioData, freqData);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRecording]);
}
```

**2. Real-time Feedback Display**
```typescript
// Show metrics during recording
<div className="biometric-panel">
  <MetricCard
    label="Speaking Pace"
    value={`${metrics.pace} WPM`}
    status={metrics.pace >= 130 && metrics.pace <= 150 ? 'good' : 'warning'}
  />
  <MetricCard
    label="Filler Words"
    value={metrics.fillerWordCount}
    status={metrics.fillerWordCount < 5 ? 'good' : 'warning'}
  />
  <MetricCard
    label="Volume"
    value={`${metrics.volume}%`}
    status={metrics.volume >= 40 && metrics.volume <= 80 ? 'good' : 'warning'}
  />
</div>
```

---

## 📊 Feedback Report Component Structure

### Post-Session Report

```typescript
interface FeedbackReportProps {
  session: BiometricSession;
  onClose: () => void;
}

<FeedbackReport>
  <ReportHeader>
    - Overall score (0-100)
    - Session duration
    - Questions answered
    - Grade badge (A+, A, B+, etc.)
  </ReportHeader>

  <ScoreBreakdown>
    - Vocal Score (with chart)
    - Visual Score (with chart)
    - Confidence Score (with chart)
    - Industry benchmarks
  </ScoreBreakdown>

  <DetailedMetrics>
    <VocalSection>
      - Pace analysis
      - Pitch variation chart
      - Volume consistency chart
      - Filler word breakdown
      - Pause pattern analysis
    </VocalSection>

    <VisualSection>
      - Eye contact percentage
      - Posture score
      - Gesture appropriacy
      - Facial confidence
    </VisualSection>

    <StressSection>
      - Estimated heart rate
      - Stress level trends
      - Confidence timeline
      - Nervousness indicators
    </StressSection>
  </DetailedMetrics>

  <Recommendations>
    - High priority improvements
    - Medium priority suggestions
    - Strengths to maintain
    - Practice exercises
  </Recommendations>

  <ProgressTracking>
    - Trend over last 5 sessions
    - Improvement percentage
    - Comparison to goals
  </ProgressTracking>
</FeedbackReport>
```

---

## 🎯 Implementation Roadmap

### Phase 1: Core Biometrics (✅ Complete)
- [x] Type system and interfaces
- [x] Media stream management
- [x] Vocal analytics engine
- [x] Base infrastructure

### Phase 2: Visual Analytics (Next Steps)
- [ ] Face detection using MediaPipe or face-api.js
- [ ] Eye tracking algorithm
- [ ] Posture analysis
- [ ] Gesture recognition
- [ ] Facial expression analysis

### Phase 3: Stress Metrics (Next Steps)
- [ ] Heart rate estimation (remote PPG)
- [ ] Vocal stress detection
- [ ] Cognitive load estimation
- [ ] Confidence scoring algorithm

### Phase 4: UI Components (Next Steps)
- [ ] Real-time metrics dashboard
- [ ] Biometric data visualization
- [ ] Feedback report component
- [ ] Progress charts
- [ ] Recommendation cards

### Phase 5: Interviewer Personalities (Next Steps)
- [ ] Dynamic question adaptation
- [ ] Personality-based responses
- [ ] Interruption logic
- [ ] Follow-up intensity control

### Phase 6: Storage & Analytics (Next Steps)
- [ ] Session storage in database
- [ ] Historical trend analysis
- [ ] Benchmark comparisons
- [ ] Export reports (PDF)

---

## 🚀 Quick Start Guide

### 1. Enable Biometric Tracking

```typescript
// In your interview session
const enableBiometrics = true;

if (enableBiometrics) {
  // Request camera/mic permissions
  await mediaStream.startStream({ video: true, audio: true });

  // Initialize analyzers
  const vocalAnalyzer = new VocalAnalyzer();
  const visualAnalyzer = new VisualAnalyzer();
  const stressAnalyzer = new StressAnalyzer();

  // Start analysis loop
  startBiometricAnalysis();
}
```

### 2. Collect Data During Interview

```typescript
const analysisInterval = setInterval(() => {
  // Capture current frame
  const frame = mediaStream.captureFrame();

  // Get audio data
  const audioData = mediaStream.getAudioData();
  const freqData = mediaStream.getFrequencyData();

  // Update analyzers
  vocalAnalyzer.addAudioFrame(audioData, freqData);
  visualAnalyzer.analyzeFrame(frame);
  stressAnalyzer.update(audioData, frame);

  // Create snapshot
  const snapshot: BiometricSnapshot = {
    timestamp: Date.now(),
    vocal: vocalAnalyzer.getMetrics(),
    visual: visualAnalyzer.getMetrics(),
    stress: stressAnalyzer.getMetrics(),
  };

  session.snapshots.push(snapshot);
}, 1000); // Every second
```

### 3. Generate Report

```typescript
// After interview ends
const report = generateFeedbackReport(session);

// Display to user
<FeedbackReportModal report={report} onClose={closeFeedback} />
```

---

## 📈 Metrics Explained

### Vocal Metrics

**Speaking Pace (WPM)**
- **Ideal Range:** 130-150 words per minute
- **Too Slow (<120):** May sound unsure or unprepared
- **Too Fast (>160):** Hard to follow, may seem nervous

**Pitch Variation**
- **Low Variation:** Monotone, disengaging
- **Medium Variation:** Natural, engaging (ideal)
- **High Variation:** May seem overly emotional

**Volume Consistency**
- **High (>80):** Good control
- **Medium (50-80):** Acceptable
- **Low (<50):** Inconsistent, potentially distracting

**Filler Words**
- **0-3:** Excellent
- **4-7:** Good
- **8-15:** Needs improvement
- **15+:** Significant issue

### Visual Metrics

**Eye Contact**
- **80-95%:** Excellent, confident
- **60-79%:** Good
- **40-59%:** Needs work
- **<40%:** May appear distracted or nervous

**Posture Score**
- Based on spine alignment
- Shoulder position
- Head tilt
- Overall symmetry

**Gesture Frequency**
- **2-3 per minute:** Natural, engaging
- **0-1:** May seem stiff
- **4+:** May be distracting

### Stress Metrics

**Heart Rate (estimated)**
- **Normal:** 60-80 bpm
- **Elevated:** 80-100 bpm (moderate stress)
- **High:** 100+ bpm (high stress)

**Confidence Score**
- Composite of all metrics
- 0-40: Low confidence
- 41-70: Moderate confidence
- 71-100: High confidence

---

## 🎨 UI Components

### Real-Time Metrics Panel

```typescript
<BiometricsPanel>
  <MetricsGrid>
    <VocalMetric
      icon="🎙️"
      label="Speaking Pace"
      value="142 WPM"
      status="excellent"
      trend="up"
    />
    <VocalMetric
      icon="📊"
      label="Volume"
      value="65%"
      status="good"
      trend="stable"
    />
    <VisualMetric
      icon="👁️"
      label="Eye Contact"
      value="87%"
      status="excellent"
      trend="up"
    />
    <StressMetric
      icon="💚"
      label="Confidence"
      value="82/100"
      status="excellent"
      trend="up"
    />
  </MetricsGrid>

  <LiveFeedback>
    "Great pace! Try to reduce filler words."
  </LiveFeedback>
</BiometricsPanel>
```

### Video Preview with Overlay

```typescript
<VideoContainer>
  <video ref={videoRef} className="mirror-effect" />

  <Overlay>
    <EyeTrackingIndicator position={eyePosition} />
    <FaceDetectionBox faces={detectedFaces} />
    <PostureGuide skeleton={poseData} />
  </Overlay>

  <MetricsOverlay>
    <MiniMetric label="HR" value="78" />
    <MiniMetric label="Pace" value="145" />
    <MiniMetric label="Vol" value="68%" />
  </MetricsOverlay>
</VideoContainer>
```

---

## 🔐 Privacy & Security

**Data Handling:**
- All video/audio processing happens client-side
- No raw video/audio stored on servers
- Only metrics and scores are saved
- User can disable biometric tracking anytime
- Clear consent flow before camera/mic access

**Storage:**
```typescript
interface StoredBiometricData {
  sessionId: string;
  userId: string;
  timestamp: number;
  // Only aggregated metrics, no raw data
  vocalMetrics: VocalMetrics;
  visualMetrics: VisualMetrics;
  stressMetrics: StressMetrics;
  // NO video frames
  // NO audio recordings
}
```

---

## 📱 Mobile Considerations

**Responsive Design:**
- Simplified metrics panel on mobile
- Camera preview optimized for small screens
- Touch-friendly controls
- Reduced processing for battery life

**Performance:**
- Analysis interval adjustable (1s on desktop, 2s on mobile)
- Lower resolution video processing on mobile
- Simplified algorithms for mobile devices

---

## 🧪 Testing Strategy

**Unit Tests:**
- VocalAnalyzer methods
- Metric calculations
- Filler word detection
- Pause analysis

**Integration Tests:**
- Media stream management
- Real-time data flow
- Report generation
- Storage operations

**E2E Tests:**
- Complete interview with biometrics
- Feedback report generation
- Multiple interviewer personalities
- Permission handling

---

## 🎓 Future Enhancements

**Advanced Features:**
1. **AI-Powered Coaching** - Real-time tips during interview
2. **Emotion Detection** - Recognize 7 basic emotions
3. **Speech Recognition** - Live transcription without API calls
4. **Multi-Language Support** - Analyze interviews in any language
5. **Team Benchmarking** - Compare against team averages
6. **Custom Metrics** - Company-specific evaluation criteria
7. **Recording Playback** - Review with synchronized metrics
8. **Mobile App** - Native iOS/Android with better camera access

**ML Enhancements:**
1. **Personalized Baselines** - Learn user's normal patterns
2. **Predictive Coaching** - Anticipate issues before they happen
3. **Industry-Specific Models** - Tailored for tech, finance, healthcare, etc.
4. **Accent Adaptation** - Better analysis for non-native speakers

---

## 📚 Technical Dependencies

**Required Libraries:**
```json
{
  "dependencies": {
    "@mediapipe/face_detection": "^0.4.0",
    "@mediapipe/pose": "^0.5.0",
    "@tensorflow/tfjs": "^4.11.0",
    "face-api.js": "^0.22.2",
    "recharts": "^2.9.0"
  }
}
```

**Browser Requirements:**
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 15+
- Edge 90+

**APIs Used:**
- MediaDevices API (camera/mic)
- Web Audio API (audio analysis)
- Canvas API (frame capture)
- MediaPipe (face/pose detection)

---

## 🚀 Deployment Checklist

- [ ] Add camera/microphone permission prompts
- [ ] Implement privacy policy updates
- [ ] Add biometrics toggle in settings
- [ ] Create onboarding tutorial
- [ ] Set up analytics for feature usage
- [ ] Add feature flag for gradual rollout
- [ ] Test on various devices/browsers
- [ ] Create user documentation
- [ ] Train customer support team
- [ ] Monitor performance metrics

---

## Summary

The Interview Rehearsal Studio transforms PrepCoach into a comprehensive interview training platform with professional-grade biometric feedback. The core infrastructure is complete and ready for integration with visual and stress analytics.

**Current Status:**
- ✅ Type system complete
- ✅ Media stream manager ready
- ✅ Vocal analytics engine functional
- 🔧 Visual analytics (implementation guide provided)
- 🔧 Stress metrics (implementation guide provided)
- 🔧 UI components (design specifications provided)

**Next Steps:**
1. Integrate TensorFlow.js or MediaPipe for face detection
2. Implement visual presence analyzer
3. Build stress metrics calculator
4. Create feedback report UI components
5. Add interviewer personality system
6. Test end-to-end flow

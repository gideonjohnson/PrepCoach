# Visual Analytics Troubleshooting Guide

## Known Issue: MediaPipe WASM Compatibility

### Problem

When enabling biometric analytics, you may see the error:
```
Aborted(Module.arguments has been replaced with plain arguments_)
Visual Analysis Unavailable
```

### Root Cause

MediaPipe uses WebAssembly (WASM) modules that have compatibility issues with:
- Next.js 15 (Turbopack mode)
- Certain browser configurations
- Module loading in development vs production

### Current Status

✅ **Vocal Analytics** - Fully functional
- Speaking pace (WPM)
- Volume analysis
- Filler word detection
- Clarity scoring
- Pause analysis
- Energy level

❌ **Visual Analytics** - Temporarily disabled
- Eye contact detection
- Posture analysis
- Facial confidence
- Head movement tracking

### Immediate Solution

The application gracefully falls back to vocal-only analysis:

1. **User sees clear warning message**:
   ```
   Visual Analysis Temporarily Unavailable
   Visual analytics (eye contact, posture) are currently disabled due to browser compatibility.
   Good news: Vocal analysis is fully functional and will provide comprehensive feedback.
   ```

2. **No impact on core features**:
   - Interview sessions work normally
   - Audio recording works
   - AI feedback works
   - Vocal biometrics work
   - Only visual metrics are missing

3. **Data still saved**:
   - All vocal metrics saved to database
   - Visual metrics fields remain null
   - Session history intact

### Workarounds

#### Option 1: Use Chrome/Edge (Recommended)
```bash
# Open in Chrome or Edge browser
# MediaPipe has best compatibility with Chromium-based browsers
```

#### Option 2: Disable Turbopack (Development Only)
```json
// package.json
{
  "scripts": {
    "dev": "next dev"  // Remove --turbopack flag
  }
}
```

#### Option 3: Build for Production
```bash
npm run build
npm start
# Production builds have better WASM support
```

### Permanent Solutions (In Progress)

#### Solution 1: Use TensorFlow.js Face Detection

Replace MediaPipe with TensorFlow.js FaceMesh:

```typescript
// Install
npm install @tensorflow/tfjs @tensorflow-models/face-landmarks-detection

// Implementation
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: 'tfjs',  // Better browser compatibility
};

const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
```

**Advantages**:
- Better Next.js compatibility
- More control over model loading
- Stable WASM support

**Disadvantages**:
- Slightly different API
- May require code refactoring

#### Solution 2: Use face-api.js

Alternative lightweight library:

```typescript
// Install
npm install face-api.js

// Implementation
import * as faceapi from 'face-api.js';

await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

const detections = await faceapi
  .detectAllFaces(videoElement)
  .withFaceLandmarks();
```

**Advantages**:
- Lightweight
- No WASM issues
- Simple API

**Disadvantages**:
- Less accurate than MediaPipe
- Fewer landmarks (68 vs 478)

#### Solution 3: Server-Side Processing (Future)

Process video frames on server:

```typescript
// Client sends frames to server
const formData = new FormData();
formData.append('frame', canvasBlob);

const response = await fetch('/api/analyze-frame', {
  method: 'POST',
  body: formData
});

const { eyeContact, posture } = await response.json();
```

**Advantages**:
- No browser compatibility issues
- Can use more powerful models
- Consistent across all users

**Disadvantages**:
- Privacy concerns (video sent to server)
- Higher server costs
- Network latency
- Not suitable for real-time feedback

### Testing Visual Analytics

Once a workaround is applied, test with these steps:

#### 1. Verify Model Loading
```javascript
// Open browser console
// Look for these logs:
🔄 Loading MediaPipe models...
✅ Face Mesh loaded
✅ Pose detection loaded
✅ MediaPipe models loaded successfully
```

#### 2. Test Eye Contact
```
1. Enable biometrics
2. Start recording
3. Look directly at camera → eyeContactPercentage should increase
4. Look away → eyeContactPercentage should decrease
```

#### 3. Test Posture
```
1. Sit upright with shoulders level → postureScore ~70-90
2. Slouch → postureScore should drop
3. Tilt head → postureScore should drop
```

#### 4. Check Metrics Panel
```
BiometricsPanel should show:
- 👁️ Eye Contact
- 🧍 Posture
- 😊 Expression
```

### Development Roadmap

#### Phase 1: Immediate (Complete)
- [x] Detect MediaPipe errors
- [x] Show user-friendly warning message
- [x] Fall back to vocal-only analysis
- [x] Document the issue

#### Phase 2: Short-term (Next Week)
- [ ] Implement TensorFlow.js alternative
- [ ] Test with production build
- [ ] Add browser compatibility detection
- [ ] Update documentation

#### Phase 3: Long-term (Next Month)
- [ ] Evaluate server-side processing
- [ ] Implement caching strategy
- [ ] Add fallback model loading
- [ ] Performance optimization

### Technical Details

#### WASM Error Explanation

The error message:
```
Aborted(Module.arguments has been replaced with plain arguments_)
```

Indicates that:
1. MediaPipe's WASM module expects `Module.arguments`
2. Modern bundlers (like Turbopack) replace this with `arguments_`
3. The mismatch causes the module to abort initialization

#### Module Loading Flow

```
useMediaPipe hook initialized
    ↓
Dynamic import('@mediapipe/face_mesh')
    ↓
FaceMesh constructor called
    ↓
WASM module loaded from CDN
    ↓
ERROR: arguments_ not found
    ↓
Promise rejected → error state set
    ↓
UI shows warning message
```

#### Error Handling Code

The app catches errors at multiple levels:

```typescript
// Level 1: Import error
const [faceMeshModule, poseModule] = await Promise.all([
  import('@mediapipe/face_mesh').catch((err) => {
    console.warn('Face Mesh import failed:', err.message);
    return null;
  }),
  // ...
]);

// Level 2: Initialization error
try {
  await faceMesh.initialize();
  faceMeshRef.current = faceMesh;
} catch (err: any) {
  console.warn('Face Mesh initialization failed:', err.message);
}

// Level 3: Analysis error
try {
  const frameData = mediaStream.captureFrame();
  const [faceResult, poseResult] = await Promise.all([
    mediaPipe.analyzeFace(frameData),
    mediaPipe.analyzePose(frameData),
  ]);
} catch (err) {
  console.error('Error during visual analysis:', err);
}
```

### Browser Compatibility Matrix

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 90+ | ⚠️ Partial | Works in production, issues in dev |
| Firefox | 88+ | ⚠️ Partial | WASM loading issues |
| Safari | 15+ | ❌ Not Working | Limited WASM support |
| Edge | 90+ | ⚠️ Partial | Same as Chrome |

### Reporting Issues

If you encounter visual analytics issues:

1. **Check Console**: Look for MediaPipe errors
2. **Browser Version**: Ensure you're using a supported browser
3. **Network**: Check if CDN files are accessible
4. **Build Mode**: Test in production build

### Contact

For questions or issues:
- Check documentation: `docs/VISUAL_ANALYTICS_IMPLEMENTATION.md`
- Review biometrics feature doc: `docs/BIOMETRIC_FEEDBACK_FEATURE.md`
- Open GitHub issue (if applicable)

### Summary

**Current State**:
- Vocal analytics: ✅ Fully functional
- Visual analytics: ⚠️ Temporarily disabled
- User experience: ✅ Graceful degradation
- Data integrity: ✅ Maintained

**Next Steps**:
1. Test TensorFlow.js alternative
2. Deploy production build
3. Gather user feedback
4. Iterate on solution

The app remains fully functional for interview practice with comprehensive vocal feedback. Visual analytics will be re-enabled once compatibility issues are resolved.

import { VocalMetrics, COMMON_FILLER_WORDS } from './types';

export class VocalAnalyzer {
  private audioDataHistory: Uint8Array[] = [];
  private frequencyHistory: Uint8Array[] = [];
  private transcript: string = '';
  private wordTimestamps: Array<{ word: string; timestamp: number }> = [];
  private startTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  // Add audio data for analysis
  addAudioFrame(timeData: Uint8Array, frequencyData: Uint8Array): void {
    this.audioDataHistory.push(new Uint8Array(timeData));
    this.frequencyHistory.push(new Uint8Array(frequencyData));

    // Keep only last 100 frames to manage memory
    if (this.audioDataHistory.length > 100) {
      this.audioDataHistory.shift();
      this.frequencyHistory.shift();
    }
  }

  // Set transcript for text analysis
  setTranscript(text: string, wordTimestamps?: Array<{ word: string; timestamp: number }>): void {
    this.transcript = text;
    if (wordTimestamps) {
      this.wordTimestamps = wordTimestamps;
    }
  }

  // Calculate speaking pace (words per minute)
  calculatePace(): number {
    if (!this.transcript) return 0;

    const words = this.transcript.trim().split(/\s+/).filter((w) => w.length > 0);
    const duration = (Date.now() - this.startTime) / 1000 / 60; // minutes

    return duration > 0 ? Math.round(words.length / duration) : 0;
  }

  // Analyze pitch from frequency data
  analyzePitch(): { average: number; variation: number } {
    if (this.frequencyHistory.length === 0) {
      return { average: 0, variation: 0 };
    }

    const pitches: number[] = [];

    this.frequencyHistory.forEach((freqData) => {
      // Find fundamental frequency (simplified approach)
      let maxValue = 0;
      let maxIndex = 0;

      for (let i = 0; i < freqData.length; i++) {
        if (freqData[i] > maxValue) {
          maxValue = freqData[i];
          maxIndex = i;
        }
      }

      // Convert bin index to frequency (assuming 44.1kHz sample rate, 2048 FFT)
      const frequency = (maxIndex * 44100) / 2048;

      // Filter for human voice range (85-255 Hz for male, 165-255 Hz for female)
      if (frequency >= 85 && frequency <= 500 && maxValue > 50) {
        pitches.push(frequency);
      }
    });

    if (pitches.length === 0) {
      return { average: 0, variation: 0 };
    }

    const average = pitches.reduce((a, b) => a + b, 0) / pitches.length;
    const variance =
      pitches.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / pitches.length;
    const variation = Math.sqrt(variance);

    return {
      average: Math.round(average),
      variation: Math.round(variation),
    };
  }

  // Calculate volume metrics
  analyzeVolume(): { average: number; consistency: number } {
    if (this.audioDataHistory.length === 0) {
      return { average: 0, consistency: 0 };
    }

    const volumes: number[] = [];

    this.audioDataHistory.forEach((audioData) => {
      // Calculate RMS (Root Mean Square) for volume
      let sum = 0;
      for (let i = 0; i < audioData.length; i++) {
        const normalized = (audioData[i] - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / audioData.length);
      volumes.push(rms);
    });

    const average = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const variance =
      volumes.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / volumes.length;
    const stdDev = Math.sqrt(variance);

    // Convert to 0-100 scale
    const averageVolume = Math.min(100, Math.round(average * 200));
    const consistency = Math.max(0, 100 - Math.round(stdDev * 200));

    return { average: averageVolume, consistency };
  }

  // Calculate energy level from audio
  calculateEnergyLevel(): number {
    if (this.frequencyHistory.length === 0) return 0;

    const recentFrames = this.frequencyHistory.slice(-10);
    let totalEnergy = 0;

    recentFrames.forEach((freqData) => {
      const energy = Array.from(freqData).reduce((sum, val) => sum + val, 0);
      totalEnergy += energy;
    });

    const averageEnergy = totalEnergy / recentFrames.length / recentFrames[0].length;
    return Math.min(100, Math.round(averageEnergy / 2.55));
  }

  // Detect filler words
  detectFillerWords(): {
    count: number;
    words: Array<{ word: string; timestamp: number; count: number }>;
  } {
    if (!this.transcript) {
      return { count: 0, words: [] };
    }

    const fillerWordCounts = new Map<string, number>();
    const text = this.transcript.toLowerCase();

    COMMON_FILLER_WORDS.forEach((filler) => {
      filler.patterns.forEach((pattern) => {
        const matches = text.match(pattern);
        if (matches) {
          const currentCount = fillerWordCounts.get(filler.word) || 0;
          fillerWordCounts.set(filler.word, currentCount + matches.length);
        }
      });
    });

    const words = Array.from(fillerWordCounts.entries()).map(([word, count]) => ({
      word,
      timestamp: Date.now(),
      count,
    }));

    const totalCount = words.reduce((sum, item) => sum + item.count, 0);

    return { count: totalCount, words };
  }

  // Analyze pauses
  analyzePauses(): { count: number; averageLength: number } {
    // Simplified pause detection based on audio data
    if (this.audioDataHistory.length === 0) {
      return { count: 0, averageLength: 0 };
    }

    const silenceThreshold = 0.05;
    let pauseCount = 0;
    const pauseLengths: number[] = [];
    let currentPauseLength = 0;
    let inPause = false;

    this.audioDataHistory.forEach((audioData) => {
      let sum = 0;
      for (let i = 0; i < audioData.length; i++) {
        const normalized = (audioData[i] - 128) / 128;
        sum += Math.abs(normalized);
      }
      const average = sum / audioData.length;

      if (average < silenceThreshold) {
        if (!inPause) {
          inPause = true;
          currentPauseLength = 1;
        } else {
          currentPauseLength++;
        }
      } else {
        if (inPause && currentPauseLength > 3) {
          // Minimum 3 frames for a pause
          pauseCount++;
          pauseLengths.push(currentPauseLength * 0.1); // ~0.1s per frame
        }
        inPause = false;
        currentPauseLength = 0;
      }
    });

    const averageLength =
      pauseLengths.length > 0
        ? pauseLengths.reduce((a, b) => a + b, 0) / pauseLengths.length
        : 0;

    return { count: pauseCount, averageLength: Math.round(averageLength * 10) / 10 };
  }

  // Calculate clarity score based on various factors
  calculateClarity(): number {
    const pace = this.calculatePace();
    const { count: fillerCount } = this.detectFillerWords();
    const wordCount = this.transcript.trim().split(/\s+/).length;

    // Ideal pace is 130-150 WPM
    const pacePenalty = Math.abs(pace - 140) / 140;

    // Filler word penalty (more than 5% is problematic)
    const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;
    const fillerPenalty = Math.min(1, fillerRatio / 0.05);

    // Combine metrics
    const clarityScore = Math.max(0, 100 - pacePenalty * 30 - fillerPenalty * 40);

    return Math.round(clarityScore);
  }

  // Get comprehensive vocal metrics
  getMetrics(): VocalMetrics {
    const pace = this.calculatePace();
    const { average: averagePitch, variation: pitchVariation } = this.analyzePitch();
    const { average: volume, consistency: volumeConsistency } = this.analyzeVolume();
    const energyLevel = this.calculateEnergyLevel();
    const clarity = this.calculateClarity();
    const { count: fillerWordCount, words: fillerWords } = this.detectFillerWords();
    const { count: pauseCount, averageLength: averagePauseLength } = this.analyzePauses();

    return {
      pace,
      averagePitch,
      pitchVariation,
      volume,
      volumeConsistency,
      energyLevel,
      clarity,
      fillerWordCount,
      fillerWords,
      pauseCount,
      averagePauseLength,
    };
  }

  // Reset analyzer
  reset(): void {
    this.audioDataHistory = [];
    this.frequencyHistory = [];
    this.transcript = '';
    this.wordTimestamps = [];
    this.startTime = Date.now();
  }
}

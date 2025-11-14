'use client';

import { useState, useEffect, useRef } from 'react';
import AIAvatar from '../practice/AIAvatar';
import { InterviewerSettings } from './InterviewerConfig';

interface VideoInterviewerProps {
  question: string;
  settings: InterviewerSettings;
  onSpeakingChange?: (isSpeaking: boolean) => void;
  autoPlay?: boolean;
}

export default function VideoInterviewer({
  question,
  settings,
  onSpeakingChange,
  autoPlay = true
}: VideoInterviewerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate video/audio when question changes
  useEffect(() => {
    if (question && autoPlay) {
      generateInterviewerMedia();
    }
  }, [question, settings, autoPlay]);

  // Notify parent of speaking state
  useEffect(() => {
    onSpeakingChange?.(isPlaying);
  }, [isPlaying, onSpeakingChange]);

  const generateInterviewerMedia = async () => {
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setAudioUrl(null);

    try {
      // Realistic video is disabled - use animated avatar with audio
      await generateAudioOnly();
    } catch (err: any) {
      console.error('Media generation error:', err);
      const errorMessage = err.message || 'Failed to generate interviewer media';
      setError(errorMessage);
      // Fallback to browser TTS
      playWithBrowserTTS();
    } finally {
      setIsLoading(false);
    }
  };

  const generateAudioOnly = async () => {
    console.log('🎙️ Generating audio for question:', question.substring(0, 50) + '...');
    console.log('Settings:', { voiceId: settings.voiceId, tone: settings.tone });

    const response = await fetch('/api/interviewer/generate-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: question,
        voiceId: settings.voiceId,
        tone: settings.tone,
      }),
    });

    console.log('📡 Response status:', response.status);
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (response.ok && data.audioData) {
      console.log('✅ Audio data received, converting to blob...');
      // Convert base64 to blob URL
      const audioBlob = base64ToBlob(data.audioData, data.mimeType);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      console.log('✅ Audio URL created successfully');
    } else if (data.mode === 'browser-tts') {
      console.log('ℹ️ Using browser TTS fallback');
      playWithBrowserTTS();
    } else {
      console.error('❌ Audio generation failed:', data);
      throw new Error(data.error || data.details || 'Failed to generate audio');
    }
  };

  const playWithBrowserTTS = () => {
    // Fallback to browser text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(question);

      // Wait for voices to load
      let voices = window.speechSynthesis.getVoices();

      // Load voices if not already loaded
      if (voices.length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          voices = window.speechSynthesis.getVoices();
          selectAndSpeak(voices, utterance);
        });
      } else {
        selectAndSpeak(voices, utterance);
      }
    }
  };

  const selectAndSpeak = (voices: SpeechSynthesisVoice[], utterance: SpeechSynthesisUtterance) => {
    // Priority order for female voices
    let selectedVoice = null;

    if (settings.gender === 'female') {
      // Try to find female voice by name patterns
      selectedVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('linda') ||
        voice.name.toLowerCase().includes('google us english') && voice.name.includes('4')
      );

      // If no female-named voice found, try by language with US priority
      if (!selectedVoice && settings.accent === 'american') {
        selectedVoice = voices.find(voice =>
          voice.lang.startsWith('en-US') && !voice.name.toLowerCase().includes('male')
        );
      }

      // Fallback to any English voice that's not explicitly male
      if (!selectedVoice) {
        selectedVoice = voices.find(voice =>
          voice.lang.startsWith('en-') && !voice.name.toLowerCase().includes('male')
        );
      }
    } else if (settings.gender === 'male') {
      selectedVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('male') ||
        voice.name.toLowerCase().includes('david') ||
        voice.name.toLowerCase().includes('mark')
      );
    }

    // Apply accent if specified
    if (settings.accent === 'british' && !selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.includes('GB'));
    } else if (settings.accent === 'australian' && !selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.includes('AU'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('Selected voice:', selectedVoice.name, selectedVoice.lang);
    } else {
      console.log('Using default voice, available voices:', voices.map(v => v.name));
    }

    // Adjust based on tone
    switch (settings.tone) {
      case 'friendly':
        utterance.pitch = 1.1;
        utterance.rate = 0.9;
        break;
      case 'strict':
        utterance.pitch = 0.9;
        utterance.rate = 1.1;
        break;
      case 'encouraging':
        utterance.pitch = 1.2;
        utterance.rate = 0.95;
        break;
      default:
        utterance.pitch = 1;
        utterance.rate = 1;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const replayQuestion = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playWithBrowserTTS();
    }
  };

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  return (
    <div className="relative">
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 font-medium">Generating interviewer...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
          <p className="text-red-700 font-semibold mb-2">⚠️ Video Generation Error</p>
          <p className="text-red-700 text-sm mb-2">{error}</p>
          <p className="text-red-600 text-xs mb-2">Using browser voice as fallback. Check browser console for details.</p>
          <button
            onClick={generateInterviewerMedia}
            className="mt-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Realistic Video Interviewer */}
      {settings.type === 'realistic' && videoUrl && !isLoading && (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200 bg-black">
          <video
            ref={videoRef}
            autoPlay
            onPlay={handleVideoPlay}
            onEnded={handleVideoEnd}
            className="w-full h-auto max-h-[500px] object-cover"
            playsInline
            preload="metadata"
            controls={false}
            muted={false}
            webkit-playsinline="true"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>

          {/* Interviewer Label */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-white text-sm font-semibold">Your Interviewer</span>
              </div>
              <button
                onClick={replayQuestion}
                className="text-white hover:text-blue-400 transition-colors"
                title="Replay"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Avatar with Audio */}
      {settings.type === 'animated' && !isLoading && (
        <div className="flex flex-col items-center">
          <AIAvatar isSpeaking={isPlaying} />
          {audioUrl && (
            <audio
              ref={audioRef}
              autoPlay
              onPlay={handleAudioPlay}
              onEnded={handleAudioEnd}
              className="hidden"
              preload="metadata"
            >
              <source src={audioUrl} type="audio/mpeg" />
              <source src={audioUrl} type="audio/mp4" />
              <source src={audioUrl} type="audio/webm" />
              <source src={audioUrl} type="audio/ogg" />
            </audio>
          )}
        </div>
      )}

      {/* Replay Button for Animated */}
      {settings.type === 'animated' && !isLoading && (audioUrl || !error) && (
        <div className="flex justify-center mt-4">
          <button
            onClick={replayQuestion}
            disabled={isPlaying}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 hover:from-orange-200 hover:to-orange-100 font-medium rounded-full transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            {isPlaying ? 'Speaking...' : 'Replay Question'}
          </button>
        </div>
      )}
    </div>
  );
}

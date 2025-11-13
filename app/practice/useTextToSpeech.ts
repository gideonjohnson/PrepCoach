'use client';

import { useState, useEffect, useRef } from 'react';

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      }
    };

    // Voices might load asynchronously
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = async (text: string) => {
    // Cancel any ongoing speech
    stop();

    setIsSpeaking(true);

    try {
      console.log('🔊 Attempting ElevenLabs TTS...');
      // Try ElevenLabs first for high-quality TTS
      const response = await fetch('/api/tts/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      console.log('📡 ElevenLabs API response status:', response.status);

      if (response.ok) {
        console.log('✅ ElevenLabs TTS succeeded! Playing high-quality audio...');
        // ElevenLabs succeeded - play the audio
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          console.error('❌ Audio playback error, falling back to browser TTS');
          speakWithBrowserTTS(text);
        };

        await audio.play();
        return;
      } else {
        const errorData = await response.json();
        console.warn('⚠️ ElevenLabs not available:', errorData);
      }
    } catch (error) {
      console.warn('⚠️ ElevenLabs TTS failed, falling back to browser TTS:', error);
    }

    // Fallback to browser TTS
    console.log('🔄 Using browser TTS fallback...');
    speakWithBrowserTTS(text);
  };

  const speakWithBrowserTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Configure voice settings for a professional female interviewer
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    // Try to use a natural-sounding female voice
    const voices = window.speechSynthesis.getVoices();

    // Priority list for realistic female voices
    const femaleVoicePreferences = [
      'Microsoft Zira Desktop',
      'Google US English Female',
      'Samantha',
      'Microsoft Zira',
      'Google UK English Female',
      'Victoria',
      'Karen',
      'Moira',
      'Fiona',
      'Joanna',
      'Salli'
    ];

    // Find the best available female voice
    let selectedVoice = voices.find(voice =>
      femaleVoicePreferences.some(pref => voice.name.includes(pref))
    );

    // Fallback: find any female voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('samantha')
      );
    }

    // Last resort: find any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    // Stop browser TTS
    window.speechSynthesis.cancel();

    // Stop ElevenLabs audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setIsSpeaking(false);
  };

  return {
    speak,
    stop,
    isSpeaking
  };
}

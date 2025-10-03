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

  const speak = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Configure voice settings for a professional female interviewer
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0; // Natural pitch for female voice
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
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('fiona') ||
        voice.name.toLowerCase().includes('joanna')
      );
    }

    // Last resort: find any English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice =>
        voice.lang.startsWith('en')
      );
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('Selected voice:', selectedVoice.name, selectedVoice.lang);
    } else {
      console.log('No specific voice selected, using default');
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    speak,
    stop,
    isSpeaking
  };
}

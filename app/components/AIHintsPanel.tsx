'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface AIHintsPanelProps {
  question: string;
  role: string;
  category: string;
  isVisible: boolean;
  onToggle: () => void;
}

interface Hint {
  type: 'framework' | 'key_point' | 'example' | 'pitfall';
  icon: string;
  title: string;
  content: string;
  revealed: boolean;
}

export default function AIHintsPanel({
  question,
  role,
  category,
  isVisible,
  onToggle,
}: AIHintsPanelProps) {
  const [hints, setHints] = useState<Hint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  // Load hints when panel is opened
  useEffect(() => {
    if (isVisible && hints.length === 0) {
      loadHints();
    }
  }, [isVisible]);

  const loadHints = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/interview/hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, role, category }),
      });

      if (!response.ok) throw new Error('Failed to load hints');

      const data = await response.json();
      setHints(
        data.hints.map((hint: Omit<Hint, 'revealed'>) => ({
          ...hint,
          revealed: false,
        }))
      );
    } catch (error) {
      console.error('Error loading hints:', error);
      toast.error('Failed to load AI hints');
    } finally {
      setIsLoading(false);
    }
  };

  const revealHint = (index: number) => {
    setHints(prev =>
      prev.map((hint, i) =>
        i === index ? { ...hint, revealed: true } : hint
      )
    );
    setRevealedCount(prev => prev + 1);
  };

  const revealAll = () => {
    setHints(prev => prev.map(hint => ({ ...hint, revealed: true })));
    setRevealedCount(hints.length);
  };

  const getHintTypeColor = (type: Hint['type']) => {
    const colors = {
      framework: 'bg-blue-50 border-blue-300 text-blue-700',
      key_point: 'bg-green-50 border-green-300 text-green-700',
      example: 'bg-purple-50 border-purple-300 text-purple-700',
      pitfall: 'bg-red-50 border-red-300 text-red-700',
    };
    return colors[type];
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-l-2xl font-semibold shadow-2xl hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Need a Hint?
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col animate-slideInRight">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-bold">AI Interview Hints</h3>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-white/90">
          Smart hints to help you structure your answer
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="px-2 py-1 bg-white/20 rounded-full">
            {revealedCount}/{hints.length} revealed
          </span>
          {revealedCount < hints.length && (
            <button
              onClick={revealAll}
              className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              Reveal all
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading AI hints...</p>
          </div>
        ) : hints.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>No hints available</p>
          </div>
        ) : (
          hints.map((hint, index) => (
            <div
              key={index}
              className={`border-2 rounded-xl p-4 transition-all ${
                hint.revealed ? getHintTypeColor(hint.type) : 'bg-gray-100 border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{hint.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-2">{hint.title}</h4>
                  {hint.revealed ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {hint.content}
                    </p>
                  ) : (
                    <button
                      onClick={() => revealHint(index)}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 underline"
                    >
                      Click to reveal hint
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            <strong>Pro tip:</strong> Use hints to structure your answer, but always add your personal examples and experiences.
          </p>
        </div>
      </div>
    </div>
  );
}

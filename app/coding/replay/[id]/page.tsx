'use client';

import { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg" />,
});

interface CodeSnapshot {
  timestamp: number;
  code: string;
}

interface CodingSessionData {
  id: string;
  code: string;
  language: string;
  codeSnapshots: CodeSnapshot[];
  duration: number;
  score: number | null;
  aiAnalysis: string | null;
  status: string;
  startedAt: string;
  completedAt: string | null;
  hintsUsed: number;
  problem: {
    title: string;
    slug: string;
    difficulty: string;
  } | null;
}

export default function CodingReplayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<CodingSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/coding/session/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
        } else {
          router.push('/problems');
        }
      } catch {
        router.push('/problems');
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [id, router]);

  const snapshots = session?.codeSnapshots || [];
  const totalSnapshots = snapshots.length;

  const stopPlayback = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    if (totalSnapshots <= 1) return;
    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= totalSnapshots - 1) {
          stopPlayback();
          return prev;
        }
        return prev + 1;
      });
    }, 1500 / playbackSpeed);
  }, [totalSnapshots, playbackSpeed, stopPlayback]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Restart interval when speed changes during playback
  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      startPlayback();
    }
  }, [playbackSpeed]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentCode = totalSnapshots > 0
    ? snapshots[currentIndex]?.code || ''
    : session?.code || '';

  const currentTimestamp = totalSnapshots > 0 && snapshots[currentIndex]
    ? new Date(snapshots[currentIndex].timestamp).toLocaleTimeString()
    : '';

  const progress = totalSnapshots > 1
    ? (currentIndex / (totalSnapshots - 1)) * 100
    : 100;

  // Parse AI analysis
  let analysis: { summary?: string; strengths?: string[]; improvements?: string[] } | null = null;
  if (session?.aiAnalysis) {
    try {
      analysis = JSON.parse(session.aiAnalysis);
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-[500px] bg-gray-100 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Session Replay {session.problem ? `- ${session.problem.title}` : ''}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{session.language}</span>
                {session.score != null && (
                  <span className={`font-medium ${
                    session.score >= 80 ? 'text-green-600' :
                    session.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    Score: {session.score}/100
                  </span>
                )}
                <span>{Math.round(session.duration / 60)}min</span>
                {session.hintsUsed > 0 && <span>{session.hintsUsed} hints used</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Code Editor (read-only replay) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-[500px]">
              <Editor
                height="100%"
                language={session.language === 'javascript' ? 'javascript' : session.language === 'typescript' ? 'typescript' : 'python'}
                value={currentCode}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            {/* Playback Controls */}
            {totalSnapshots > 1 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {/* Progress bar */}
                <div className="mb-3">
                  <input
                    type="range"
                    min={0}
                    max={totalSnapshots - 1}
                    value={currentIndex}
                    onChange={(e) => {
                      stopPlayback();
                      setCurrentIndex(parseInt(e.target.value));
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                      onClick={isPlaying ? stopPlayback : startPlayback}
                      className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    >
                      {isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Step buttons */}
                    <button
                      onClick={() => { stopPlayback(); setCurrentIndex(Math.max(0, currentIndex - 1)); }}
                      disabled={currentIndex === 0}
                      className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { stopPlayback(); setCurrentIndex(Math.min(totalSnapshots - 1, currentIndex + 1)); }}
                      disabled={currentIndex >= totalSnapshots - 1}
                      className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Speed */}
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="px-2 py-1 text-sm border border-gray-300 rounded-lg bg-white"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1x</option>
                      <option value={2}>2x</option>
                      <option value={4}>4x</option>
                    </select>
                  </div>

                  <div className="text-sm text-gray-500">
                    Snapshot {currentIndex + 1} / {totalSnapshots}
                    {currentTimestamp && ` - ${currentTimestamp}`}
                  </div>
                </div>
              </div>
            )}

            {totalSnapshots <= 1 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
                No snapshots recorded for this session. Showing final code.
              </div>
            )}
          </div>

          {/* Analysis Panel */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 max-h-[620px] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Analysis</h2>

            {session.score != null && (
              <div className={`text-center p-4 rounded-lg mb-4 ${
                session.score >= 80 ? 'bg-green-50' :
                session.score >= 50 ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <div className="text-3xl font-bold">{session.score}/100</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            )}

            {analysis?.summary && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Summary</h3>
                <p className="text-sm text-gray-600">{analysis.summary}</p>
              </div>
            )}

            {analysis?.strengths && analysis.strengths.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-green-700 mb-1">Strengths</h3>
                <ul className="space-y-1">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-1">
                      <span className="text-green-500">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis?.improvements && analysis.improvements.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-orange-700 mb-1">Improvements</h3>
                <ul className="space-y-1">
                  {analysis.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-1">
                      <span className="text-orange-500">-</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!analysis && !session.score && (
              <p className="text-sm text-gray-500 text-center py-8">
                No analysis available for this session.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

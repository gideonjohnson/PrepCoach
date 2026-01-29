'use client';

import { useState, useEffect, useRef, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import SessionReplayPlayer from '@/app/components/SessionReplayPlayer';

interface DiagramSnapshot {
  timestamp: number;
  data: Record<string, unknown>;
}

interface DesignSessionData {
  id: string;
  diagramData: Record<string, unknown>;
  diagramSnapshots: DiagramSnapshot[];
  notes: string;
  requirements: string[];
  aiAnalysis: string | null;
  strengthsWeaknesses: { strengths: string[]; weaknesses: string[] } | null;
  score: number | null;
  duration: number;
  status: string;
  startedAt: string;
  completedAt: string | null;
  problem: {
    title: string;
    slug: string;
    difficulty: string;
    category: string;
  } | null;
}

export default function SystemDesignReplayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<DesignSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/system-design/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
        } else {
          router.push('/system-design');
        }
      } catch {
        router.push('/system-design');
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [id, router]);

  const snapshots = session?.diagramSnapshots || [];
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
    }, 2000 / playbackSpeed);
  }, [totalSnapshots, playbackSpeed, stopPlayback]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (isPlaying) { stopPlayback(); startPlayback(); }
  }, [playbackSpeed]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentDiagram = totalSnapshots > 0
    ? snapshots[currentIndex]?.data || {}
    : session?.diagramData || {};

  const progress = totalSnapshots > 1
    ? (currentIndex / (totalSnapshots - 1)) * 100
    : 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
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

  const sw = session.strengthsWeaknesses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
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
                Design Replay {session.problem ? `- ${session.problem.title}` : ''}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                {session.score != null && (
                  <span className={`font-medium ${
                    session.score >= 70 ? 'text-green-600' :
                    session.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    Score: {session.score}/100
                  </span>
                )}
                <span>{Math.round(session.duration / 60)}min</span>
                <span>{totalSnapshots} snapshots</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Diagram view */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-[500px] flex items-center justify-center bg-gray-50 p-4">
              {/* Render diagram data as JSON visualization since we can't embed Excalidraw in read-only easily */}
              <div className="w-full h-full overflow-auto">
                {Object.keys(currentDiagram).length > 0 ? (
                  <div className="text-sm">
                    <div className="mb-2 text-gray-500 text-xs font-medium">
                      Snapshot {currentIndex + 1} / {Math.max(totalSnapshots, 1)}
                      {snapshots[currentIndex] && (
                        <span> - {new Date(snapshots[currentIndex].timestamp).toLocaleTimeString()}</span>
                      )}
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-[440px]">
                      {JSON.stringify(currentDiagram, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">🏗️</div>
                    <p>No diagram data recorded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            {totalSnapshots > 1 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="mb-3">
                  <input
                    type="range"
                    min={0}
                    max={totalSnapshots - 1}
                    value={currentIndex}
                    onChange={(e) => { stopPlayback(); setCurrentIndex(parseInt(e.target.value)); }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={isPlaying ? stopPlayback : startPlayback}
                      className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                    >
                      {isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </button>
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
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="px-2 py-1 text-sm border border-gray-300 rounded-lg bg-white"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1x</option>
                      <option value={2}>2x</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentIndex + 1} / {totalSnapshots}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analysis panel */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 max-h-[620px] overflow-y-auto space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Analysis</h2>

            {session.score != null && (
              <div className={`text-center p-4 rounded-lg ${
                session.score >= 70 ? 'bg-green-50' :
                session.score >= 40 ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <div className="text-3xl font-bold">{session.score}/100</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            )}

            {sw?.strengths && sw.strengths.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-700 mb-1">Strengths</h3>
                <ul className="space-y-1">
                  {sw.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-1">
                      <span className="text-green-500">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sw?.weaknesses && sw.weaknesses.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-700 mb-1">Weaknesses</h3>
                <ul className="space-y-1">
                  {sw.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-1">
                      <span className="text-red-500">-</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {session.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Notes</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{session.notes}</p>
              </div>
            )}

            {!session.score && !sw && !session.notes && (
              <p className="text-sm text-gray-500 text-center py-8">
                No analysis available.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

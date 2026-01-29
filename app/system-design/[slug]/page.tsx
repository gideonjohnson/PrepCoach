'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import SystemDesignCanvas from '@/app/components/SystemDesignCanvas';
import SessionRecorder from '@/app/components/SessionRecorder';
import toast from 'react-hot-toast';

interface SystemDesignProblemDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  companies: string[];
  functionalReqs: string[];
  nonFunctionalReqs: string[];
  constraints: string[];
  keyComponents: string[];
}

interface AnalysisResult {
  overallScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  missingComponents?: string[];
}

export default function SystemDesignProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [problem, setProblem] = useState<SystemDesignProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [diagramData, setDiagramData] = useState<Record<string, unknown>>({});
  const [notes, setNotes] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activePanel, setActivePanel] = useState<'requirements' | 'notes' | 'analysis'>('requirements');
  const sessionCreated = useRef(false);

  useEffect(() => {
    async function load() {
      try {
        // Fetch problem
        const res = await fetch(`/api/system-design/${slug}?type=problem`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || 'Problem not found');
          router.push('/system-design');
          return;
        }

        setProblem(data.problem);

        // Create session
        if (!sessionCreated.current) {
          sessionCreated.current = true;
          try {
            const sessRes = await fetch('/api/system-design', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ problemId: data.problem.id }),
            });
            if (sessRes.ok) {
              const sessData = await sessRes.json();
              setSessionId(sessData.session.id);
            }
          } catch {
            // Non-critical
          }
        }
      } catch {
        toast.error('Failed to load problem');
        router.push('/system-design');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, router]);

  const handleRequestAnalysis = async () => {
    if (!sessionId) return;
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/system-design/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagramData,
          notes,
          requestAnalysis: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.session?.aiAnalysis) {
          try {
            const parsed = JSON.parse(data.session.aiAnalysis);
            setAnalysis(parsed);
          } catch {
            setAnalysis({ overallScore: data.session.score });
          }
        }
        setActivePanel('analysis');
        toast.success('Analysis complete!');
      }
    } catch {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleComplete = async () => {
    if (!sessionId) return;
    try {
      await fetch(`/api/system-design/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagramData,
          notes,
          status: 'completed',
          requestAnalysis: true,
        }),
      });
      toast.success('Session completed!');
      router.push('/system-design');
    } catch {
      toast.error('Failed to complete session');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-[600px] bg-gray-100 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/system-design')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{problem.title}</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                problem.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {problem.difficulty}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {sessionId && (
              <SessionRecorder
                sessionId={sessionId}
                sessionType="system_design"
                enableAudio={true}
                enableVideo={false}
                enableScreen={false}
              />
            )}
            <button
              onClick={handleRequestAnalysis}
              disabled={analyzing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {analyzing ? 'Analyzing...' : 'Get AI Analysis'}
            </button>
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Complete
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Side Panel */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Panel Tabs */}
            <div className="flex border-b border-gray-200">
              {(['requirements', 'notes', 'analysis'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePanel(tab)}
                  className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
                    activePanel === tab
                      ? 'text-indigo-600 border-b-2 border-indigo-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'requirements' ? 'Requirements' : tab === 'notes' ? 'Notes' : 'Analysis'}
                </button>
              ))}
            </div>

            <div className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              {activePanel === 'requirements' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-4">{problem.description}</p>
                  </div>

                  {problem.functionalReqs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Functional Requirements</h3>
                      <ul className="space-y-1.5">
                        {problem.functionalReqs.map((req, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-indigo-500 mt-0.5 flex-shrink-0">&#8226;</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {problem.nonFunctionalReqs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Non-Functional Requirements</h3>
                      <ul className="space-y-1.5">
                        {problem.nonFunctionalReqs.map((req, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5 flex-shrink-0">&#8226;</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {problem.constraints.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Constraints</h3>
                      <ul className="space-y-1.5">
                        {problem.constraints.map((c, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <code className="bg-gray-100 px-1 rounded text-xs">{c}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {problem.keyComponents.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Components</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {problem.keyComponents.map((comp, i) => (
                          <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activePanel === 'notes' && (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    placeholder="Write your design notes, trade-off analysis, capacity estimation..."
                  />
                </div>
              )}

              {activePanel === 'analysis' && (
                <div>
                  {analysis ? (
                    <div className="space-y-4">
                      {analysis.overallScore != null && (
                        <div className={`text-center p-4 rounded-lg ${
                          analysis.overallScore >= 70 ? 'bg-green-50' :
                          analysis.overallScore >= 40 ? 'bg-yellow-50' : 'bg-red-50'
                        }`}>
                          <div className="text-3xl font-bold">{analysis.overallScore}/100</div>
                          <div className="text-sm text-gray-500">Overall Score</div>
                        </div>
                      )}

                      {analysis.strengths && analysis.strengths.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-green-700 mb-1">Strengths</h4>
                          <ul className="space-y-1">
                            {analysis.strengths.map((s, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                                <span className="text-green-500">+</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-red-700 mb-1">Weaknesses</h4>
                          <ul className="space-y-1">
                            {analysis.weaknesses.map((w, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                                <span className="text-red-500">-</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.suggestions && analysis.suggestions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-blue-700 mb-1">Suggestions</h4>
                          <ul className="space-y-1">
                            {analysis.suggestions.map((s, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                                <span className="text-blue-500">&#10148;</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.missingComponents && analysis.missingComponents.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-orange-700 mb-1">Missing Components</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.missingComponents.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">🤖</div>
                      <p className="text-sm text-gray-500">
                        Click &quot;Get AI Analysis&quot; to receive feedback on your design
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Design Canvas (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[600px]">
            <SystemDesignCanvas
              sessionId={sessionId || undefined}
              problemTitle={problem.title}
              requirements={problem.functionalReqs}
              onDataChange={(data: Record<string, unknown>) => setDiagramData(data)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

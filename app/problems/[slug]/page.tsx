'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import CodingInterview, { Language } from '@/app/components/CodingInterview';
import SessionRecorder from '@/app/components/SessionRecorder';
import { Skeleton } from '@/app/components/Skeleton';
import toast from 'react-hot-toast';

interface Problem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  companies: string[];
  tags: string[];
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  hints: string[];
  testCases: Array<{ input: string; expectedOutput: string }>;
  isPremium: boolean;
  successRate: number | null;
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface TestResult {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
  executionTimeMs: number;
}

const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Easy',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  medium: {
    label: 'Medium',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  hard: {
    label: 'Hard',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
};

export default function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState<boolean[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'results'>('description');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testSummary, setTestSummary] = useState<{ passed: number; total: number; allPassed: boolean } | null>(null);
  const [running, setRunning] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [loadingHint, setLoadingHint] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const sessionCreated = useRef(false);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await fetch(`/api/problems/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          if (data.isPremium) {
            setError('premium');
          } else {
            setError(data.error || 'Failed to load problem');
          }
          return;
        }

        setProblem(data.problem);
        setShowHints(new Array(data.problem.hints.length).fill(false));

        // Create a coding session for tracking
        if (!sessionCreated.current) {
          sessionCreated.current = true;
          try {
            const sessRes = await fetch('/api/coding/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ problemId: data.problem.id, language: 'javascript' }),
            });
            if (sessRes.ok) {
              const sessData = await sessRes.json();
              setSessionId(sessData.session.id);
            }
          } catch {
            // Non-critical — session tracking is optional
          }
        }
      } catch {
        setError('Failed to load problem');
      } finally {
        setLoading(false);
      }
    }

    fetchProblem();
  }, [slug]);

  const handleSubmit = async (code: string, language: Language) => {
    if (!problem) return;

    try {
      // Run tests first
      setRunning(true);
      const execRes = await fetch('/api/coding/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId: problem.id,
          sessionId: sessionId || undefined,
        }),
      });

      if (execRes.ok) {
        const execData = await execRes.json();
        setTestResults(execData.results || []);
        setTestSummary(execData.summary || null);
        setActiveTab('results');
      }
      setRunning(false);

      // Complete the session with scoring
      if (sessionId) {
        const patchRes = await fetch(`/api/coding/session/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed', code }),
        });

        if (patchRes.ok) {
          const patchData = await patchRes.json();
          if (patchData.session?.score != null) {
            setScore(patchData.session.score);
            toast.success(`Solution submitted! Score: ${patchData.session.score}/100`);
          } else {
            toast.success('Solution submitted!');
          }
        }
      }
    } catch {
      setRunning(false);
      toast.error('Failed to submit solution');
    }
  };

  const handleRunCode = async (code: string, language: Language) => {
    if (!problem) return { output: '', error: 'No problem loaded' };

    setRunning(true);
    try {
      const response = await fetch('/api/coding/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId: problem.id,
          sessionId: sessionId || undefined,
        }),
      });

      const data = await response.json();
      setRunning(false);

      if (!response.ok) {
        return { output: '', error: data.error || 'Execution failed' };
      }

      setTestResults(data.results || []);
      setTestSummary(data.summary || null);
      setActiveTab('results');

      const summary = data.summary;
      if (summary) {
        return {
          output: `${summary.passed}/${summary.total} tests passed${summary.allPassed ? ' - All tests passed!' : ''}`,
          error: summary.allPassed ? undefined : `${summary.total - summary.passed} test(s) failed`,
        };
      }

      return { output: data.output?.stdout || '', error: data.output?.stderr };
    } catch {
      setRunning(false);
      return { output: '', error: 'Execution failed' };
    }
  };

  const handleGetHint = async (code: string) => {
    if (!problem) return;
    const nextLevel = Math.min(hintLevel + 1, 4);
    setLoadingHint(true);
    try {
      const res = await fetch('/api/coding/hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          sessionId: sessionId || undefined,
          code,
          hintLevel: nextLevel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiHint(data.hint);
        setHintLevel(nextLevel);
      }
    } catch {
      toast.error('Failed to get hint');
    } finally {
      setLoadingHint(false);
    }
  };

  const toggleHint = (index: number) => {
    setShowHints(prev => {
      const newHints = [...prev];
      newHints[index] = !newHints[index];
      return newHints;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-[600px] rounded-xl" />
        </main>
      </div>
    );
  }

  if (error === 'premium') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-12">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Premium Problem
            </h1>
            <p className="text-gray-600 mb-8">
              This problem is only available to Pro subscribers. Upgrade to unlock all premium problems and features.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              Upgrade to Pro
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border-2 border-red-200 p-12">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Problem Not Found
            </h1>
            <p className="text-gray-600 mb-8">{error || 'This problem does not exist.'}</p>
            <button
              onClick={() => router.push('/problems')}
              className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Back to Problems
            </button>
          </div>
        </main>
      </div>
    );
  }

  const difficultyConfig = DIFFICULTY_CONFIG[problem.difficulty];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Problem Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/problems')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${difficultyConfig.bgColor} ${difficultyConfig.textColor}`}>
                {difficultyConfig.label}
              </span>
              <span className="text-sm text-gray-500">{problem.category}</span>
              {problem.successRate !== null && (
                <span className="text-sm text-gray-500">
                  {problem.successRate}% success rate
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Problem Description */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-orange-600 border-b-2 border-orange-500 -mb-0.5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'results'
                    ? 'text-orange-600 border-b-2 border-orange-500 -mb-0.5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Results {testSummary ? `(${testSummary.passed}/${testSummary.total})` : ''}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
              {activeTab === 'description' ? (
                <>
                  {/* Description */}
                  <div className="prose prose-sm max-w-none mb-6">
                    <p className="whitespace-pre-wrap text-gray-700">{problem.description}</p>
                  </div>

                  {/* Examples */}
                  {problem.examples.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                      {problem.examples.map((example, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Input: </span>
                            <code className="text-sm bg-white px-2 py-0.5 rounded text-gray-900">{example.input}</code>
                          </div>
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Output: </span>
                            <code className="text-sm bg-white px-2 py-0.5 rounded text-gray-900">{example.output}</code>
                          </div>
                          {example.explanation && (
                            <div className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
                              <span className="font-medium">Explanation: </span>
                              {example.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Constraints */}
                  {problem.constraints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {problem.constraints.map((constraint, index) => (
                          <li key={index} className="text-sm">
                            <code className="bg-gray-100 px-1.5 py-0.5 rounded">{constraint}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Hints */}
                  {problem.hints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Hints</h3>
                      {problem.hints.map((hint, index) => (
                        <div key={index} className="mb-2">
                          <button
                            onClick={() => toggleHint(index)}
                            className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 text-sm font-medium transition-colors"
                          >
                            {showHints[index] ? '▼' : '▶'} Hint {index + 1}
                          </button>
                          {showHints[index] && (
                            <div className="px-4 py-2 text-sm text-gray-700 border-l-2 border-blue-300 ml-4 mt-1">
                              {hint}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags & Companies */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    {problem.companies.map((company) => (
                      <span key={company} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {company}
                      </span>
                    ))}
                    {problem.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  {/* Score banner */}
                  {score !== null && (
                    <div className={`mb-4 p-4 rounded-lg text-center font-semibold ${
                      score >= 80 ? 'bg-green-50 text-green-700' :
                      score >= 50 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      Score: {score}/100
                    </div>
                  )}

                  {/* Test Results */}
                  {testResults.length > 0 ? (
                    <div className="space-y-3">
                      {testSummary && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${
                          testSummary.allPassed
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {testSummary.allPassed
                            ? 'All tests passed!'
                            : `${testSummary.passed}/${testSummary.total} tests passed`}
                        </div>
                      )}
                      {testResults.map((result) => (
                        <div
                          key={result.index}
                          className={`p-3 rounded-lg border ${
                            result.passed
                              ? 'border-green-200 bg-green-50'
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
                              {result.passed ? '\u2713' : '\u2717'} Test {result.index + 1}
                            </span>
                            <span className="text-xs text-gray-400">{result.executionTimeMs}ms</span>
                          </div>
                          {result.input !== '[Hidden]' && (
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">Input:</span>{' '}
                              <code className="bg-white px-1 rounded">{result.input}</code>
                            </div>
                          )}
                          {result.expectedOutput !== '[Hidden]' && (
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">Expected:</span>{' '}
                              <code className="bg-white px-1 rounded">{result.expectedOutput}</code>
                            </div>
                          )}
                          {result.actualOutput !== '[Hidden]' && (
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">Got:</span>{' '}
                              <code className="bg-white px-1 rounded">{result.actualOutput}</code>
                            </div>
                          )}
                          {result.error && (
                            <div className="text-xs text-red-600 mt-1">
                              <span className="font-medium">Error:</span> {result.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : running ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-gray-500">Running tests...</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🧪</div>
                      <p className="text-gray-500">Run your code to see test results</p>
                    </div>
                  )}

                  {/* AI Hint Section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">AI Hints</h3>
                      <span className="text-xs text-gray-400">Level {hintLevel}/4</span>
                    </div>
                    {aiHint && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-sm text-gray-700 whitespace-pre-wrap">
                        {aiHint}
                      </div>
                    )}
                    <button
                      onClick={() => handleGetHint('')}
                      disabled={loadingHint || hintLevel >= 4}
                      className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loadingHint ? 'Thinking...' : hintLevel >= 4 ? 'All hints used' : `Get Hint (Level ${hintLevel + 1})`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Code Editor */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden min-h-[600px] relative">
            {sessionId && (
              <div className="absolute top-2 right-2 z-10">
                <SessionRecorder
                  sessionId={sessionId}
                  sessionType="coding"
                  enableAudio={true}
                  enableVideo={false}
                  enableScreen={false}
                />
              </div>
            )}
            <CodingInterview
              question={problem.description}
              testCases={problem.testCases.map(tc => ({
                input: tc.input,
                expected: tc.expectedOutput,
              }))}
              onSubmit={handleSubmit}
              onRunCode={handleRunCode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

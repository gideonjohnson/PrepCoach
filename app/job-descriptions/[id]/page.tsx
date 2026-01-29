'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';

interface JobDescriptionDetail {
  id: string;
  title: string;
  company: string | null;
  rawText: string;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  experience: string | null;
  customQuestions: Array<{
    question: string;
    category: string;
    tips: string;
  }>;
  prepSuggestions: string[];
  companyInsights: string | null;
  matchScore: number | null;
  gapAnalysis: {
    strongMatches: string[];
    gaps: string[];
    recommendations: string[];
  } | null;
  createdAt: string;
}

export default function JobDescriptionDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const [jd, setJd] = useState<JobDescriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'gaps'>('overview');

  useEffect(() => {
    if (status === 'authenticated' && params.id) fetchJD();
    else if (status === 'unauthenticated') setLoading(false);
  }, [status, params.id]);

  async function fetchJD() {
    try {
      const res = await fetch('/api/job-description');
      const data = await res.json();
      if (res.ok) {
        const found = data.jobDescriptions.find((j: { id: string }) => j.id === params.id);
        if (found) {
          // Parse gapAnalysis if it's a string
          if (typeof found.gapAnalysis === 'string') {
            try { found.gapAnalysis = JSON.parse(found.gapAnalysis); } catch { found.gapAnalysis = null; }
          }
          setJd(found);
        }
      }
    } catch (error) {
      console.error('Failed to fetch JD:', error);
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case 'technical': return 'bg-purple-50 text-purple-700';
      case 'behavioral': return 'bg-blue-50 text-blue-700';
      case 'situational': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!jd) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Description Not Found</h1>
          <Link href="/job-descriptions" className="text-blue-600 hover:underline">
            Back to all job descriptions
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/job-descriptions" className="text-blue-600 hover:underline text-sm">
            &larr; All Job Descriptions
          </Link>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{jd.title}</h1>
            {jd.company && <p className="text-lg text-gray-500 mt-1">{jd.company}</p>}
            {jd.experience && <p className="text-sm text-gray-400 mt-1">{jd.experience}</p>}
          </div>
          {jd.matchScore !== null && (
            <div className={`px-6 py-4 rounded-xl border-2 text-center ${getScoreColor(jd.matchScore)}`}>
              <div className="text-3xl font-bold">{jd.matchScore}%</div>
              <div className="text-sm font-medium">Resume Match</div>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {jd.skills.map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {(['overview', 'questions', 'gaps'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'questions' ? `Questions (${jd.customQuestions.length})` : 'Gap Analysis'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Requirements */}
            {jd.requirements.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {jd.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-500 mt-1 flex-shrink-0">&#8226;</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {jd.responsibilities.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h2>
                <ul className="space-y-2">
                  {jd.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-500 mt-1 flex-shrink-0">&#8226;</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company Insights */}
            {jd.companyInsights && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Company Insights</h2>
                <p className="text-gray-700 leading-relaxed">{jd.companyInsights}</p>
              </div>
            )}

            {/* Prep Suggestions */}
            {jd.prepSuggestions.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Preparation Tips</h2>
                <ul className="space-y-2">
                  {jd.prepSuggestions.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-yellow-500 mt-1 flex-shrink-0">&#9733;</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-4">
            {jd.customQuestions.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No custom questions generated.</p>
              </div>
            ) : (
              jd.customQuestions.map((q, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-gray-400">Q{i + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(q.category)}`}>
                      {q.category}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-medium mb-3">{q.question}</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Tip:</span> {q.tips}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="space-y-6">
            {!jd.gapAnalysis ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">
                  Gap analysis requires a primary resume. Add a resume in the Resume Builder and re-analyze this JD.
                </p>
              </div>
            ) : (
              <>
                {/* Strong Matches */}
                {jd.gapAnalysis.strongMatches?.length > 0 && (
                  <div className="bg-white rounded-xl border border-green-200 p-6">
                    <h2 className="text-lg font-semibold text-green-700 mb-3">Strong Matches</h2>
                    <ul className="space-y-2">
                      {jd.gapAnalysis.strongMatches.map((match, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
                          {match}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gaps */}
                {jd.gapAnalysis.gaps?.length > 0 && (
                  <div className="bg-white rounded-xl border border-red-200 p-6">
                    <h2 className="text-lg font-semibold text-red-700 mb-3">Skill Gaps</h2>
                    <ul className="space-y-2">
                      {jd.gapAnalysis.gaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="text-red-500 mt-0.5 flex-shrink-0">&#10007;</span>
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {jd.gapAnalysis.recommendations?.length > 0 && (
                  <div className="bg-white rounded-xl border border-blue-200 p-6">
                    <h2 className="text-lg font-semibold text-blue-700 mb-3">Recommendations</h2>
                    <ul className="space-y-2">
                      {jd.gapAnalysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-500 mt-0.5 flex-shrink-0">&#10148;</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

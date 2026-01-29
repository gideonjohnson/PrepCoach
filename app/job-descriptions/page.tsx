'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/app/components/Header';

interface JobDescription {
  id: string;
  title: string;
  company: string | null;
  matchScore: number | null;
  skills: string[];
  experience: string | null;
  createdAt: string;
}

export default function JobDescriptionsPage() {
  const { data: session, status } = useSession();
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', company: '', rawText: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') fetchJDs();
    else if (status === 'unauthenticated') setLoading(false);
  }, [status]);

  async function fetchJDs() {
    try {
      const res = await fetch('/api/job-description');
      const data = await res.json();
      if (res.ok) setJobDescriptions(data.jobDescriptions);
    } catch (error) {
      console.error('Failed to fetch JDs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.rawText.length < 50) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/job-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          company: formData.company || undefined,
          rawText: formData.rawText,
          includeResumeMatch: true,
        }),
      });
      if (res.ok) {
        setFormData({ title: '', company: '', rawText: '' });
        setShowForm(false);
        fetchJDs();
      }
    } catch (error) {
      console.error('Failed to create JD:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this job description?')) return;
    try {
      await fetch(`/api/job-description?id=${id}`, { method: 'DELETE' });
      setJobDescriptions(prev => prev.filter(jd => jd.id !== id));
    } catch (error) {
      console.error('Failed to delete JD:', error);
    }
  }

  function getScoreColor(score: number | null) {
    if (score === null) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  if (!session && status !== 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Description Matcher</h1>
          <p className="text-gray-600 mb-8">Sign in to analyze job descriptions and get tailored interview prep.</p>
          <Link href="/auth/signin" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Sign In
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Descriptions</h1>
            <p className="text-gray-600 mt-1">Analyze JDs and get tailored interview prep</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Analyze New JD'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Paste a Job Description</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Google"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description Text *</label>
              <textarea
                required
                minLength={50}
                rows={8}
                value={formData.rawText}
                onChange={(e) => setFormData(prev => ({ ...prev, rawText: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Paste the full job description here (minimum 50 characters)..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting || formData.rawText.length < 50}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Analyzing...' : 'Analyze Job Description'}
            </button>
          </form>
        )}

        {/* JD List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-2" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                  <div className="h-6 bg-gray-100 rounded-full w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : jobDescriptions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No job descriptions yet</h3>
            <p className="text-gray-500 mb-6">
              Paste a job description to get AI-powered analysis and tailored interview questions.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Analyze Your First JD
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobDescriptions.map((jd) => (
              <div key={jd.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <Link href={`/job-descriptions/${jd.id}`} className="flex-1 group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {jd.title}
                    </h3>
                    {jd.company && (
                      <p className="text-sm text-gray-500 mt-0.5">{jd.company}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {jd.skills.slice(0, 5).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {jd.skills.length > 5 && (
                        <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full text-xs">
                          +{jd.skills.length - 5} more
                        </span>
                      )}
                    </div>
                    {jd.experience && (
                      <p className="text-sm text-gray-500 mt-2">{jd.experience}</p>
                    )}
                  </Link>
                  <div className="flex items-center gap-4 ml-4">
                    {jd.matchScore !== null && (
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(jd.matchScore)}`}>
                          {jd.matchScore}%
                        </div>
                        <div className="text-xs text-gray-400">Match</div>
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(jd.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  {new Date(jd.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

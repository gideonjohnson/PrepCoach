'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';

const EXPERTISE_OPTIONS = [
  { value: 'coding', label: 'Coding Interviews', icon: '💻' },
  { value: 'system_design', label: 'System Design', icon: '🏗️' },
  { value: 'behavioral', label: 'Behavioral', icon: '🗣️' },
  { value: 'engineering_management', label: 'Engineering Management', icon: '👔' },
  { value: 'frontend', label: 'Frontend', icon: '🎨' },
  { value: 'backend', label: 'Backend', icon: '⚙️' },
  { value: 'mobile', label: 'Mobile', icon: '📱' },
  { value: 'data_engineering', label: 'Data Engineering', icon: '📊' },
  { value: 'ml_ai', label: 'ML/AI', icon: '🤖' },
];

const LANGUAGE_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'SQL',
];

const FAANG_COMPANIES = [
  'Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft', 'Uber', 'Airbnb',
  'LinkedIn', 'Twitter/X', 'Stripe', 'OpenAI', 'Anthropic', 'Other FAANG+',
];

type FormData = {
  displayName: string;
  bio: string;
  currentCompany: string;
  currentRole: string;
  previousCompanies: string[];
  yearsExperience: number;
  expertise: string[];
  specializations: string[];
  languages: string[];
  linkedinUrl: string;
  timezone: string;
  ratePerHour: number;
};

export default function InterviewerRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    bio: '',
    currentCompany: '',
    currentRole: '',
    previousCompanies: [],
    yearsExperience: 5,
    expertise: [],
    specializations: [],
    languages: [],
    linkedinUrl: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ratePerHour: 15000, // $150 default
  });

  const [newSpecialization, setNewSpecialization] = useState('');

  const updateFormData = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'expertise' | 'previousCompanies' | 'languages', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()],
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec),
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return formData.displayName.length >= 2 && formData.yearsExperience > 0;
      case 2:
        return formData.expertise.length >= 1;
      case 3:
        return formData.ratePerHour >= 5000;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/interviewer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/interviewer/profile?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-8">Please sign in to register as an interviewer.</p>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s < step
                      ? 'bg-green-500 text-white'
                      : s === step
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded ${
                      s < step ? 'bg-green-500' : 'bg-gray-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-gray-400 text-sm">
            Step {step} of 3:{' '}
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Expertise & Skills'}
            {step === 3 && 'Pricing & Availability'}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-white/10">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
            Become an Expert Interviewer
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => updateFormData('displayName', e.target.value)}
                  placeholder="How you want to appear to candidates"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  placeholder="Tell candidates about your background and interview style..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Current Company
                  </label>
                  <input
                    type="text"
                    value={formData.currentCompany}
                    onChange={(e) => updateFormData('currentCompany', e.target.value)}
                    placeholder="e.g., Google"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={formData.currentRole}
                    onChange={(e) => updateFormData('currentRole', e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => updateFormData('yearsExperience', parseInt(e.target.value) || 0)}
                  min={1}
                  max={50}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Previous FAANG+ Companies
                </label>
                <div className="flex flex-wrap gap-2">
                  {FAANG_COMPANIES.map((company) => (
                    <button
                      key={company}
                      type="button"
                      onClick={() => toggleArrayItem('previousCompanies', company)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.previousCompanies.includes(company)
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  LinkedIn Profile (optional)
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => updateFormData('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Expertise & Skills */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Interview Expertise <span className="text-red-500">*</span>
                </label>
                <p className="text-gray-500 text-sm mb-3">Select the types of interviews you can conduct</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EXPERTISE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleArrayItem('expertise', opt.value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        formData.expertise.includes(opt.value)
                          ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500 text-white'
                          : 'bg-gray-800/50 border-2 border-transparent text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="font-medium">{opt.label}</span>
                      {formData.expertise.includes(opt.value) && (
                        <span className="ml-auto text-orange-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Programming Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleArrayItem('languages', lang)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.languages.includes(lang)
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Specializations
                </label>
                <p className="text-gray-500 text-sm mb-3">Add specific topics you specialize in (e.g., &quot;Distributed Systems&quot;, &quot;React&quot;, &quot;AWS&quot;)</p>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                    placeholder="Add specialization..."
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={addSpecialization}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
                  >
                    Add
                  </button>
                </div>
                {formData.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg text-sm text-gray-300"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecialization(spec)}
                          className="text-gray-500 hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Availability */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Hourly Rate (USD) <span className="text-red-500">*</span>
                </label>
                <p className="text-gray-500 text-sm mb-3">Set your rate for 1-hour interview sessions. Platform takes 15% commission.</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                  <input
                    type="number"
                    value={formData.ratePerHour / 100}
                    onChange={(e) => updateFormData('ratePerHour', Math.round(parseFloat(e.target.value) * 100) || 0)}
                    min={50}
                    max={1000}
                    step={10}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white text-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="mt-3 p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Your rate</span>
                    <span className="text-white">${(formData.ratePerHour / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Platform fee (15%)</span>
                    <span className="text-red-400">-${(formData.ratePerHour * 0.15 / 100).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-300">You receive</span>
                      <span className="text-green-400">${(formData.ratePerHour * 0.85 / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => updateFormData('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Central European (CET)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Singapore">Singapore (SGT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              </div>

              {/* Summary */}
              <div className="p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/30">
                <h3 className="text-lg font-bold text-white mb-4">Registration Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Display Name</span>
                    <span className="text-white">{formData.displayName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience</span>
                    <span className="text-white">{formData.yearsExperience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expertise</span>
                    <span className="text-white">{formData.expertise.length} areas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Languages</span>
                    <span className="text-white">{formData.languages.length} languages</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hourly Rate</span>
                    <span className="text-orange-400">${(formData.ratePerHour / 100).toFixed(0)}/hr</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  <strong>Note:</strong> Your profile will be reviewed by our team before you can start accepting sessions.
                  This usually takes 1-2 business days.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-all"
              >
                Back
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-all"
              >
                Cancel
              </Link>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

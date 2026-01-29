'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SENIORITY_LEVELS = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-Level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'staff', label: 'Staff (8-12 years)' },
  { value: 'principal', label: 'Principal (12+ years)' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'immediately', label: 'Available Immediately' },
  { value: '2_weeks', label: 'Available in 2 Weeks' },
  { value: '1_month', label: 'Available in 1 Month' },
  { value: 'exploring', label: 'Just Exploring' },
];

const WORK_AUTH_OPTIONS = [
  'United States',
  'Canada',
  'United Kingdom',
  'European Union',
  'India',
  'Other',
];

export default function TalentOptInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    displayTitle: '',
    seniorityLevel: 'mid',
    yearsExperience: 3,
    availability: 'exploring',
    workAuthorization: [] as string[],
    requiresSponsorship: false,
    roles: '',
    locations: '',
    remote: true,
    salaryMin: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    // Check if user already has a profile
    fetch('/api/talent/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.isOptedIn) {
          router.push('/talent/profile');
        }
        setExistingProfile(!!data.profile);
      })
      .catch(() => setExistingProfile(false));
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/talent/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayTitle: form.displayTitle || undefined,
          seniorityLevel: form.seniorityLevel,
          yearsExperience: form.yearsExperience,
          availability: form.availability,
          workAuthorization: form.workAuthorization,
          requiresSponsorship: form.requiresSponsorship,
          jobPreferences: {
            roles: form.roles.split(',').map((r) => r.trim()).filter(Boolean),
            locations: form.locations.split(',').map((l) => l.trim()).filter(Boolean),
            remote: form.remote,
            salaryMin: form.salaryMin ? parseInt(form.salaryMin) * 1000 : undefined,
          },
        }),
      });

      if (res.ok) {
        router.push('/talent/profile');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create profile');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || existingProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Join the Talent Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Let top companies discover you based on your verified interview skills.
            Your identity stays anonymous until you choose to reveal it.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Anonymous', desc: 'Your identity is hidden until you accept a request' },
            { title: 'Verified Skills', desc: 'Scores from your practice sessions prove your abilities' },
            { title: 'You\'re in Control', desc: 'Accept or decline interview requests on your terms' },
          ].map((b) => (
            <div key={b.title} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{b.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Opt-in Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Title
            </label>
            <input
              type="text"
              placeholder="e.g., Senior Full-Stack Engineer"
              value={form.displayTitle}
              onChange={(e) => setForm({ ...form, displayTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">This will be shown anonymously to recruiters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Seniority Level
              </label>
              <select
                value={form.seniorityLevel}
                onChange={(e) => setForm({ ...form, seniorityLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {SENIORITY_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={form.yearsExperience}
                onChange={(e) => setForm({ ...form, yearsExperience: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Availability
            </label>
            <select
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {AVAILABILITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Roles
            </label>
            <input
              type="text"
              placeholder="Software Engineer, Backend Engineer, Full-Stack"
              value={form.roles}
              onChange={(e) => setForm({ ...form, roles: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preferred Locations
            </label>
            <input
              type="text"
              placeholder="Remote, San Francisco, New York"
              value={form.locations}
              onChange={(e) => setForm({ ...form, locations: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.remote}
                onChange={(e) => setForm({ ...form, remote: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Open to remote</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Minimum Salary (USD, thousands)
            </label>
            <input
              type="number"
              placeholder="150"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Only shown to matching companies</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Work Authorization
            </label>
            <div className="flex flex-wrap gap-2">
              {WORK_AUTH_OPTIONS.map((auth) => (
                <label key={auth} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={form.workAuthorization.includes(auth)}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        workAuthorization: e.target.checked
                          ? [...form.workAuthorization, auth]
                          : form.workAuthorization.filter((a) => a !== auth),
                      });
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{auth}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.requiresSponsorship}
              onChange={(e) => setForm({ ...form, requiresSponsorship: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I require visa sponsorship
            </span>
          </label>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating Profile...' : 'Join Talent Marketplace'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              You can deactivate your profile at any time from settings.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  candidate_required_location: string;
  salary: string;
  job_type: string;
  publication_date: string;
  description: string;
}

interface NormalizedJob {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  url: string;
  description: string;
  category: string;
  type: string;
  date: string;
}

interface CacheEntry {
  data: NormalizedJob[];
  timestamp: number;
  key: string;
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const cache = new Map<string, CacheEntry>();

function normalizeJob(job: RemotiveJob): NormalizedJob {
  return {
    id: job.id,
    title: job.title,
    company: job.company_name,
    companyLogo: job.company_logo || '',
    location: job.candidate_required_location || 'Remote',
    salary: job.salary || '',
    url: job.url,
    description: job.description || '',
    category: job.category || '',
    type: job.job_type || '',
    date: job.publication_date || '',
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const cacheKey = `${search}:${category}`;

  try {

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        jobs: cached.data,
        source: 'remotive',
        total: cached.data.length,
        cached: true,
      });
    }

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    params.set('limit', '250');

    const apiUrl = `https://remotive.com/api/remote-jobs?${params.toString()}`;
    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Remotive API returned ${response.status}`);
    }

    const data = await response.json();
    const jobs: NormalizedJob[] = (data.jobs || []).map(normalizeJob);

    cache.set(cacheKey, { data: jobs, timestamp: Date.now(), key: cacheKey });

    return NextResponse.json({
      jobs,
      source: 'remotive',
      total: jobs.length,
      cached: false,
    });
  } catch (error) {
    console.error('Jobs API error:', error);

    const stale = cache.get(cacheKey);
    if (stale) {
      return NextResponse.json({
        jobs: stale.data,
        source: 'remotive',
        total: stale.data.length,
        cached: true,
        stale: true,
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch jobs', jobs: [], total: 0 },
      { status: 502 }
    );
  }
}

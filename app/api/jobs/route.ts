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
let cache: CacheEntry | null = null;

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
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const cacheKey = `${search}:${category}`;

    if (cache && cache.key === cacheKey && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({
        jobs: cache.data,
        source: 'remotive',
        total: cache.data.length,
        cached: true,
      });
    }

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    params.set('limit', '50');

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

    cache = { data: jobs, timestamp: Date.now(), key: cacheKey };

    return NextResponse.json({
      jobs,
      source: 'remotive',
      total: jobs.length,
      cached: false,
    });
  } catch (error) {
    console.error('Jobs API error:', error);

    if (cache) {
      return NextResponse.json({
        jobs: cache.data,
        source: 'remotive',
        total: cache.data.length,
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

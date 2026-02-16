import { NextRequest, NextResponse } from 'next/server';

// ---- Source interfaces ----

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

interface ArbeitnowJob {
  slug: string;
  title: string;
  company_name: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

interface JobicyJob {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  jobIndustry: string[];
  jobType: string[];
  jobGeo: string;
  jobLevel: string;
  jobExcerpt: string;
  jobDescription: string;
  pubDate: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  salaryPeriod: string;
}

// ---- Normalized output ----

interface NormalizedJob {
  id: string;
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
  source: string;
}

// ---- Cache ----

interface CacheEntry {
  data: NormalizedJob[];
  timestamp: number;
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const cache = new Map<string, CacheEntry>();

// ---- Normalizers ----

function normalizeRemotive(job: RemotiveJob): NormalizedJob {
  return {
    id: `remotive-${job.id}`,
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
    source: 'remotive',
  };
}

function normalizeArbeitnow(job: ArbeitnowJob): NormalizedJob {
  return {
    id: `arbeitnow-${job.slug}`,
    title: job.title,
    company: job.company_name,
    companyLogo: '',
    location: job.location || (job.remote ? 'Remote' : ''),
    salary: '',
    url: job.url,
    description: job.description || '',
    category: job.tags?.[0] || '',
    type: job.job_types?.[0] || '',
    date: job.created_at ? new Date(job.created_at * 1000).toISOString() : '',
    source: 'arbeitnow',
  };
}

function normalizeJobicy(job: JobicyJob): NormalizedJob {
  let salary = '';
  if (job.salaryMin && job.salaryMax) {
    const currency = job.salaryCurrency || 'USD';
    salary = `${currency} ${job.salaryMin.toLocaleString()}-${job.salaryMax.toLocaleString()}`;
    if (job.salaryPeriod) salary += `/${job.salaryPeriod}`;
  }

  return {
    id: `jobicy-${job.id}`,
    title: job.jobTitle,
    company: job.companyName,
    companyLogo: job.companyLogo || '',
    location: job.jobGeo || 'Remote',
    salary,
    url: job.url,
    description: job.jobDescription || job.jobExcerpt || '',
    category: job.jobIndustry?.[0] || '',
    type: job.jobType?.[0] || '',
    date: job.pubDate || '',
    source: 'jobicy',
  };
}

// ---- Fetchers ----

async function fetchRemotive(search: string, category: string): Promise<NormalizedJob[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category && category !== 'all') params.set('category', category);
  params.set('limit', '250');

  const res = await fetch(`https://remotive.com/api/remote-jobs?${params.toString()}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Remotive API returned ${res.status}`);
  const data = await res.json();
  return (data.jobs || []).map(normalizeRemotive);
}

async function fetchArbeitnow(): Promise<NormalizedJob[]> {
  const jobs: NormalizedJob[] = [];

  // Fetch first 2 pages (200 jobs max)
  for (let page = 1; page <= 2; page++) {
    const res = await fetch(`https://www.arbeitnow.com/api/job-board-api?page=${page}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) break;
    const data = await res.json();
    const pageJobs = (data.data || []).map(normalizeArbeitnow);
    jobs.push(...pageJobs);
    if (!data.links?.next) break;
  }

  return jobs;
}

async function fetchJobicy(search: string): Promise<NormalizedJob[]> {
  const params = new URLSearchParams();
  params.set('count', '50');
  if (search) params.set('tag', search);

  const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?${params.toString()}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Jobicy API returned ${res.status}`);
  const data = await res.json();
  return (data.jobs || []).map(normalizeJobicy);
}

// ---- Deduplication ----

function deduplicateJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  const seen = new Set<string>();
  return jobs.filter((job) => {
    const key = `${job.title.toLowerCase().trim()}::${job.company.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---- Route handler ----

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
        total: cached.data.length,
        cached: true,
      });
    }

    // Fetch all 3 sources in parallel — each one failing won't break the others
    const results = await Promise.allSettled([
      fetchRemotive(search, category),
      fetchArbeitnow(),
      fetchJobicy(search),
    ]);

    const allJobs: NormalizedJob[] = [];
    const sources: string[] = [];

    results.forEach((result, i) => {
      const name = ['remotive', 'arbeitnow', 'jobicy'][i];
      if (result.status === 'fulfilled') {
        allJobs.push(...result.value);
        sources.push(name);
      } else {
        console.error(`${name} fetch failed:`, result.reason);
      }
    });

    // Sort by date (newest first), then deduplicate
    allJobs.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    const jobs = deduplicateJobs(allJobs);

    cache.set(cacheKey, { data: jobs, timestamp: Date.now() });

    return NextResponse.json({
      jobs,
      sources,
      total: jobs.length,
      cached: false,
    });
  } catch (error) {
    console.error('Jobs API error:', error);

    const stale = cache.get(cacheKey);
    if (stale) {
      return NextResponse.json({
        jobs: stale.data,
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

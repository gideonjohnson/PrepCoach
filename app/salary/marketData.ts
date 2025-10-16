// Market Data Service - Simulated Levels.fyi API Integration

import { MarketData, ExperienceLevel, Location } from './types';

// Comprehensive market data database (simulated - in production would call Levels.fyi API)
const MARKET_DATA_DATABASE: Record<string, MarketData> = {
  // Software Engineering roles
  'software-engineer-entry-sf': {
    role: 'Software Engineer',
    company: 'Market Average',
    location: 'San Francisco Bay Area',
    level: 'Entry Level (0-2 years)',
    baseSalary: {
      min: 95000,
      p25: 115000,
      median: 135000,
      p75: 155000,
      max: 180000,
    },
    totalComp: {
      min: 120000,
      p25: 150000,
      median: 180000,
      p75: 220000,
      max: 280000,
    },
    equity: {
      min: 15000,
      median: 35000,
      max: 80000,
    },
    bonus: {
      min: 5000,
      median: 10000,
      max: 20000,
    },
    sampleSize: 2847,
    lastUpdated: new Date('2025-01-15'),
  },
  'software-engineer-mid-sf': {
    role: 'Software Engineer',
    company: 'Market Average',
    location: 'San Francisco Bay Area',
    level: 'Mid Level (3-5 years)',
    baseSalary: {
      min: 130000,
      p25: 155000,
      median: 180000,
      p75: 210000,
      max: 250000,
    },
    totalComp: {
      min: 180000,
      p25: 230000,
      median: 280000,
      p75: 350000,
      max: 450000,
    },
    equity: {
      min: 30000,
      median: 80000,
      max: 180000,
    },
    bonus: {
      min: 15000,
      median: 25000,
      max: 50000,
    },
    sampleSize: 3921,
    lastUpdated: new Date('2025-01-15'),
  },
  'software-engineer-senior-sf': {
    role: 'Software Engineer',
    company: 'Market Average',
    location: 'San Francisco Bay Area',
    level: 'Senior (6-10 years)',
    baseSalary: {
      min: 170000,
      p25: 200000,
      median: 235000,
      p75: 280000,
      max: 350000,
    },
    totalComp: {
      min: 250000,
      p25: 350000,
      median: 450000,
      p75: 600000,
      max: 850000,
    },
    equity: {
      min: 60000,
      median: 180000,
      max: 450000,
    },
    bonus: {
      min: 25000,
      median: 40000,
      max: 80000,
    },
    sampleSize: 4156,
    lastUpdated: new Date('2025-01-15'),
  },
  'software-engineer-staff-sf': {
    role: 'Software Engineer',
    company: 'Market Average',
    location: 'San Francisco Bay Area',
    level: 'Staff/Principal (10+ years)',
    baseSalary: {
      min: 220000,
      p25: 260000,
      median: 310000,
      p75: 370000,
      max: 450000,
    },
    totalComp: {
      min: 400000,
      p25: 550000,
      median: 700000,
      p75: 900000,
      max: 1300000,
    },
    equity: {
      min: 120000,
      median: 320000,
      max: 750000,
    },
    bonus: {
      min: 40000,
      median: 70000,
      max: 120000,
    },
    sampleSize: 1823,
    lastUpdated: new Date('2025-01-15'),
  },

  // New York City - Software Engineering
  'software-engineer-mid-nyc': {
    role: 'Software Engineer',
    company: 'Market Average',
    location: 'New York City',
    level: 'Mid Level (3-5 years)',
    baseSalary: {
      min: 125000,
      p25: 145000,
      median: 170000,
      p75: 200000,
      max: 235000,
    },
    totalComp: {
      min: 165000,
      p25: 210000,
      median: 260000,
      p75: 320000,
      max: 410000,
    },
    equity: {
      min: 25000,
      median: 70000,
      max: 160000,
    },
    bonus: {
      min: 12000,
      median: 22000,
      max: 45000,
    },
    sampleSize: 2134,
    lastUpdated: new Date('2025-01-15'),
  },

  // Seattle - Software Engineering
  'software-engineer-mid-seattle': {
    role: 'Software Engineer',
    company: 'Market Average',
    location: 'Seattle',
    level: 'Mid Level (3-5 years)',
    baseSalary: {
      min: 120000,
      p25: 145000,
      median: 170000,
      p75: 195000,
      max: 230000,
    },
    totalComp: {
      min: 170000,
      p25: 220000,
      median: 270000,
      p75: 340000,
      max: 430000,
    },
    equity: {
      min: 30000,
      median: 75000,
      max: 170000,
    },
    bonus: {
      min: 15000,
      median: 25000,
      max: 50000,
    },
    sampleSize: 1876,
    lastUpdated: new Date('2025-01-15'),
  },

  // Product Manager roles
  'product-manager-mid-sf': {
    role: 'Product Manager',
    company: 'Market Average',
    location: 'San Francisco Bay Area',
    level: 'Mid Level (3-5 years)',
    baseSalary: {
      min: 135000,
      p25: 160000,
      median: 185000,
      p75: 215000,
      max: 255000,
    },
    totalComp: {
      min: 190000,
      p25: 245000,
      median: 300000,
      p75: 375000,
      max: 480000,
    },
    equity: {
      min: 35000,
      median: 90000,
      max: 200000,
    },
    bonus: {
      min: 18000,
      median: 30000,
      max: 60000,
    },
    sampleSize: 1543,
    lastUpdated: new Date('2025-01-15'),
  },
  'product-manager-senior-sf': {
    role: 'Product Manager',
    company: 'Market Average',
    location: 'San Francisco Bay Area',
    level: 'Senior (6-10 years)',
    baseSalary: {
      min: 180000,
      p25: 210000,
      median: 245000,
      p75: 290000,
      max: 350000,
    },
    totalComp: {
      min: 280000,
      p25: 380000,
      median: 480000,
      p75: 620000,
      max: 820000,
    },
    equity: {
      min: 70000,
      median: 195000,
      max: 420000,
    },
    bonus: {
      min: 30000,
      median: 50000,
      max: 90000,
    },
    sampleSize: 1287,
    lastUpdated: new Date('2025-01-15'),
  },

  // Data Scientist roles
  'data-scientist-mid-sf': {
    role: 'Data Scientist',
    company: 'Market Average',
    location: 'San Francisco Bay Area',
    level: 'Mid Level (3-5 years)',
    baseSalary: {
      min: 125000,
      p25: 150000,
      median: 175000,
      p75: 205000,
      max: 245000,
    },
    totalComp: {
      min: 175000,
      p25: 225000,
      median: 275000,
      p75: 340000,
      max: 440000,
    },
    equity: {
      min: 30000,
      median: 75000,
      max: 170000,
    },
    bonus: {
      min: 15000,
      median: 25000,
      max: 50000,
    },
    sampleSize: 1652,
    lastUpdated: new Date('2025-01-15'),
  },

  // Engineering Manager roles
  'engineering-manager-manager-sf': {
    role: 'Engineering Manager',
    company: 'Market Average',
    location: 'San Francisco Bay Area',
    level: 'Manager',
    baseSalary: {
      min: 180000,
      p25: 215000,
      median: 255000,
      p75: 300000,
      max: 370000,
    },
    totalComp: {
      min: 280000,
      p25: 380000,
      median: 500000,
      p75: 650000,
      max: 880000,
    },
    equity: {
      min: 70000,
      median: 200000,
      max: 450000,
    },
    bonus: {
      min: 30000,
      median: 50000,
      max: 90000,
    },
    sampleSize: 987,
    lastUpdated: new Date('2025-01-15'),
  },

  // Remote roles
  'software-engineer-mid-remote': {
    role: 'Software Engineer',
    company: 'Market Average',
    location: 'Remote (US)',
    level: 'Mid Level (3-5 years)',
    baseSalary: {
      min: 110000,
      p25: 135000,
      median: 160000,
      p75: 185000,
      max: 220000,
    },
    totalComp: {
      min: 150000,
      p25: 195000,
      median: 240000,
      p75: 300000,
      max: 390000,
    },
    equity: {
      min: 25000,
      median: 65000,
      max: 150000,
    },
    bonus: {
      min: 12000,
      median: 20000,
      max: 40000,
    },
    sampleSize: 2456,
    lastUpdated: new Date('2025-01-15'),
  },
};

/**
 * Fetch market data for a specific role, level, and location
 */
export async function getMarketData(
  role: string,
  level: ExperienceLevel,
  location: Location
): Promise<MarketData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Normalize inputs for lookup
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '-');
  const normalizedLevel = level.toLowerCase().split(' ')[0]; // Extract first word (entry, mid, senior, etc.)
  const normalizedLocation = location.toLowerCase().includes('san francisco') ? 'sf' :
                              location.toLowerCase().includes('new york') ? 'nyc' :
                              location.toLowerCase().includes('seattle') ? 'seattle' :
                              location.toLowerCase().includes('remote') ? 'remote' : 'sf';

  const key = `${normalizedRole}-${normalizedLevel}-${normalizedLocation}`;

  // Return matching data or fallback to similar role
  if (MARKET_DATA_DATABASE[key]) {
    return MARKET_DATA_DATABASE[key];
  }

  // Fallback: Try to find similar role
  const fallbackKey = Object.keys(MARKET_DATA_DATABASE).find(k =>
    k.includes(normalizedRole) || k.includes(normalizedLevel)
  );

  if (fallbackKey) {
    return MARKET_DATA_DATABASE[fallbackKey];
  }

  return null;
}

/**
 * Compare an offer against market data
 */
export function compareToMarket(
  offerBaseSalary: number,
  offerTotalComp: number,
  marketData: MarketData
): {
  baseSalaryPercentile: number;
  totalCompPercentile: number;
  vsMedianBase: number;
  vsMedianTotal: number;
  vsP75Base: number;
  vsP75Total: number;
  marketPosition: 'below' | 'at' | 'above';
} {
  // Calculate percentile for base salary
  const baseSalaryPercentile = calculatePercentile(
    offerBaseSalary,
    marketData.baseSalary
  );

  // Calculate percentile for total comp
  const totalCompPercentile = calculatePercentile(
    offerTotalComp,
    marketData.totalComp
  );

  // Calculate differences
  const vsMedianBase = ((offerBaseSalary - marketData.baseSalary.median) / marketData.baseSalary.median) * 100;
  const vsMedianTotal = ((offerTotalComp - marketData.totalComp.median) / marketData.totalComp.median) * 100;
  const vsP75Base = ((offerBaseSalary - marketData.baseSalary.p75) / marketData.baseSalary.p75) * 100;
  const vsP75Total = ((offerTotalComp - marketData.totalComp.p75) / marketData.totalComp.p75) * 100;

  // Determine market position
  let marketPosition: 'below' | 'at' | 'above' = 'at';
  if (totalCompPercentile < 40) {
    marketPosition = 'below';
  } else if (totalCompPercentile > 60) {
    marketPosition = 'above';
  }

  return {
    baseSalaryPercentile,
    totalCompPercentile,
    vsMedianBase,
    vsMedianTotal,
    vsP75Base,
    vsP75Total,
    marketPosition,
  };
}

/**
 * Calculate percentile of a value within a distribution
 */
function calculatePercentile(
  value: number,
  distribution: { min: number; p25: number; median: number; p75: number; max: number }
): number {
  if (value <= distribution.min) return 0;
  if (value >= distribution.max) return 100;

  // Linear interpolation between data points
  if (value <= distribution.p25) {
    return 0 + (25 * (value - distribution.min) / (distribution.p25 - distribution.min));
  } else if (value <= distribution.median) {
    return 25 + (25 * (value - distribution.p25) / (distribution.median - distribution.p25));
  } else if (value <= distribution.p75) {
    return 50 + (25 * (value - distribution.median) / (distribution.p75 - distribution.median));
  } else {
    return 75 + (25 * (value - distribution.p75) / (distribution.max - distribution.p75));
  }
}

/**
 * Generate negotiation leverage analysis
 */
export function analyzeNegotiationLeverage(
  offerBaseSalary: number,
  offerTotalComp: number,
  marketData: MarketData,
  hasCompetingOffers: boolean = false,
  yearsExperience: number = 0
): {
  strengths: string[];
  weaknesses: string[];
  targetIncrease: number;
  confidenceScore: number;
  strategy: 'aggressive' | 'moderate' | 'conservative';
  talkingPoints: string[];
} {
  const marketComparison = compareToMarket(offerBaseSalary, offerTotalComp, marketData);
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const talkingPoints: string[] = [];

  // Analyze strengths
  if (hasCompetingOffers) {
    strengths.push('Multiple offers in hand');
    talkingPoints.push('I have other competitive offers that I\'m evaluating alongside this one.');
  }

  if (yearsExperience > 0) {
    const expectedLevel = marketData.level.match(/\d+/)?.[0] || '0';
    if (yearsExperience > parseInt(expectedLevel)) {
      strengths.push('More experience than typical for this level');
      talkingPoints.push(`With ${yearsExperience} years of experience, I bring additional expertise beyond this level's typical requirements.`);
    }
  }

  if (marketComparison.marketPosition === 'below') {
    strengths.push('Current offer is below market median');
    talkingPoints.push(`Based on market data from ${marketData.sampleSize.toLocaleString()} data points, this offer is ${Math.abs(marketComparison.vsMedianTotal).toFixed(1)}% below the median total compensation for this role.`);
  }

  // Analyze weaknesses
  if (!hasCompetingOffers) {
    weaknesses.push('No competing offers');
  }

  if (marketComparison.marketPosition === 'above') {
    weaknesses.push('Current offer already above market median');
  }

  // Determine target increase
  let targetIncrease = 0;
  if (marketComparison.marketPosition === 'below') {
    // Target: bring to 60th percentile
    const target60thPercentile = marketData.totalComp.median +
      (marketData.totalComp.p75 - marketData.totalComp.median) * 0.4;
    targetIncrease = target60thPercentile - offerTotalComp;
  } else if (marketComparison.marketPosition === 'at') {
    // Target: 10-15% increase
    targetIncrease = offerTotalComp * 0.125;
  } else {
    // Target: 5-10% increase
    targetIncrease = offerTotalComp * 0.075;
  }

  // Calculate confidence score (0-100)
  let confidenceScore = 50; // Base confidence
  if (hasCompetingOffers) confidenceScore += 20;
  if (marketComparison.marketPosition === 'below') confidenceScore += 15;
  if (strengths.length >= 3) confidenceScore += 10;
  confidenceScore = Math.min(confidenceScore, 95); // Cap at 95

  // Determine strategy
  let strategy: 'aggressive' | 'moderate' | 'conservative' = 'moderate';
  if (confidenceScore >= 75) {
    strategy = 'aggressive';
  } else if (confidenceScore < 50) {
    strategy = 'conservative';
  }

  // Add general talking points
  talkingPoints.push(
    'I\'m very excited about this opportunity and believe I can make a significant impact on the team.',
    'I\'ve done research on market compensation for this role and level in this location.',
    'I\'m looking for a package that reflects both my experience and the value I\'ll bring to the company.'
  );

  return {
    strengths,
    weaknesses,
    targetIncrease,
    confidenceScore,
    strategy,
    talkingPoints,
  };
}

/**
 * Get all available market data (for browsing)
 */
export function getAllMarketData(): MarketData[] {
  return Object.values(MARKET_DATA_DATABASE);
}

/**
 * Search market data by filters
 */
export function searchMarketData(filters: {
  role?: string;
  level?: string;
  location?: string;
}): MarketData[] {
  return Object.values(MARKET_DATA_DATABASE).filter(data => {
    if (filters.role && !data.role.toLowerCase().includes(filters.role.toLowerCase())) {
      return false;
    }
    if (filters.level && !data.level.toLowerCase().includes(filters.level.toLowerCase())) {
      return false;
    }
    if (filters.location && !data.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    return true;
  });
}

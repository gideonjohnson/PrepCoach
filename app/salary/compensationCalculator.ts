// Compensation Calculator - Total comp breakdown and projections

import { JobOffer, CompensationBreakdown } from './types';

/**
 * Calculate 4-year total compensation breakdown
 */
export function calculateCompensationBreakdown(offer: JobOffer): CompensationBreakdown {
  // Parse vesting schedule (common formats: "4 years, 25% per year", "4 years, 1-year cliff")
  const vestingYears = 4; // Standard vesting period
  const hasCliff = offer.vestingSchedule.toLowerCase().includes('cliff');

  // Equity vesting calculation
  const equityPerYear = hasCliff
    ? [offer.equityValue * 0.25, offer.equityValue * 0.25, offer.equityValue * 0.25, offer.equityValue * 0.25]
    : [offer.equityValue / vestingYears, offer.equityValue / vestingYears, offer.equityValue / vestingYears, offer.equityValue / vestingYears];

  // Year 1
  const year1 =
    offer.baseSalary +
    offer.signingBonus + // Signing bonus typically paid in year 1
    offer.performanceBonus +
    equityPerYear[0];

  // Year 2
  const year2 =
    offer.baseSalary +
    offer.performanceBonus +
    equityPerYear[1];

  // Year 3
  const year3 =
    offer.baseSalary +
    offer.performanceBonus +
    equityPerYear[2];

  // Year 4
  const year4 =
    offer.baseSalary +
    offer.performanceBonus +
    equityPerYear[3];

  const total4Year = year1 + year2 + year3 + year4;
  const averageAnnual = total4Year / 4;

  // Calculate benefits value (estimated annual value)
  const benefitsValue = calculateBenefitsValue(offer);

  return {
    year1,
    year2,
    year3,
    year4,
    total4Year,
    averageAnnual,
    baseSalary: offer.baseSalary,
    equityValue: offer.equityValue,
    bonuses: offer.signingBonus + offer.performanceBonus,
    benefitsValue,
  };
}

/**
 * Calculate estimated annual value of benefits package
 */
export function calculateBenefitsValue(offer: JobOffer): number {
  let total = 0;

  // Health insurance (employer portion estimated at $8,000/year for individual)
  if (offer.benefits.healthInsurance) {
    total += 8000;
  }

  // Dental & Vision (employer portion estimated at $1,500/year)
  if (offer.benefits.dentalVision) {
    total += 1500;
  }

  // 401k match (calculate based on match percentage)
  if (offer.benefits.retirement401k && offer.benefits.retirement401kMatch) {
    // Parse match string like "50% up to 6%" or "100% up to 4%"
    const matchStr = offer.benefits.retirement401kMatch.toLowerCase();
    const matchPercentMatch = matchStr.match(/(\d+)%.*?(\d+)%/);

    if (matchPercentMatch) {
      const matchRate = parseInt(matchPercentMatch[1]) / 100;
      const matchCap = parseInt(matchPercentMatch[2]) / 100;
      const estimatedContribution = offer.baseSalary * matchCap;
      total += estimatedContribution * matchRate;
    }
  }

  // PTO value (calculated as daily salary * PTO days)
  if (offer.benefits.pto > 0) {
    const dailySalary = offer.baseSalary / 260; // 260 working days per year
    total += dailySalary * offer.benefits.pto;
  }

  // Parental leave value (estimated value if used)
  if (offer.benefits.parentalLeave > 0) {
    // Valued at 20% since not everyone uses it immediately
    const dailySalary = offer.baseSalary / 260;
    total += (dailySalary * offer.benefits.parentalLeave) * 0.2;
  }

  // Remote work savings (estimated at $5,000/year in commute + lunch costs)
  if (offer.benefits.remoteWork) {
    total += 5000;
  }

  // Learning budget
  if (offer.benefits.learningBudget > 0) {
    total += offer.benefits.learningBudget;
  }

  // Gym membership (estimated at $600/year)
  if (offer.benefits.gymMembership) {
    total += 600;
  }

  // Commuter benefits (estimated at $1,200/year)
  if (offer.benefits.commuter) {
    total += 1200;
  }

  return Math.round(total);
}

/**
 * Compare multiple offers and determine the best one
 */
export function compareOffers(offers: JobOffer[]): {
  breakdown: CompensationBreakdown[];
  winner: string;
  insights: string[];
} {
  if (offers.length === 0) {
    return {
      breakdown: [],
      winner: '',
      insights: ['No offers to compare'],
    };
  }

  // Calculate breakdowns for all offers
  const breakdown = offers.map(offer => calculateCompensationBreakdown(offer));

  // Find the winner based on total 4-year compensation
  let maxTotal = 0;
  let winnerIndex = 0;
  breakdown.forEach((comp, index) => {
    if (comp.total4Year > maxTotal) {
      maxTotal = comp.total4Year;
      winnerIndex = index;
    }
  });

  const winner = offers[winnerIndex].company;

  // Generate insights
  const insights: string[] = [];

  // Insight 1: Total compensation comparison
  if (offers.length > 1) {
    const sortedByTotal = [...breakdown]
      .map((b, i) => ({ comp: b, offer: offers[i] }))
      .sort((a, b) => b.comp.total4Year - a.comp.total4Year);

    const topOffer = sortedByTotal[0];
    const secondOffer = sortedByTotal[1];
    const difference = topOffer.comp.total4Year - secondOffer.comp.total4Year;
    const percentDiff = ((difference / secondOffer.comp.total4Year) * 100).toFixed(1);

    insights.push(
      `${topOffer.offer.company} offers the highest total 4-year compensation at ${formatCurrency(topOffer.comp.total4Year)}, which is ${percentDiff}% more than ${secondOffer.offer.company}.`
    );
  }

  // Insight 2: Base salary vs equity mix
  const equityHeavy = breakdown.find((b, i) => {
    const equityPercent = (b.equityValue / b.total4Year) * 100;
    return equityPercent > 40;
  });

  if (equityHeavy) {
    const index = breakdown.indexOf(equityHeavy);
    const equityPercent = ((equityHeavy.equityValue / equityHeavy.total4Year) * 100).toFixed(0);
    insights.push(
      `${offers[index].company} is equity-heavy with ${equityPercent}% of compensation from stock. This offers high upside but more risk.`
    );
  }

  // Insight 3: First year cash comparison
  const cashYear1 = offers.map((offer, i) => ({
    company: offer.company,
    cash: offer.baseSalary + offer.signingBonus + offer.performanceBonus,
  }));

  const highestCashYear1 = cashYear1.reduce((max, curr) => curr.cash > max.cash ? curr : max);

  insights.push(
    `${highestCashYear1.company} provides the most first-year cash at ${formatCurrency(highestCashYear1.cash)}, which is important for immediate financial needs.`
  );

  // Insight 4: Benefits comparison
  const benefitsRanked = breakdown
    .map((b, i) => ({ company: offers[i].company, benefits: b.benefitsValue }))
    .sort((a, b) => b.benefits - a.benefits);

  if (benefitsRanked[0].benefits > benefitsRanked[benefitsRanked.length - 1].benefits + 3000) {
    insights.push(
      `${benefitsRanked[0].company} has the strongest benefits package worth ${formatCurrency(benefitsRanked[0].benefits)}/year, significantly better than others.`
    );
  }

  // Insight 5: Equity vesting consideration
  const cliffOffers = offers.filter(o => o.vestingSchedule.toLowerCase().includes('cliff'));
  if (cliffOffers.length > 0) {
    insights.push(
      `${cliffOffers.map(o => o.company).join(', ')} ha${cliffOffers.length > 1 ? 've' : 's'} a 1-year equity cliff. You'll receive nothing if you leave before 1 year.`
    );
  }

  return {
    breakdown,
    winner,
    insights,
  };
}

/**
 * Calculate take-home pay after taxes (rough estimate)
 */
export function calculateTakeHomePay(
  grossIncome: number,
  state: 'CA' | 'NY' | 'WA' | 'TX' | 'Other' = 'Other'
): {
  federal: number;
  stateTax: number;
  fica: number;
  takeHome: number;
  effectiveRate: number;
} {
  // Federal tax (2024 single filer brackets, simplified)
  let federal = 0;
  if (grossIncome > 578125) {
    federal = 174238 + 0.37 * (grossIncome - 578125);
  } else if (grossIncome > 231250) {
    federal = 52832 + 0.35 * (grossIncome - 231250);
  } else if (grossIncome > 182100) {
    federal = 35664 + 0.32 * (grossIncome - 182100);
  } else if (grossIncome > 95375) {
    federal = 16290 + 0.24 * (grossIncome - 95375);
  } else if (grossIncome > 44725) {
    federal = 5147 + 0.22 * (grossIncome - 44725);
  } else if (grossIncome > 11000) {
    federal = 1100 + 0.12 * (grossIncome - 11000);
  } else {
    federal = 0.10 * grossIncome;
  }

  // State tax (simplified rates)
  let stateRate = 0;
  switch (state) {
    case 'CA':
      stateRate = grossIncome > 61214 ? 0.093 : 0.06; // Simplified CA rates
      break;
    case 'NY':
      stateRate = grossIncome > 25000 ? 0.065 : 0.04; // Simplified NY rates
      break;
    case 'WA':
      stateRate = 0; // No state income tax
      break;
    case 'TX':
      stateRate = 0; // No state income tax
      break;
    default:
      stateRate = 0.05; // Average state tax
  }

  const stateTax = grossIncome * stateRate;

  // FICA (Social Security + Medicare)
  const socialSecurity = Math.min(grossIncome, 160200) * 0.062; // SS cap at $160,200
  const medicare = grossIncome * 0.0145;
  const additionalMedicare = grossIncome > 200000 ? (grossIncome - 200000) * 0.009 : 0;
  const fica = socialSecurity + medicare + additionalMedicare;

  // Take-home pay
  const takeHome = grossIncome - federal - stateTax - fica;
  const effectiveRate = ((grossIncome - takeHome) / grossIncome) * 100;

  return {
    federal: Math.round(federal),
    stateTax: Math.round(stateTax),
    fica: Math.round(fica),
    takeHome: Math.round(takeHome),
    effectiveRate: Math.round(effectiveRate * 10) / 10,
  };
}

/**
 * Calculate equity value projections based on growth scenarios
 */
export function projectEquityValue(
  currentValue: number,
  scenarios: {
    conservative: number; // e.g., 0.1 for 10% annual growth
    moderate: number;
    optimistic: number;
  },
  years: number = 4
): {
  conservative: number;
  moderate: number;
  optimistic: number;
} {
  return {
    conservative: Math.round(currentValue * Math.pow(1 + scenarios.conservative, years)),
    moderate: Math.round(currentValue * Math.pow(1 + scenarios.moderate, years)),
    optimistic: Math.round(currentValue * Math.pow(1 + scenarios.optimistic, years)),
  };
}

/**
 * Calculate the true cost of leaving unvested equity
 */
export function calculateUnvestedEquityLoss(
  totalEquityGrant: number,
  vestingSchedule: string,
  monthsWorked: number
): {
  vested: number;
  unvested: number;
  percentageLost: number;
} {
  // Parse vesting schedule
  const hasCliff = vestingSchedule.toLowerCase().includes('1-year cliff') ||
                   vestingSchedule.toLowerCase().includes('1 year cliff');
  const vestingYears = 4; // Standard
  const vestingMonths = vestingYears * 12;

  let vested = 0;

  if (hasCliff) {
    // With 1-year cliff, nothing vests until 12 months
    if (monthsWorked < 12) {
      vested = 0;
    } else {
      // After cliff, vest monthly
      vested = (monthsWorked / vestingMonths) * totalEquityGrant;
    }
  } else {
    // Linear vesting from day 1
    vested = (monthsWorked / vestingMonths) * totalEquityGrant;
  }

  vested = Math.min(vested, totalEquityGrant); // Cap at total grant
  const unvested = totalEquityGrant - vested;
  const percentageLost = (unvested / totalEquityGrant) * 100;

  return {
    vested: Math.round(vested),
    unvested: Math.round(unvested),
    percentageLost: Math.round(percentageLost * 10) / 10,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large numbers with abbreviations (K, M)
 */
export function formatLargeNumber(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return formatCurrency(amount);
}

/**
 * Calculate annual raise needed to match competing offer
 */
export function calculateRequiredRaise(
  currentSalary: number,
  competingOfferTotal: number,
  yearsToMatch: number = 2
): {
  annualRaisePercent: number;
  annualRaiseAmount: number;
  totalAfterYears: number;
  stillShortBy: number;
} {
  // Calculate required annual raise to match competing offer in X years
  const requiredMultiplier = Math.pow(competingOfferTotal / currentSalary, 1 / yearsToMatch);
  const annualRaisePercent = (requiredMultiplier - 1) * 100;
  const annualRaiseAmount = currentSalary * (requiredMultiplier - 1);
  const totalAfterYears = currentSalary * Math.pow(requiredMultiplier, yearsToMatch);
  const stillShortBy = competingOfferTotal - totalAfterYears;

  return {
    annualRaisePercent: Math.round(annualRaisePercent * 10) / 10,
    annualRaiseAmount: Math.round(annualRaiseAmount),
    totalAfterYears: Math.round(totalAfterYears),
    stillShortBy: Math.round(stillShortBy),
  };
}

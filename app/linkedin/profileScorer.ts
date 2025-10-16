// LinkedIn Profile Optimizer - Profile Scoring Algorithm

import { LinkedInProfile, ProfileScore, ScoreFeedback, KeywordAnalysis } from './types';

/**
 * Score a LinkedIn profile across multiple dimensions
 */
export function scoreProfile(
  profile: LinkedInProfile,
  keywordAnalysis: KeywordAnalysis
): ProfileScore {
  const relevanceScore = calculateRelevanceScore(profile, keywordAnalysis);
  const impactScore = calculateImpactScore(profile);
  const clarityScore = calculateClarityScore(profile);
  const completenessScore = calculateCompletenessScore(profile);

  // Overall score is weighted average
  const overall = Math.round(
    relevanceScore.score * 0.35 +
    impactScore.score * 0.25 +
    clarityScore.score * 0.20 +
    completenessScore.score * 0.20
  );

  // Combine all feedback
  const feedback = [
    ...relevanceScore.feedback,
    ...impactScore.feedback,
    ...clarityScore.feedback,
    ...completenessScore.feedback,
  ].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return {
    overall,
    relevance: relevanceScore.score,
    impact: impactScore.score,
    clarity: clarityScore.score,
    completeness: completenessScore.score,
    feedback,
  };
}

/**
 * Calculate relevance score (keyword alignment with target jobs)
 */
function calculateRelevanceScore(
  profile: LinkedInProfile,
  keywordAnalysis: KeywordAnalysis
): { score: number; feedback: ScoreFeedback[] } {
  const feedback: ScoreFeedback[] = [];
  let score = keywordAnalysis.coverageScore;

  // Deduct for missing high-priority keywords
  const highPriorityGaps = keywordAnalysis.keywordGaps.filter(gap => gap.importance === 'high');

  if (highPriorityGaps.length > 5) {
    feedback.push({
      category: 'relevance',
      issue: `Missing ${highPriorityGaps.length} essential keywords found in most target jobs`,
      suggestion: `Add these high-priority keywords to your headline, About, and experience: ${highPriorityGaps.slice(0, 3).map(g => g.keyword).join(', ')}`,
      priority: 'high',
    });
  } else if (highPriorityGaps.length > 0) {
    feedback.push({
      category: 'relevance',
      issue: `${highPriorityGaps.length} important keywords are missing`,
      suggestion: `Incorporate these keywords where relevant: ${highPriorityGaps.map(g => g.keyword).join(', ')}`,
      priority: 'medium',
    });
  }

  // Check headline relevance
  const headlineHasKeywords = keywordAnalysis.presentKeywords.some(keyword =>
    profile.headline.toLowerCase().includes(keyword.toLowerCase())
  );

  if (!headlineHasKeywords) {
    score -= 10;
    feedback.push({
      category: 'relevance',
      issue: 'Headline lacks target role keywords',
      suggestion: 'Update your headline to include 2-3 key skills or technologies from your target jobs',
      priority: 'high',
    });
  }

  // Check about section relevance
  const aboutHasKeywords = keywordAnalysis.presentKeywords.filter(keyword =>
    profile.about.toLowerCase().includes(keyword.toLowerCase())
  ).length;

  if (aboutHasKeywords < 3) {
    score -= 10;
    feedback.push({
      category: 'relevance',
      issue: 'About section has limited keyword coverage',
      suggestion: 'Incorporate more relevant keywords naturally throughout your About section',
      priority: 'medium',
    });
  }

  return { score: Math.max(0, Math.min(100, score)), feedback };
}

/**
 * Calculate impact score (use of metrics, achievements, quantifiable results)
 */
function calculateImpactScore(profile: LinkedInProfile): { score: number; feedback: ScoreFeedback[] } {
  const feedback: ScoreFeedback[] = [];
  let score = 50; // Start at 50

  // Check for metrics in experience
  const experienceText = profile.experience.map(exp => exp.description).join(' ');
  const metricPatterns = [
    /\d+%/g, // Percentages
    /\d+x/gi, // Multipliers
    /\$[\d,]+/g, // Dollar amounts
    /\d+\s*(?:users|customers|engineers|team members|projects)/gi, // Quantities
    /(?:increased|decreased|reduced|improved|grew|scaled)\s+(?:by\s+)?\d+/gi, // Growth metrics
  ];

  let metricCount = 0;
  metricPatterns.forEach(pattern => {
    const matches = experienceText.match(pattern);
    if (matches) {
      metricCount += matches.length;
    }
  });

  // Score based on metric density
  const experienceItemCount = profile.experience.length || 1;
  const metricsPerExperience = metricCount / experienceItemCount;

  if (metricsPerExperience >= 3) {
    score = 95;
    feedback.push({
      category: 'impact',
      issue: 'Excellent use of quantifiable achievements',
      suggestion: 'Continue to highlight measurable impact in all experience bullets',
      priority: 'low',
    });
  } else if (metricsPerExperience >= 2) {
    score = 80;
  } else if (metricsPerExperience >= 1) {
    score = 65;
    feedback.push({
      category: 'impact',
      issue: 'Some quantifiable results, but could add more',
      suggestion: 'Try to add at least 2-3 metrics or achievements per role',
      priority: 'medium',
    });
  } else {
    score = 40;
    feedback.push({
      category: 'impact',
      issue: 'Limited use of metrics and quantifiable achievements',
      suggestion: 'Add specific numbers, percentages, and measurable outcomes to your experience bullets. Example: "Improved API response time by 45%" instead of "Improved API performance"',
      priority: 'high',
    });
  }

  // Check for action verbs
  const actionVerbs = [
    'Led', 'Built', 'Developed', 'Designed', 'Implemented', 'Architected', 'Optimized',
    'Improved', 'Reduced', 'Increased', 'Launched', 'Managed', 'Delivered', 'Created',
    'Established', 'Drove', 'Spearheaded', 'Transformed', 'Scaled',
  ];

  const hasStrongVerbs = actionVerbs.some(verb =>
    experienceText.includes(verb)
  );

  if (!hasStrongVerbs) {
    score -= 15;
    feedback.push({
      category: 'impact',
      issue: 'Experience bullets lack strong action verbs',
      suggestion: 'Start each bullet with powerful action verbs like "Led", "Built", "Optimized", "Scaled"',
      priority: 'medium',
    });
  }

  // Check headline for impact statement
  if (!profile.headline.match(/\d+[+]?\s*(?:years?|products?|teams?)/i)) {
    feedback.push({
      category: 'impact',
      issue: 'Headline could include years of experience or scale of impact',
      suggestion: 'Consider adding "10+ years", "50M+ users served", or similar impact metrics to your headline',
      priority: 'low',
    });
  }

  return { score: Math.max(0, Math.min(100, score)), feedback };
}

/**
 * Calculate clarity score (professional language, readability, structure)
 */
function calculateClarityScore(profile: LinkedInProfile): { score: number; feedback: ScoreFeedback[] } {
  const feedback: ScoreFeedback[] = [];
  let score = 80; // Start optimistically

  // Check headline length and structure
  if (profile.headline.length < 20) {
    score -= 15;
    feedback.push({
      category: 'clarity',
      issue: 'Headline is too short and vague',
      suggestion: 'Expand your headline to 80-120 characters with your role, key skills, and value proposition',
      priority: 'high',
    });
  } else if (profile.headline.length > 220) {
    score -= 10;
    feedback.push({
      category: 'clarity',
      issue: 'Headline exceeds LinkedIn\'s 220 character limit',
      suggestion: 'Shorten your headline to under 220 characters',
      priority: 'high',
    });
  }

  // Check About section length
  if (profile.about.length < 200) {
    score -= 20;
    feedback.push({
      category: 'clarity',
      issue: 'About section is too brief',
      suggestion: 'Expand your About section to 300-600 words with specific examples of your expertise and impact',
      priority: 'high',
    });
  } else if (profile.about.length > 2600) {
    score -= 10;
    feedback.push({
      category: 'clarity',
      issue: 'About section exceeds LinkedIn\'s 2600 character limit',
      suggestion: 'Condense your About section to focus on the most impactful points',
      priority: 'medium',
    });
  }

  // Check for proper paragraph structure in About
  const paragraphCount = profile.about.split('\n\n').filter(p => p.trim().length > 0).length;
  if (paragraphCount < 2) {
    score -= 10;
    feedback.push({
      category: 'clarity',
      issue: 'About section lacks paragraph breaks',
      suggestion: 'Break your About section into 3-4 paragraphs for better readability',
      priority: 'medium',
    });
  }

  // Check for jargon overload
  const jargonCount = (profile.about.match(/synergy|leverage|circle back|touch base|low-hanging fruit|paradigm shift/gi) || []).length;
  if (jargonCount > 3) {
    score -= 15;
    feedback.push({
      category: 'clarity',
      issue: 'Excessive use of buzzwords and jargon',
      suggestion: 'Replace corporate jargon with clear, specific language about what you actually do',
      priority: 'medium',
    });
  }

  // Check for first-person perspective
  const hasFirstPerson = /\bI\b|\bmy\b/i.test(profile.about);
  if (!hasFirstPerson) {
    score -= 5;
    feedback.push({
      category: 'clarity',
      issue: 'About section may be too formal or third-person',
      suggestion: 'Write in first person ("I", "my") for a more personal and engaging tone',
      priority: 'low',
    });
  }

  // Check experience descriptions
  let experienceIssues = 0;
  profile.experience.forEach(exp => {
    if (exp.description.length < 50) {
      experienceIssues++;
    }
  });

  if (experienceIssues > 0) {
    score -= experienceIssues * 5;
    feedback.push({
      category: 'clarity',
      issue: `${experienceIssues} experience ${experienceIssues === 1 ? 'entry has' : 'entries have'} insufficient detail`,
      suggestion: 'Add 3-5 bullet points to each role describing your responsibilities and achievements',
      priority: 'medium',
    });
  }

  return { score: Math.max(0, Math.min(100, score)), feedback };
}

/**
 * Calculate completeness score (profile sections filled out)
 */
function calculateCompletenessScore(profile: LinkedInProfile): { score: number; feedback: ScoreFeedback[] } {
  const feedback: ScoreFeedback[] = [];
  let score = 0;
  let maxScore = 0;

  // Headline (required)
  maxScore += 15;
  if (profile.headline && profile.headline.length > 20) {
    score += 15;
  } else {
    feedback.push({
      category: 'completeness',
      issue: 'Headline is missing or incomplete',
      suggestion: 'Add a compelling headline that showcases your expertise',
      priority: 'high',
    });
  }

  // About (required)
  maxScore += 20;
  if (profile.about && profile.about.length > 200) {
    score += 20;
  } else {
    feedback.push({
      category: 'completeness',
      issue: 'About section is missing or too brief',
      suggestion: 'Write a comprehensive About section (300-600 words) highlighting your expertise and value',
      priority: 'high',
    });
  }

  // Experience (required)
  maxScore += 25;
  if (profile.experience.length >= 3) {
    score += 25;
  } else if (profile.experience.length >= 1) {
    score += 15;
    feedback.push({
      category: 'completeness',
      issue: 'Limited work experience listed',
      suggestion: 'Add more work experience entries to showcase your career progression',
      priority: 'medium',
    });
  } else {
    feedback.push({
      category: 'completeness',
      issue: 'No work experience listed',
      suggestion: 'Add your work experience with detailed descriptions',
      priority: 'high',
    });
  }

  // Skills (required)
  maxScore += 20;
  if (profile.skills.length >= 10) {
    score += 20;
  } else if (profile.skills.length >= 5) {
    score += 12;
    feedback.push({
      category: 'completeness',
      issue: 'Could add more skills',
      suggestion: 'Add 10-15 relevant skills for better recruiter discoverability',
      priority: 'medium',
    });
  } else {
    score += 5;
    feedback.push({
      category: 'completeness',
      issue: 'Insufficient skills listed',
      suggestion: 'Add at least 10 relevant skills to your profile',
      priority: 'high',
    });
  }

  // Education (optional but recommended)
  maxScore += 10;
  if (profile.education && profile.education.length > 0) {
    score += 10;
  } else {
    feedback.push({
      category: 'completeness',
      issue: 'No education listed',
      suggestion: 'Add your education background for a more complete profile',
      priority: 'low',
    });
  }

  // Certifications (optional)
  maxScore += 5;
  if (profile.certifications && profile.certifications.length > 0) {
    score += 5;
  } else {
    feedback.push({
      category: 'completeness',
      issue: 'No certifications listed',
      suggestion: 'Add relevant certifications to demonstrate continuous learning',
      priority: 'low',
    });
  }

  // Projects (optional)
  maxScore += 5;
  if (profile.projects && profile.projects.length > 0) {
    score += 5;
  } else {
    feedback.push({
      category: 'completeness',
      issue: 'No projects showcased',
      suggestion: 'Add key projects to demonstrate your practical experience',
      priority: 'low',
    });
  }

  // Normalize to 100
  const normalizedScore = Math.round((score / maxScore) * 100);

  return { score: normalizedScore, feedback };
}

/**
 * Generate overall profile assessment
 */
export function generateProfileAssessment(score: ProfileScore): {
  grade: string;
  summary: string;
  topPriorities: string[];
  quickWins: string[];
} {
  let grade = 'F';
  let summary = '';

  // Determine grade
  if (score.overall >= 90) {
    grade = 'A+';
    summary = 'Outstanding profile! Your LinkedIn is highly optimized and competitive.';
  } else if (score.overall >= 80) {
    grade = 'A';
    summary = 'Excellent profile! Just a few tweaks needed to reach perfection.';
  } else if (score.overall >= 70) {
    grade = 'B';
    summary = 'Good profile with solid foundation. Focus on the high-priority items to reach the next level.';
  } else if (score.overall >= 60) {
    grade = 'C';
    summary = 'Average profile. Significant improvements needed to stand out to recruiters.';
  } else if (score.overall >= 50) {
    grade = 'D';
    summary = 'Below average. Your profile needs substantial work to be competitive.';
  } else {
    grade = 'F';
    summary = 'Critical issues detected. Prioritize fixing high-priority items immediately.';
  }

  // Get top priorities (high priority feedback)
  const topPriorities = score.feedback
    .filter(f => f.priority === 'high')
    .slice(0, 5)
    .map(f => f.suggestion);

  // Identify quick wins (medium/low priority items that are easy to fix)
  const quickWins = score.feedback
    .filter(f => f.priority === 'medium' || f.priority === 'low')
    .slice(0, 3)
    .map(f => f.suggestion);

  return {
    grade,
    summary,
    topPriorities,
    quickWins,
  };
}

/**
 * Compare profile score before and after optimization
 */
export function compareScores(
  beforeScore: ProfileScore,
  afterScore: ProfileScore
): {
  improvement: number;
  improvedCategories: string[];
  insights: string[];
} {
  const improvement = afterScore.overall - beforeScore.overall;
  const improvedCategories: string[] = [];

  if (afterScore.relevance > beforeScore.relevance) improvedCategories.push('Relevance');
  if (afterScore.impact > beforeScore.impact) improvedCategories.push('Impact');
  if (afterScore.clarity > beforeScore.clarity) improvedCategories.push('Clarity');
  if (afterScore.completeness > beforeScore.completeness) improvedCategories.push('Completeness');

  const insights: string[] = [];

  if (improvement >= 20) {
    insights.push('🎉 Major improvement! Your profile is now significantly more competitive.');
  } else if (improvement >= 10) {
    insights.push('✅ Solid improvement! You\'re moving in the right direction.');
  } else if (improvement > 0) {
    insights.push('👍 Minor improvement. Keep refining to reach your target score.');
  } else {
    insights.push('⚠️ No improvement detected. Review the high-priority feedback items.');
  }

  if (afterScore.relevance >= 80) {
    insights.push('🎯 Your profile now has excellent keyword alignment with target roles.');
  }

  if (afterScore.impact >= 80) {
    insights.push('💪 Strong use of metrics and achievements - your impact is clear.');
  }

  return {
    improvement,
    improvedCategories,
    insights,
  };
}

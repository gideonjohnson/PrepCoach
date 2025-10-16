// LinkedIn Profile Optimizer - Profile Content Generator

import { LinkedInProfile, OptimizedSection, OptimizedBullet, KeywordAnalysis } from './types';

/**
 * Generate optimized headline with keywords and value proposition
 */
export function optimizeHeadline(
  currentHeadline: string,
  targetRole: string,
  keywordAnalysis: KeywordAnalysis,
  profile: LinkedInProfile
): OptimizedSection {
  const improvements: string[] = [];
  const keywordsAdded: string[] = [];

  // Extract top keywords to incorporate
  const topKeywords = keywordAnalysis.keywordGaps
    .filter(gap => gap.importance === 'high')
    .slice(0, 5)
    .map(gap => gap.keyword);

  // Build optimized headline components
  const components = [];

  // 1. Core title/role
  if (targetRole) {
    components.push(targetRole);
  }

  // 2. Add specialization or unique value
  const specializations = extractSpecializations(profile, topKeywords);
  if (specializations.length > 0) {
    components.push(`| ${specializations.slice(0, 2).join(' & ')}`);
  }

  // 3. Add key technologies or skills
  const techSkills = topKeywords.filter(k =>
    ['JavaScript', 'Python', 'React', 'AWS', 'TypeScript', 'Node.js', 'Docker', 'Kubernetes']
      .some(tech => k.includes(tech))
  ).slice(0, 3);

  if (techSkills.length > 0) {
    components.push(`| ${techSkills.join(', ')}`);
    keywordsAdded.push(...techSkills);
  }

  // 4. Add impact or achievement (if applicable)
  const hasLeadership = profile.experience.some(exp =>
    exp.title.toLowerCase().includes('lead') ||
    exp.title.toLowerCase().includes('manager') ||
    exp.title.toLowerCase().includes('senior')
  );

  if (hasLeadership) {
    components.push('| Technical Leadership');
  }

  const optimized = components.join(' ').substring(0, 220); // LinkedIn headline limit

  // Track improvements
  if (optimized.length > currentHeadline.length) {
    improvements.push('Expanded headline to include key value propositions');
  }

  if (techSkills.length > 0) {
    improvements.push(`Added ${techSkills.length} high-demand technical skills`);
  }

  if (optimized !== currentHeadline) {
    improvements.push('Restructured for better recruiter keyword matching');
  }

  return {
    original: currentHeadline,
    optimized,
    improvements,
    keywordsAdded,
  };
}

/**
 * Extract specializations from profile
 */
function extractSpecializations(profile: LinkedInProfile, keywords: string[]): string[] {
  const specializations: string[] = [];

  // Check for full-stack
  const hasFullStack = profile.skills.some(s =>
    s.toLowerCase().includes('full stack') ||
    s.toLowerCase().includes('fullstack')
  );

  if (hasFullStack || (keywords.includes('React') && keywords.includes('Node.js'))) {
    specializations.push('Full-Stack Development');
  }

  // Check for cloud expertise
  const cloudSkills = ['AWS', 'Azure', 'GCP', 'Cloud'].filter(cloud =>
    keywords.includes(cloud) || profile.skills.some(s => s.includes(cloud))
  );

  if (cloudSkills.length > 0) {
    specializations.push('Cloud Architecture');
  }

  // Check for AI/ML
  const aiSkills = ['Machine Learning', 'AI', 'TensorFlow', 'PyTorch'].filter(ai =>
    keywords.includes(ai) || profile.skills.some(s => s.includes(ai))
  );

  if (aiSkills.length > 0) {
    specializations.push('AI/ML');
  }

  // Check for data
  const dataSkills = ['Data', 'Analytics', 'SQL', 'Python'].filter(data =>
    keywords.includes(data) || profile.skills.some(s => s.toLowerCase().includes(data.toLowerCase()))
  );

  if (dataSkills.length >= 2) {
    specializations.push('Data Engineering');
  }

  return specializations;
}

/**
 * Generate optimized About section
 */
export function optimizeAbout(
  currentAbout: string,
  targetRole: string,
  keywordAnalysis: KeywordAnalysis,
  profile: LinkedInProfile
): OptimizedSection {
  const improvements: string[] = [];
  const keywordsAdded: string[] = [];

  // Build About section structure
  const sections: string[] = [];

  // 1. Opening hook (who you are + value prop)
  const yearsExp = calculateYearsOfExperience(profile);
  const topSkills = keywordAnalysis.keywordGaps
    .filter(gap => gap.importance === 'high')
    .slice(0, 3)
    .map(gap => gap.keyword);

  const opening = `${targetRole} with ${yearsExp}+ years of experience specializing in ${topSkills.slice(0, 2).join(' and ')}. I build scalable solutions that drive business impact through innovative technology and cross-functional collaboration.`;
  sections.push(opening);
  keywordsAdded.push(...topSkills.slice(0, 2));

  // 2. Core competencies paragraph
  const competencies = buildCompetencies(profile, keywordAnalysis);
  if (competencies.length > 0) {
    sections.push(`\n\n🔧 Core Competencies:\n${competencies.join(' • ')}`);
    keywordsAdded.push(...competencies.slice(0, 5));
  }

  // 3. Impact/achievements paragraph
  const achievements = extractTopAchievements(profile);
  if (achievements.length > 0) {
    sections.push(`\n\n📈 Recent Impact:\n${achievements.map(a => `• ${a}`).join('\n')}`);
  }

  // 4. Technologies paragraph
  const technologies = extractTechnologies(profile, keywordAnalysis);
  if (technologies.length > 0) {
    sections.push(`\n\n💻 Technologies & Tools:\n${technologies.join(' • ')}`);
    keywordsAdded.push(...technologies.slice(0, 8));
  }

  // 5. Call to action
  const cta = `\n\nI'm passionate about leveraging technology to solve complex problems and drive innovation. Let's connect if you're looking for someone who can bring technical expertise and strategic thinking to your team.`;
  sections.push(cta);

  const optimized = sections.join('');

  // Track improvements
  improvements.push('Added structured sections for better readability');
  improvements.push(`Incorporated ${keywordsAdded.length} high-value keywords`);

  if (achievements.length > 0) {
    improvements.push('Highlighted quantifiable achievements for credibility');
  }

  if (technologies.length > 0) {
    improvements.push('Listed specific technologies for recruiter keyword matching');
  }

  return {
    original: currentAbout,
    optimized,
    improvements,
    keywordsAdded,
  };
}

/**
 * Calculate years of experience from profile
 */
function calculateYearsOfExperience(profile: LinkedInProfile): number {
  // Simple heuristic: count experience items (assuming ~2-3 years each)
  const experienceCount = profile.experience.length;

  // Look for year patterns in duration strings
  let totalYears = 0;
  profile.experience.forEach(exp => {
    const yearMatch = exp.duration.match(/(\d+)\s*(?:yr|year)/i);
    if (yearMatch) {
      totalYears += parseInt(yearMatch[1]);
    } else {
      totalYears += 2; // Default estimate
    }
  });

  return Math.max(totalYears, experienceCount * 2, 3); // Minimum 3 years
}

/**
 * Build core competencies list
 */
function buildCompetencies(profile: LinkedInProfile, keywordAnalysis: KeywordAnalysis): string[] {
  const competencies: Set<string> = new Set();

  // Add high-importance missing keywords
  keywordAnalysis.keywordGaps
    .filter(gap => gap.importance === 'high')
    .slice(0, 8)
    .forEach(gap => competencies.add(gap.keyword));

  // Add existing skills that are valuable
  profile.skills.slice(0, 10).forEach(skill => competencies.add(skill));

  return Array.from(competencies).slice(0, 12);
}

/**
 * Extract top achievements from experience
 */
function extractTopAchievements(profile: LinkedInProfile): string[] {
  const achievements: string[] = [];

  profile.experience.forEach(exp => {
    // Look for bullets or sentences with numbers/metrics
    const bullets = exp.bullets || exp.description.split(/[.•\-\n]/).filter(b => b.trim());

    bullets.forEach(bullet => {
      // Check if bullet contains metrics
      if (/\d+%|\d+x|\$\d+|reduced|increased|improved|grew/i.test(bullet)) {
        achievements.push(bullet.trim());
      }
    });
  });

  // Return top 3 most impactful
  return achievements.slice(0, 3);
}

/**
 * Extract technologies from profile and keywords
 */
function extractTechnologies(profile: LinkedInProfile, keywordAnalysis: KeywordAnalysis): string[] {
  const technologies: Set<string> = new Set();

  // Add from skills
  profile.skills.forEach(skill => {
    if (isTechnicalSkill(skill)) {
      technologies.add(skill);
    }
  });

  // Add from missing high-priority keywords that are technical
  keywordAnalysis.keywordGaps
    .filter(gap => gap.importance === 'high' && isTechnicalSkill(gap.keyword))
    .forEach(gap => technologies.add(gap.keyword));

  return Array.from(technologies).slice(0, 12);
}

/**
 * Check if skill is technical
 */
function isTechnicalSkill(skill: string): boolean {
  const technicalTerms = [
    'JavaScript', 'Python', 'Java', 'React', 'Node', 'AWS', 'Azure', 'GCP', 'Docker',
    'Kubernetes', 'SQL', 'MongoDB', 'TypeScript', 'Git', 'CI/CD', 'REST', 'GraphQL',
    'TensorFlow', 'PyTorch', 'Django', 'Flask', 'Spring', 'Angular', 'Vue',
  ];

  return technicalTerms.some(term => skill.toLowerCase().includes(term.toLowerCase()));
}

/**
 * Optimize experience bullets with impact-based language
 */
export function optimizeExperienceBullets(
  bullets: string[],
  keywordAnalysis: KeywordAnalysis
): OptimizedBullet[] {
  return bullets.map(bullet => optimizeBullet(bullet, keywordAnalysis));
}

/**
 * Optimize a single experience bullet
 */
function optimizeBullet(original: string, keywordAnalysis: KeywordAnalysis): OptimizedBullet {
  // Extract action, context, and result
  const actionVerbs = [
    'Developed', 'Built', 'Led', 'Designed', 'Implemented', 'Architected', 'Optimized',
    'Improved', 'Reduced', 'Increased', 'Launched', 'Managed', 'Coordinated', 'Delivered',
    'Created', 'Established', 'Drove', 'Spearheaded', 'Transformed',
  ];

  // Start with strong action verb
  let action = 'Developed';
  const firstWord = original.trim().split(' ')[0];
  if (actionVerbs.some(verb => firstWord.toLowerCase().includes(verb.toLowerCase()))) {
    action = firstWord;
  }

  // Extract or add metrics
  const metricMatch = original.match(/(\d+%|\d+x|\$[\d,]+|\d+\s*(?:users|customers|teams))/i);
  const impact = metricMatch ? metricMatch[0] : 'measurable impact';

  // Add relevant keywords
  const relevantKeywords = keywordAnalysis.keywordGaps
    .filter(gap => gap.importance === 'high')
    .slice(0, 2)
    .map(gap => gap.keyword);

  // Build optimized version
  let optimized = original;

  // Ensure it starts with action verb
  if (!actionVerbs.some(verb => optimized.startsWith(verb))) {
    optimized = `${action} ${optimized}`;
  }

  // Add keywords if missing and relevant
  relevantKeywords.forEach(keyword => {
    if (!optimized.toLowerCase().includes(keyword.toLowerCase())) {
      optimized = optimized.replace(
        /(\.|$)/,
        ` using ${keyword}$1`
      );
    }
  });

  // Ensure there's a metric
  if (!metricMatch && !optimized.includes('%') && !optimized.includes('increase')) {
    optimized = optimized.replace(
      /(\.|$)/,
      ', improving team efficiency by 20%$1'
    );
  }

  return {
    original,
    optimized,
    impact: impact,
    action: action,
  };
}

/**
 * Generate headline examples for inspiration
 */
export function generateHeadlineExamples(targetRole: string): string[] {
  const examples: Record<string, string[]> = {
    'Software Engineer': [
      'Software Engineer | Full-Stack Development | React, Node.js, AWS | Building Scalable Web Applications',
      'Senior Software Engineer | Cloud Architecture & Microservices | Driving Innovation Through Technology',
      'Software Engineer | Python & JavaScript Expert | AI/ML Integration | 10+ Products Launched',
    ],
    'Product Manager': [
      'Product Manager | SaaS & B2B | Data-Driven Decision Making | Growing Products from 0 to 1M Users',
      'Senior Product Manager | AI/ML Products | Cross-Functional Leadership | Ex-Google, Meta',
      'Product Manager | E-commerce & Mobile | User-Centric Design | $50M+ Revenue Impact',
    ],
    'Data Scientist': [
      'Data Scientist | Machine Learning & AI | Python, TensorFlow, SQL | Turning Data into Business Value',
      'Senior Data Scientist | Predictive Analytics | NLP & Computer Vision | PhD in Statistics',
      'Data Scientist | A/B Testing & Experimentation | Building ML Models at Scale',
    ],
    'default': [
      `${targetRole} | Technical Leadership | Building High-Performing Teams`,
      `${targetRole} | Innovation & Strategy | Driving Business Impact Through Technology`,
      `Senior ${targetRole} | Cross-Functional Collaboration | Delivering Results at Scale`,
    ],
  };

  return examples[targetRole] || examples['default'];
}

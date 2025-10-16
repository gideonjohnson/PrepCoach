// LinkedIn Profile Optimizer - Skills Recommendation Engine

import { LinkedInProfile, SkillRecommendation, KeywordAnalysis } from './types';

/**
 * Generate prioritized skill recommendations based on target jobs
 */
export function generateSkillRecommendations(
  profile: LinkedInProfile,
  keywordAnalysis: KeywordAnalysis,
  targetRole: string
): SkillRecommendation[] {
  const recommendations: SkillRecommendation[] = [];
  const existingSkills = new Set(profile.skills.map(s => s.toLowerCase()));

  // Get job frequency for each keyword
  const totalJobs = keywordAnalysis.keywordGaps.reduce((max, gap) =>
    Math.max(max, gap.foundInJobs), 1
  );

  // Process high-priority gaps
  keywordAnalysis.keywordGaps
    .filter(gap => gap.importance === 'high' && !existingSkills.has(gap.keyword.toLowerCase()))
    .forEach(gap => {
      const demandPercentage = Math.round((gap.foundInJobs / totalJobs) * 100);

      recommendations.push({
        skill: gap.keyword,
        priority: 'essential',
        reason: `Required by ${gap.foundInJobs} of your target jobs. Critical for recruiter searches.`,
        inDemand: demandPercentage,
      });
    });

  // Process medium-priority gaps
  keywordAnalysis.keywordGaps
    .filter(gap => gap.importance === 'medium' && !existingSkills.has(gap.keyword.toLowerCase()))
    .forEach(gap => {
      const demandPercentage = Math.round((gap.foundInJobs / totalJobs) * 100);

      recommendations.push({
        skill: gap.keyword,
        priority: 'recommended',
        reason: `Mentioned in ${gap.foundInJobs} target jobs. Adds competitiveness to your profile.`,
        inDemand: demandPercentage,
      });
    });

  // Add role-specific recommended skills
  const roleSkills = getRoleSpecificSkills(targetRole);
  roleSkills.forEach(skill => {
    if (!existingSkills.has(skill.toLowerCase()) &&
        !recommendations.some(r => r.skill.toLowerCase() === skill.toLowerCase())) {
      recommendations.push({
        skill,
        priority: 'recommended',
        reason: `Commonly expected for ${targetRole} roles. Strengthens your profile.`,
        inDemand: 60,
      });
    }
  });

  // Add trending/emerging skills
  const emergingSkills = getEmergingSkills(targetRole);
  emergingSkills.forEach(skill => {
    if (!existingSkills.has(skill.toLowerCase()) &&
        !recommendations.some(r => r.skill.toLowerCase() === skill.toLowerCase())) {
      recommendations.push({
        skill,
        priority: 'nice-to-have',
        reason: `Emerging skill with growing demand. Shows you stay current with industry trends.`,
        inDemand: 40,
      });
    }
  });

  // Sort by priority and demand
  const priorityOrder = { essential: 3, recommended: 2, 'nice-to-have': 1 };
  recommendations.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.inDemand - a.inDemand;
  });

  return recommendations.slice(0, 20); // Top 20 recommendations
}

/**
 * Get role-specific skills that are commonly expected
 */
function getRoleSpecificSkills(targetRole: string): string[] {
  const roleLower = targetRole.toLowerCase();

  const roleSkillsMap: Record<string, string[]> = {
    'software engineer': [
      'Git', 'Agile', 'REST API', 'Testing', 'CI/CD', 'Code Review',
      'Problem Solving', 'System Design', 'Debugging',
    ],
    'full stack': [
      'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'REST API',
      'Git', 'Docker', 'AWS', 'TypeScript',
    ],
    'frontend': [
      'React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Responsive Design',
      'Webpack', 'Redux', 'Testing', 'UI/UX',
    ],
    'backend': [
      'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'REST API', 'GraphQL',
      'Docker', 'Kubernetes', 'Microservices', 'AWS',
    ],
    'data scientist': [
      'Python', 'SQL', 'Machine Learning', 'Statistics', 'TensorFlow', 'PyTorch',
      'Pandas', 'NumPy', 'Data Visualization', 'A/B Testing',
    ],
    'data engineer': [
      'Python', 'SQL', 'ETL', 'Apache Spark', 'Airflow', 'AWS', 'Data Warehousing',
      'BigQuery', 'Snowflake', 'Data Modeling',
    ],
    'product manager': [
      'Product Strategy', 'Roadmap Planning', 'Agile', 'Stakeholder Management',
      'Data Analysis', 'User Research', 'A/B Testing', 'SQL', 'Jira', 'Figma',
    ],
    'devops': [
      'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Ansible',
      'Linux', 'Monitoring', 'Infrastructure as Code',
    ],
    'mobile': [
      'React Native', 'Swift', 'Kotlin', 'iOS', 'Android', 'Mobile UI/UX',
      'REST API', 'Git', 'App Store Deployment',
    ],
  };

  // Find matching role
  for (const [role, skills] of Object.entries(roleSkillsMap)) {
    if (roleLower.includes(role)) {
      return skills;
    }
  }

  // Default for generic engineering roles
  return roleSkillsMap['software engineer'];
}

/**
 * Get emerging/trending skills for a role
 */
function getEmergingSkills(targetRole: string): string[] {
  const roleLower = targetRole.toLowerCase();

  const emergingSkillsMap: Record<string, string[]> = {
    'software engineer': [
      'AI/ML', 'GraphQL', 'Rust', 'WebAssembly', 'Edge Computing',
    ],
    'data': [
      'MLOps', 'Feature Stores', 'LLMs', 'Vector Databases', 'Real-time Analytics',
    ],
    'frontend': [
      'Next.js', 'Server Components', 'Tailwind CSS', 'Web3', 'WebGL',
    ],
    'backend': [
      'gRPC', 'Serverless', 'Event-Driven Architecture', 'GraphQL', 'Redis',
    ],
    'product': [
      'AI Product Strategy', 'Growth Analytics', 'Product-Led Growth', 'Mixpanel',
    ],
  };

  for (const [role, skills] of Object.entries(emergingSkillsMap)) {
    if (roleLower.includes(role)) {
      return skills;
    }
  }

  return emergingSkillsMap['software engineer'];
}

/**
 * Reorder existing skills for maximum impact
 */
export function optimizeSkillsOrder(
  currentSkills: string[],
  keywordAnalysis: KeywordAnalysis,
  targetRole: string
): {
  reorderedSkills: string[];
  reasoning: string[];
} {
  const reasoning: string[] = [];

  // Create scoring for each skill
  const skillScores = currentSkills.map(skill => {
    let score = 0;
    const reasons: string[] = [];

    // Check if it's in present keywords (high value)
    if (keywordAnalysis.presentKeywords.some(k => k.toLowerCase() === skill.toLowerCase())) {
      score += 100;
      reasons.push('Matches target job requirements');
    }

    // Check if it's a core skill for the role
    const roleSkills = getRoleSpecificSkills(targetRole);
    if (roleSkills.some(rs => rs.toLowerCase() === skill.toLowerCase())) {
      score += 50;
      reasons.push('Core skill for your target role');
    }

    // Check if it's technical (technical skills rank higher)
    if (isTechnicalSkill(skill)) {
      score += 30;
      reasons.push('High-value technical skill');
    }

    // Check if it's emerging
    const emergingSkills = getEmergingSkills(targetRole);
    if (emergingSkills.some(es => es.toLowerCase() === skill.toLowerCase())) {
      score += 20;
      reasons.push('Trending/emerging skill');
    }

    return { skill, score, reasons };
  });

  // Sort by score
  const sorted = skillScores.sort((a, b) => b.score - a.score);

  reasoning.push(
    `Reordered skills to prioritize those most relevant to ${targetRole} roles.`,
    `Top skills now match target job requirements for better recruiter visibility.`,
    `Technical and high-demand skills moved to the top 5 positions.`
  );

  return {
    reorderedSkills: sorted.map(s => s.skill),
    reasoning,
  };
}

/**
 * Check if a skill is technical
 */
function isTechnicalSkill(skill: string): boolean {
  const technicalCategories = [
    // Languages
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'Swift', 'Kotlin',
    'Ruby', 'PHP', 'Scala', 'R', 'SQL',

    // Frameworks & Libraries
    'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring', 'Express', '.NET',
    'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',

    // Cloud & Infrastructure
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins',

    // Databases
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'DynamoDB', 'Elasticsearch',

    // Tools & Platforms
    'Git', 'Linux', 'CI/CD', 'REST', 'GraphQL', 'Microservices', 'API',
  ];

  return technicalCategories.some(tech =>
    skill.toLowerCase().includes(tech.toLowerCase())
  );
}

/**
 * Generate skills gap analysis summary
 */
export function generateSkillsGapSummary(
  profile: LinkedInProfile,
  recommendations: SkillRecommendation[]
): {
  summary: string;
  essentialCount: number;
  recommendedCount: number;
  niceToHaveCount: number;
  topActions: string[];
} {
  const essential = recommendations.filter(r => r.priority === 'essential');
  const recommended = recommendations.filter(r => r.priority === 'recommended');
  const niceToHave = recommendations.filter(r => r.priority === 'nice-to-have');

  const topActions: string[] = [];

  if (essential.length > 0) {
    topActions.push(
      `🎯 Add ${essential.length} essential skills: ${essential.slice(0, 3).map(r => r.skill).join(', ')}`
    );
  }

  if (recommended.length > 0) {
    topActions.push(
      `⭐ Consider ${recommended.length} recommended skills to strengthen your profile`
    );
  }

  if (profile.skills.length < 10) {
    topActions.push(
      `📝 Add more skills to your profile (currently ${profile.skills.length}, aim for 15-20)`
    );
  }

  topActions.push(
    `🔄 Reorder your skills list to put the most relevant ones first`
  );

  let summary = '';
  if (essential.length > 5) {
    summary = `Your profile is missing ${essential.length} essential skills that appear in most target jobs. Prioritize adding these to improve recruiter visibility.`;
  } else if (essential.length > 0) {
    summary = `You're close! Add ${essential.length} more essential skills to fully align with your target roles.`;
  } else {
    summary = `Great job! Your skills align well with target roles. Focus on skill ordering and adding emerging skills to stay competitive.`;
  }

  return {
    summary,
    essentialCount: essential.length,
    recommendedCount: recommended.length,
    niceToHaveCount: niceToHave.length,
    topActions,
  };
}

/**
 * Generate endorsement strategy recommendations
 */
export function generateEndorsementStrategy(
  topSkills: string[]
): {
  skillsToRequest: string[];
  strategy: string[];
} {
  const strategy = [
    `Request endorsements for your top 5 skills: ${topSkills.slice(0, 5).join(', ')}`,
    'Prioritize endorsements from managers and senior colleagues for credibility',
    'Endorse others first - they often reciprocate within days',
    'Focus on quality over quantity - 5-10 endorsements from credible sources > 50 from anyone',
    'Request specific endorsements in thank-you messages after projects',
  ];

  return {
    skillsToRequest: topSkills.slice(0, 5),
    strategy,
  };
}

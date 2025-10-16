// Career Roadmap Planner - Learning Path Generator

import { LearningPath, LearningResource, SkillGap, UserProfile } from './types';

/**
 * Generate personalized learning paths based on skill gaps
 */
export function generateLearningPaths(
  skillGaps: SkillGap[],
  userProfile: UserProfile
): LearningPath[] {
  const paths: LearningPath[] = [];

  // Group gaps by category and priority
  const criticalGaps = skillGaps.filter(g => g.priority === 'critical');
  const highGaps = skillGaps.filter(g => g.priority === 'high');
  const mediumGaps = skillGaps.filter(g => g.priority === 'medium');

  // Path 1: Critical Skills Foundation
  if (criticalGaps.length > 0) {
    paths.push(createCriticalSkillsPath(criticalGaps, userProfile));
  }

  // Path 2: Technical Depth (if there are technical gaps)
  const technicalGaps = skillGaps.filter(g => g.category === 'technical' && g.priority !== 'low');
  if (technicalGaps.length > 0) {
    paths.push(createTechnicalPath(technicalGaps, userProfile));
  }

  // Path 3: Leadership & Soft Skills (if applicable)
  const leadershipGaps = skillGaps.filter(g =>
    (g.category === 'leadership' || g.category === 'soft') && g.priority !== 'low'
  );
  if (leadershipGaps.length > 0) {
    paths.push(createLeadershipPath(leadershipGaps, userProfile));
  }

  // Path 4: Domain Expertise
  const domainGaps = skillGaps.filter(g => g.category === 'domain' && g.priority !== 'low');
  if (domainGaps.length > 0) {
    paths.push(createDomainPath(domainGaps, userProfile));
  }

  // Path 5: Quick Wins (medium priority, easier skills)
  const quickWinGaps = mediumGaps.filter(g => g.difficulty === 'easy' || g.difficulty === 'moderate');
  if (quickWinGaps.length > 0) {
    paths.push(createQuickWinsPath(quickWinGaps, userProfile));
  }

  return paths;
}

/**
 * Create path for critical skills
 */
function createCriticalSkillsPath(gaps: SkillGap[], userProfile: UserProfile): LearningPath {
  const targetSkills = gaps.map(g => g.skill);
  const resources: LearningResource[] = [];

  gaps.forEach(gap => {
    resources.push(...getResourcesForSkill(gap, userProfile, 'priority'));
  });

  return {
    pathId: 'critical-skills',
    title: 'Critical Skills Foundation',
    description: 'Master the essential skills required for your target role. These are non-negotiable requirements that most employers expect.',
    targetSkills,
    duration: estimatePathDuration(gaps),
    difficulty: determineDifficulty(gaps),
    resources: resources.slice(0, 15),
    estimatedCost: calculateTotalCost(resources.slice(0, 15)),
    prerequisites: [],
    order: 1,
  };
}

/**
 * Create technical skills path
 */
function createTechnicalPath(gaps: SkillGap[], userProfile: UserProfile): LearningPath {
  const targetSkills = gaps.map(g => g.skill);
  const resources: LearningResource[] = [];

  gaps.forEach(gap => {
    resources.push(...getResourcesForSkill(gap, userProfile, 'technical'));
  });

  return {
    pathId: 'technical-depth',
    title: 'Technical Skills Development',
    description: 'Build deep technical expertise through hands-on courses, projects, and practice. Focus on practical application and portfolio building.',
    targetSkills,
    duration: estimatePathDuration(gaps),
    difficulty: determineDifficulty(gaps),
    resources: resources.slice(0, 20),
    estimatedCost: calculateTotalCost(resources.slice(0, 20)),
    prerequisites: ['Basic programming knowledge', 'Development environment setup'],
    order: 2,
  };
}

/**
 * Create leadership path
 */
function createLeadershipPath(gaps: SkillGap[], userProfile: UserProfile): LearningPath {
  const targetSkills = gaps.map(g => g.skill);
  const resources: LearningResource[] = [];

  gaps.forEach(gap => {
    resources.push(...getResourcesForSkill(gap, userProfile, 'leadership'));
  });

  return {
    pathId: 'leadership-soft-skills',
    title: 'Leadership & Communication',
    description: 'Develop leadership capabilities and soft skills through courses, mentorship, and real-world practice.',
    targetSkills,
    duration: estimatePathDuration(gaps),
    difficulty: 'intermediate',
    resources: resources.slice(0, 12),
    estimatedCost: calculateTotalCost(resources.slice(0, 12)),
    prerequisites: ['Willingness to seek feedback', 'Practice opportunities'],
    order: 3,
  };
}

/**
 * Create domain expertise path
 */
function createDomainPath(gaps: SkillGap[], userProfile: UserProfile): LearningPath {
  const targetSkills = gaps.map(g => g.skill);
  const resources: LearningResource[] = [];

  gaps.forEach(gap => {
    resources.push(...getResourcesForSkill(gap, userProfile, 'domain'));
  });

  return {
    pathId: 'domain-expertise',
    title: 'Domain Knowledge & Methodologies',
    description: 'Learn industry-specific knowledge, frameworks, and methodologies relevant to your target role.',
    targetSkills,
    duration: estimatePathDuration(gaps),
    difficulty: 'intermediate',
    resources: resources.slice(0, 10),
    estimatedCost: calculateTotalCost(resources.slice(0, 10)),
    prerequisites: ['Basic industry understanding'],
    order: 4,
  };
}

/**
 * Create quick wins path
 */
function createQuickWinsPath(gaps: SkillGap[], userProfile: UserProfile): LearningPath {
  const targetSkills = gaps.map(g => g.skill);
  const resources: LearningResource[] = [];

  gaps.forEach(gap => {
    resources.push(...getResourcesForSkill(gap, userProfile, 'quickwin'));
  });

  return {
    pathId: 'quick-wins',
    title: 'Quick Wins & Resume Boosters',
    description: 'Rapidly acquire in-demand skills that are easier to learn and will strengthen your profile quickly.',
    targetSkills,
    duration: '1-3 months',
    difficulty: 'beginner',
    resources: resources.slice(0, 8),
    estimatedCost: calculateTotalCost(resources.slice(0, 8)),
    prerequisites: [],
    order: 5,
  };
}

/**
 * Get learning resources for a specific skill
 */
function getResourcesForSkill(
  gap: SkillGap,
  userProfile: UserProfile,
  pathType: 'priority' | 'technical' | 'leadership' | 'domain' | 'quickwin'
): LearningResource[] {
  const skillLower = gap.skill.toLowerCase();
  const resources: LearningResource[] = [];

  // Comprehensive resource database
  const resourceDatabase: Record<string, LearningResource[]> = {
    'javascript/typescript': [
      {
        type: 'course',
        title: 'JavaScript: The Complete Guide',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/',
        duration: '52 hours',
        cost: 15,
        costType: 'one-time',
        rating: 4.6,
        skills: ['JavaScript', 'TypeScript', 'ES6+'],
        description: 'Comprehensive JavaScript course covering fundamentals to advanced concepts',
        difficulty: 'intermediate',
      },
      {
        type: 'practice',
        title: 'JavaScript30',
        provider: 'Wes Bos',
        url: 'https://javascript30.com/',
        duration: '30 days',
        cost: 0,
        costType: 'free',
        rating: 4.8,
        skills: ['JavaScript', 'DOM Manipulation'],
        description: '30 day vanilla JavaScript coding challenge',
        difficulty: 'beginner',
      },
      {
        type: 'project',
        title: 'Build 15 JavaScript Projects',
        provider: 'freeCodeCamp',
        duration: '40 hours',
        cost: 0,
        costType: 'free',
        skills: ['JavaScript'],
        description: 'Hands-on project-based learning',
        difficulty: 'intermediate',
      },
    ],
    'system design': [
      {
        type: 'course',
        title: 'Grokking the System Design Interview',
        provider: 'Educative',
        url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
        duration: '30 hours',
        cost: 79,
        costType: 'subscription',
        rating: 4.7,
        skills: ['System Design', 'Architecture'],
        description: 'Learn how to design scalable systems',
        difficulty: 'advanced',
      },
      {
        type: 'book',
        title: 'Designing Data-Intensive Applications',
        provider: "O'Reilly",
        duration: '60 hours',
        cost: 50,
        costType: 'one-time',
        rating: 4.9,
        skills: ['System Design', 'Distributed Systems'],
        description: 'Deep dive into modern data systems',
        difficulty: 'advanced',
      },
      {
        type: 'practice',
        title: 'System Design Primer',
        provider: 'GitHub',
        url: 'https://github.com/donnemartin/system-design-primer',
        duration: '40 hours',
        cost: 0,
        costType: 'free',
        rating: 4.8,
        skills: ['System Design'],
        description: 'Open-source system design resource',
        difficulty: 'intermediate',
      },
    ],
    'react': [
      {
        type: 'course',
        title: 'React - The Complete Guide',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        duration: '49 hours',
        cost: 15,
        costType: 'one-time',
        rating: 4.6,
        skills: ['React', 'Redux', 'Hooks'],
        description: 'Master React from beginner to advanced',
        difficulty: 'intermediate',
      },
      {
        type: 'documentation',
        title: 'React Official Documentation',
        provider: 'React.dev',
        url: 'https://react.dev',
        duration: '20 hours',
        cost: 0,
        costType: 'free',
        rating: 4.9,
        skills: ['React'],
        description: 'Official React documentation and tutorials',
        difficulty: 'beginner',
      },
      {
        type: 'project',
        title: 'Build 10 React Projects',
        provider: 'YouTube/Traversy',
        duration: '30 hours',
        cost: 0,
        costType: 'free',
        skills: ['React'],
        description: 'Project-based React learning',
        difficulty: 'intermediate',
      },
    ],
    'python': [
      {
        type: 'course',
        title: '100 Days of Code: Python',
        provider: 'Udemy',
        duration: '60 hours',
        cost: 15,
        costType: 'one-time',
        rating: 4.7,
        skills: ['Python'],
        description: 'Complete Python bootcamp',
        difficulty: 'beginner',
      },
      {
        type: 'practice',
        title: 'Python Exercises',
        provider: 'Exercism',
        url: 'https://exercism.org/tracks/python',
        duration: '40 hours',
        cost: 0,
        costType: 'free',
        rating: 4.6,
        skills: ['Python'],
        description: 'Practice Python with mentorship',
        difficulty: 'beginner',
      },
    ],
    'aws': [
      {
        type: 'course',
        title: 'AWS Certified Solutions Architect',
        provider: 'A Cloud Guru',
        duration: '25 hours',
        cost: 39,
        costType: 'subscription',
        rating: 4.7,
        skills: ['AWS', 'Cloud Architecture'],
        description: 'Prepare for AWS certification',
        difficulty: 'intermediate',
      },
      {
        type: 'practice',
        title: 'AWS Free Tier Projects',
        provider: 'AWS',
        url: 'https://aws.amazon.com/free/',
        duration: '30 hours',
        cost: 0,
        costType: 'free',
        skills: ['AWS'],
        description: 'Hands-on AWS practice',
        difficulty: 'beginner',
      },
    ],
    'docker': [
      {
        type: 'course',
        title: 'Docker Mastery',
        provider: 'Udemy',
        duration: '20 hours',
        cost: 15,
        costType: 'one-time',
        rating: 4.7,
        skills: ['Docker', 'Containers'],
        description: 'Complete Docker course',
        difficulty: 'intermediate',
      },
    ],
    'kubernetes': [
      {
        type: 'course',
        title: 'Kubernetes for Developers',
        provider: 'Udemy',
        duration: '15 hours',
        cost: 15,
        costType: 'one-time',
        rating: 4.6,
        skills: ['Kubernetes'],
        description: 'K8s fundamentals and practice',
        difficulty: 'intermediate',
      },
    ],
    'machine learning': [
      {
        type: 'course',
        title: 'Machine Learning Specialization',
        provider: 'Coursera (Andrew Ng)',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction',
        duration: '60 hours',
        cost: 49,
        costType: 'subscription',
        rating: 4.9,
        skills: ['Machine Learning', 'Python'],
        description: 'Industry-leading ML course',
        difficulty: 'intermediate',
      },
      {
        type: 'book',
        title: 'Hands-On Machine Learning',
        provider: "O'Reilly",
        duration: '80 hours',
        cost: 60,
        costType: 'one-time',
        rating: 4.7,
        skills: ['Machine Learning', 'TensorFlow', 'Scikit-learn'],
        description: 'Practical ML with Python',
        difficulty: 'intermediate',
      },
    ],
    'leadership': [
      {
        type: 'course',
        title: 'The Manager\'s Toolkit',
        provider: 'Coursera',
        duration: '20 hours',
        cost: 49,
        costType: 'subscription',
        rating: 4.6,
        skills: ['Leadership', 'Management'],
        description: 'Essential management skills',
        difficulty: 'beginner',
      },
      {
        type: 'book',
        title: 'The Manager\'s Path',
        provider: "O'Reilly",
        duration: '12 hours',
        cost: 35,
        costType: 'one-time',
        rating: 4.8,
        skills: ['Engineering Leadership'],
        description: 'Guide for tech leaders',
        difficulty: 'intermediate',
      },
    ],
    'communication': [
      {
        type: 'course',
        title: 'Improving Communication Skills',
        provider: 'Coursera',
        duration: '15 hours',
        cost: 49,
        costType: 'subscription',
        rating: 4.5,
        skills: ['Communication'],
        description: 'Professional communication',
        difficulty: 'beginner',
      },
      {
        type: 'practice',
        title: 'Toastmasters',
        provider: 'Toastmasters International',
        duration: 'Ongoing',
        cost: 45,
        costType: 'subscription',
        skills: ['Public Speaking', 'Communication'],
        description: 'Practice public speaking',
        difficulty: 'beginner',
      },
    ],
    'agile/scrum': [
      {
        type: 'course',
        title: 'Agile Fundamentals',
        provider: 'Pluralsight',
        duration: '8 hours',
        cost: 29,
        costType: 'subscription',
        rating: 4.5,
        skills: ['Agile', 'Scrum'],
        description: 'Learn Agile methodologies',
        difficulty: 'beginner',
      },
    ],
  };

  // Try to find exact match
  for (const [key, value] of Object.entries(resourceDatabase)) {
    if (skillLower.includes(key) || key.includes(skillLower)) {
      resources.push(...value);
      break;
    }
  }

  // If no exact match, provide general resources
  if (resources.length === 0) {
    resources.push({
      type: 'course',
      title: `Learn ${gap.skill}`,
      provider: 'Udemy/Coursera',
      duration: '20-40 hours',
      cost: 20,
      costType: 'one-time',
      skills: [gap.skill],
      description: `Comprehensive ${gap.skill} course`,
      difficulty: gap.difficulty === 'easy' ? 'beginner' : gap.difficulty === 'advanced' ? 'advanced' : 'intermediate',
    });

    resources.push({
      type: 'practice',
      title: `${gap.skill} Exercises`,
      provider: 'Online platforms',
      duration: '30 hours',
      cost: 0,
      costType: 'free',
      skills: [gap.skill],
      description: `Practice ${gap.skill} with exercises`,
      difficulty: 'beginner',
    });
  }

  // Filter based on user preferences
  return resources.filter(r => {
    if (userProfile.constraints.budget && r.cost > userProfile.constraints.budget / 5) {
      return false;
    }
    return true;
  });
}

/**
 * Estimate total path duration
 */
function estimatePathDuration(gaps: SkillGap[]): string {
  const totalMonths = gaps.reduce((sum, gap) => {
    const timeStr = gap.estimatedTimeToLearn;
    if (timeStr.includes('week')) return sum + 0.5;
    if (timeStr.includes('1-2 months')) return sum + 1.5;
    if (timeStr.includes('2-4 months')) return sum + 3;
    if (timeStr.includes('4-6 months')) return sum + 5;
    if (timeStr.includes('6-9 months')) return sum + 7.5;
    if (timeStr.includes('9-12 months')) return sum + 10.5;
    return sum + 12;
  }, 0);

  if (totalMonths <= 2) return '1-2 months';
  if (totalMonths <= 4) return '2-4 months';
  if (totalMonths <= 6) return '4-6 months';
  if (totalMonths <= 9) return '6-9 months';
  if (totalMonths <= 12) return '9-12 months';
  return '12-18 months';
}

/**
 * Determine overall difficulty
 */
function determineDifficulty(gaps: SkillGap[]): 'beginner' | 'intermediate' | 'advanced' {
  const hasAdvanced = gaps.some(g => g.difficulty === 'advanced');
  const hasChallenging = gaps.some(g => g.difficulty === 'challenging');

  if (hasAdvanced || gaps.length > 5) return 'advanced';
  if (hasChallenging || gaps.length > 3) return 'intermediate';
  return 'beginner';
}

/**
 * Calculate total cost for resources
 */
function calculateTotalCost(resources: LearningResource[]): {
  min: number;
  max: number;
  currency: string;
} {
  let min = 0;
  let max = 0;

  resources.forEach(r => {
    if (r.costType === 'free') {
      // Free resources don't add to cost
    } else if (r.costType === 'subscription') {
      min += r.cost;
      max += r.cost * 3; // Assume 1-3 months
    } else {
      min += r.cost;
      max += r.cost;
    }
  });

  return { min, max, currency: 'USD' };
}

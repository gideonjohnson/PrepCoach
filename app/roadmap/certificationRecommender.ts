// Career Roadmap Planner - Certification Recommender

import { CertificationRecommendation, SkillsGapAnalysis, UserProfile, LearningResource } from './types';

/**
 * Generate certification recommendations based on skills gaps and target role
 */
export function generateCertificationRecommendations(
  skillsGap: SkillsGapAnalysis,
  userProfile: UserProfile,
  targetRole: string
): CertificationRecommendation[] {
  const roleLower = targetRole.toLowerCase();
  const recommendations: CertificationRecommendation[] = [];

  // Get all certifications from database
  const allCertifications = getCertificationDatabase();

  // Filter by role relevance
  allCertifications.forEach(cert => {
    const isRelevant = isCertificationRelevant(cert, targetRole, skillsGap, userProfile);
    if (isRelevant) {
      recommendations.push(cert);
    }
  });

  // Sort by relevance and cost
  recommendations.sort((a, b) => {
    const relevanceOrder = { essential: 4, 'highly-recommended': 3, beneficial: 2, optional: 1 };
    const relevanceDiff = relevanceOrder[b.relevance] - relevanceOrder[a.relevance];
    if (relevanceDiff !== 0) return relevanceDiff;

    // If same relevance, prefer lower cost
    return a.cost - b.cost;
  });

  return recommendations;
}

/**
 * Check if certification is relevant for user
 */
function isCertificationRelevant(
  cert: CertificationRecommendation,
  targetRole: string,
  skillsGap: SkillsGapAnalysis,
  userProfile: UserProfile
): boolean {
  const roleLower = targetRole.toLowerCase();
  const certNameLower = cert.name.toLowerCase();

  // Check if user already has this certification
  if (userProfile.certifications.some(c => c.toLowerCase().includes(certNameLower))) {
    return false;
  }

  // Check if cert skills match gap skills
  const hasMatchingSkills = cert.skills.some(skill =>
    skillsGap.gaps.some(gap => gap.skill.toLowerCase().includes(skill.toLowerCase()))
  );

  if (!hasMatchingSkills && cert.relevance !== 'essential') {
    return false;
  }

  // Role-specific filtering
  if (roleLower.includes('software engineer') || roleLower.includes('developer')) {
    return cert.category === 'technical' || cert.category === 'cloud' || cert.category === 'security';
  }

  if (roleLower.includes('data scientist') || roleLower.includes('ml engineer')) {
    return cert.category === 'data' || cert.category === 'cloud' || cert.category === 'technical';
  }

  if (roleLower.includes('devops') || roleLower.includes('sre')) {
    return cert.category === 'cloud' || cert.category === 'security' || cert.category === 'technical';
  }

  if (roleLower.includes('product manager')) {
    return cert.category === 'project-management' || cert.category === 'general';
  }

  if (roleLower.includes('manager') || roleLower.includes('lead')) {
    return cert.category === 'project-management' || cert.category === 'general';
  }

  return true;
}

/**
 * Comprehensive certification database
 */
function getCertificationDatabase(): CertificationRecommendation[] {
  return [
    // AWS Certifications
    {
      name: 'AWS Certified Solutions Architect - Associate',
      provider: 'Amazon Web Services',
      category: 'cloud',
      relevance: 'highly-recommended',
      cost: 150,
      duration: '2-3 months preparation',
      difficulty: 'associate',
      prerequisites: ['6+ months AWS experience', 'Basic cloud knowledge'],
      skills: ['AWS', 'Cloud Architecture', 'System Design'],
      industryRecognition: 'high',
      examFormat: '130 minutes, 65 questions (multiple choice/multiple response)',
      passingScore: '720/1000',
      renewalRequired: true,
      renewalPeriod: '3 years',
      preparationResources: [
        {
          type: 'course',
          title: 'AWS Solutions Architect Associate Course',
          provider: 'A Cloud Guru',
          url: 'https://acloudguru.com',
          duration: '25 hours',
          cost: 39,
          costType: 'subscription',
          rating: 4.7,
          skills: ['AWS', 'Cloud Architecture'],
          description: 'Complete SAA-C03 exam prep',
          difficulty: 'intermediate',
        },
        {
          type: 'practice',
          title: 'AWS Practice Exams',
          provider: 'Tutorials Dojo',
          duration: '20 hours',
          cost: 15,
          costType: 'one-time',
          rating: 4.8,
          skills: ['AWS'],
          description: 'Practice tests for exam prep',
          difficulty: 'intermediate',
        },
      ],
      benefits: [
        'Validates cloud architecture skills',
        'Highly recognized by employers',
        'Average salary increase of $10-15k',
        'Opens doors to cloud engineering roles',
      ],
      suggestedTimeline: 'Month 4-6',
    },
    {
      name: 'AWS Certified Developer - Associate',
      provider: 'Amazon Web Services',
      category: 'cloud',
      relevance: 'highly-recommended',
      cost: 150,
      duration: '2-3 months preparation',
      difficulty: 'associate',
      prerequisites: ['Programming experience', 'Basic AWS knowledge'],
      skills: ['AWS', 'Lambda', 'DynamoDB', 'API Gateway'],
      industryRecognition: 'high',
      examFormat: '130 minutes, 65 questions',
      passingScore: '720/1000',
      renewalRequired: true,
      renewalPeriod: '3 years',
      preparationResources: [
        {
          type: 'course',
          title: 'AWS Developer Associate Course',
          provider: 'Udemy',
          duration: '28 hours',
          cost: 15,
          costType: 'one-time',
          rating: 4.6,
          skills: ['AWS', 'Serverless'],
          description: 'Complete developer cert prep',
          difficulty: 'intermediate',
        },
      ],
      benefits: [
        'Validates serverless and cloud development',
        'In-demand for modern cloud roles',
        'Demonstrates hands-on AWS experience',
      ],
      suggestedTimeline: 'Month 5-7',
    },
    {
      name: 'AWS Certified DevOps Engineer - Professional',
      provider: 'Amazon Web Services',
      category: 'cloud',
      relevance: 'beneficial',
      cost: 300,
      duration: '3-4 months preparation',
      difficulty: 'professional',
      prerequisites: ['Associate-level AWS cert', '2+ years AWS experience'],
      skills: ['AWS', 'DevOps', 'CI/CD', 'Infrastructure as Code'],
      industryRecognition: 'high',
      examFormat: '180 minutes, 75 questions',
      passingScore: '750/1000',
      renewalRequired: true,
      renewalPeriod: '3 years',
      preparationResources: [
        {
          type: 'course',
          title: 'AWS DevOps Engineer Professional',
          provider: 'A Cloud Guru',
          duration: '40 hours',
          cost: 39,
          costType: 'subscription',
          rating: 4.6,
          skills: ['AWS', 'DevOps'],
          description: 'Professional-level cert prep',
          difficulty: 'advanced',
        },
      ],
      benefits: [
        'Premium certification for senior roles',
        'Significant salary premium ($120k+ average)',
        'Validates expert-level cloud skills',
      ],
      suggestedTimeline: 'Month 10-13',
    },

    // Azure Certifications
    {
      name: 'Microsoft Azure Fundamentals (AZ-900)',
      provider: 'Microsoft',
      category: 'cloud',
      relevance: 'beneficial',
      cost: 99,
      duration: '1-2 months preparation',
      difficulty: 'entry',
      prerequisites: ['Basic cloud concepts'],
      skills: ['Azure', 'Cloud Fundamentals'],
      industryRecognition: 'medium',
      examFormat: '60 minutes, 40-60 questions',
      passingScore: '700/1000',
      renewalRequired: false,
      preparationResources: [
        {
          type: 'course',
          title: 'AZ-900 Microsoft Azure Fundamentals',
          provider: 'Microsoft Learn',
          duration: '12 hours',
          cost: 0,
          costType: 'free',
          rating: 4.5,
          skills: ['Azure'],
          description: 'Official Microsoft training',
          difficulty: 'beginner',
        },
      ],
      benefits: [
        'Entry point to Azure ecosystem',
        'Good for cloud beginners',
        'No renewal required',
      ],
      suggestedTimeline: 'Month 2-3',
    },
    {
      name: 'Microsoft Azure Developer Associate (AZ-204)',
      provider: 'Microsoft',
      category: 'cloud',
      relevance: 'highly-recommended',
      cost: 165,
      duration: '2-3 months preparation',
      difficulty: 'associate',
      prerequisites: ['1+ year Azure development', 'Programming experience'],
      skills: ['Azure', 'Cloud Development', 'APIs'],
      industryRecognition: 'high',
      examFormat: '150 minutes, 40-60 questions',
      passingScore: '700/1000',
      renewalRequired: true,
      renewalPeriod: '1 year',
      preparationResources: [
        {
          type: 'course',
          title: 'AZ-204 Developing Solutions for Azure',
          provider: 'Pluralsight',
          duration: '30 hours',
          cost: 29,
          costType: 'subscription',
          rating: 4.5,
          skills: ['Azure'],
          description: 'Complete AZ-204 prep',
          difficulty: 'intermediate',
        },
      ],
      benefits: [
        'Validates Azure development skills',
        'Required by many enterprise employers',
        'Strong market demand',
      ],
      suggestedTimeline: 'Month 6-8',
    },

    // Kubernetes Certifications
    {
      name: 'Certified Kubernetes Application Developer (CKAD)',
      provider: 'Cloud Native Computing Foundation',
      category: 'cloud',
      relevance: 'highly-recommended',
      cost: 395,
      duration: '2-3 months preparation',
      difficulty: 'associate',
      prerequisites: ['Kubernetes basics', 'Container knowledge'],
      skills: ['Kubernetes', 'Docker', 'Container Orchestration'],
      industryRecognition: 'high',
      examFormat: '2 hours, performance-based (hands-on)',
      passingScore: '66%',
      renewalRequired: true,
      renewalPeriod: '3 years',
      preparationResources: [
        {
          type: 'course',
          title: 'CKAD Course',
          provider: 'KodeKloud',
          duration: '15 hours',
          cost: 30,
          costType: 'one-time',
          rating: 4.8,
          skills: ['Kubernetes'],
          description: 'Hands-on CKAD prep',
          difficulty: 'intermediate',
        },
      ],
      benefits: [
        'Hands-on, performance-based exam',
        'Highly valued in cloud-native companies',
        'Validates practical K8s skills',
      ],
      suggestedTimeline: 'Month 7-9',
    },
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      provider: 'Cloud Native Computing Foundation',
      category: 'cloud',
      relevance: 'beneficial',
      cost: 395,
      duration: '3-4 months preparation',
      difficulty: 'professional',
      prerequisites: ['CKAD or equivalent', 'Strong K8s experience'],
      skills: ['Kubernetes', 'Cluster Administration', 'DevOps'],
      industryRecognition: 'high',
      examFormat: '2 hours, performance-based',
      passingScore: '66%',
      renewalRequired: true,
      renewalPeriod: '3 years',
      preparationResources: [
        {
          type: 'course',
          title: 'CKA Course',
          provider: 'KodeKloud',
          duration: '20 hours',
          cost: 30,
          costType: 'one-time',
          rating: 4.7,
          skills: ['Kubernetes'],
          description: 'Complete CKA prep',
          difficulty: 'advanced',
        },
      ],
      benefits: [
        'Industry gold standard for K8s',
        'Required for senior DevOps roles',
        'Significant salary boost',
      ],
      suggestedTimeline: 'Month 11-14',
    },

    // Product Management
    {
      name: 'Certified Scrum Product Owner (CSPO)',
      provider: 'Scrum Alliance',
      category: 'project-management',
      relevance: 'highly-recommended',
      cost: 1000,
      duration: '2 day workshop + self-study',
      difficulty: 'entry',
      prerequisites: ['None'],
      skills: ['Agile', 'Scrum', 'Product Management'],
      industryRecognition: 'high',
      examFormat: 'Workshop-based certification',
      renewalRequired: true,
      renewalPeriod: '2 years',
      preparationResources: [
        {
          type: 'course',
          title: 'CSPO Training',
          provider: 'Scrum Alliance',
          duration: '16 hours',
          cost: 1000,
          costType: 'one-time',
          rating: 4.5,
          skills: ['Scrum', 'Product Management'],
          description: 'Official CSPO workshop',
          difficulty: 'beginner',
        },
      ],
      benefits: [
        'Essential for Product Manager roles',
        'Widely recognized certification',
        'Teaches Agile best practices',
      ],
      suggestedTimeline: 'Month 3-5',
    },
    {
      name: 'Product School Product Manager Certification',
      provider: 'Product School',
      category: 'project-management',
      relevance: 'beneficial',
      cost: 4999,
      duration: '8 weeks',
      difficulty: 'associate',
      prerequisites: ['Interest in product management'],
      skills: ['Product Strategy', 'User Research', 'Roadmapping'],
      industryRecognition: 'medium',
      examFormat: 'Course completion + final project',
      renewalRequired: false,
      preparationResources: [
        {
          type: 'bootcamp',
          title: 'Product Manager Certification',
          provider: 'Product School',
          duration: '8 weeks',
          cost: 4999,
          costType: 'one-time',
          rating: 4.4,
          skills: ['Product Management'],
          description: 'Intensive PM bootcamp',
          difficulty: 'intermediate',
        },
      ],
      benefits: [
        'Comprehensive PM curriculum',
        'Career support included',
        'Strong network of alumni',
      ],
      suggestedTimeline: 'Month 4-6',
    },

    // Data & Analytics
    {
      name: 'Google Data Analytics Professional Certificate',
      provider: 'Google (Coursera)',
      category: 'data',
      relevance: 'highly-recommended',
      cost: 39,
      duration: '6 months (10 hours/week)',
      difficulty: 'entry',
      prerequisites: ['None'],
      skills: ['Data Analysis', 'SQL', 'Tableau', 'R'],
      industryRecognition: 'medium',
      examFormat: 'Course completion',
      renewalRequired: false,
      preparationResources: [
        {
          type: 'course',
          title: 'Google Data Analytics',
          provider: 'Coursera',
          duration: '180 hours',
          cost: 39,
          costType: 'subscription',
          rating: 4.8,
          skills: ['Data Analysis'],
          description: 'Complete data analytics program',
          difficulty: 'beginner',
        },
      ],
      benefits: [
        'Beginner-friendly entry to data',
        'Google brand recognition',
        'Includes hands-on projects',
      ],
      suggestedTimeline: 'Month 1-6',
    },
    {
      name: 'AWS Certified Machine Learning - Specialty',
      provider: 'Amazon Web Services',
      category: 'data',
      relevance: 'beneficial',
      cost: 300,
      duration: '3-4 months preparation',
      difficulty: 'professional',
      prerequisites: ['2+ years ML experience', 'AWS knowledge'],
      skills: ['Machine Learning', 'AWS', 'Deep Learning'],
      industryRecognition: 'high',
      examFormat: '180 minutes, 65 questions',
      passingScore: '750/1000',
      renewalRequired: true,
      renewalPeriod: '3 years',
      preparationResources: [
        {
          type: 'course',
          title: 'AWS ML Specialty Course',
          provider: 'A Cloud Guru',
          duration: '35 hours',
          cost: 39,
          costType: 'subscription',
          rating: 4.5,
          skills: ['ML', 'AWS'],
          description: 'ML specialty exam prep',
          difficulty: 'advanced',
        },
      ],
      benefits: [
        'Premium ML certification',
        'High demand in AI/ML roles',
        'Significant salary premium',
      ],
      suggestedTimeline: 'Month 10-14',
    },

    // Security
    {
      name: 'CompTIA Security+',
      provider: 'CompTIA',
      category: 'security',
      relevance: 'beneficial',
      cost: 392,
      duration: '2-3 months preparation',
      difficulty: 'entry',
      prerequisites: ['Network+ or equivalent knowledge'],
      skills: ['Security', 'Network Security', 'Risk Management'],
      industryRecognition: 'high',
      examFormat: '90 minutes, 90 questions',
      passingScore: '750/900',
      renewalRequired: true,
      renewalPeriod: '3 years',
      preparationResources: [
        {
          type: 'course',
          title: 'Security+ Training',
          provider: 'Professor Messer',
          duration: '30 hours',
          cost: 0,
          costType: 'free',
          rating: 4.7,
          skills: ['Security'],
          description: 'Free Security+ prep',
          difficulty: 'beginner',
        },
      ],
      benefits: [
        'Foundation for security careers',
        'DoD approved certification',
        'Opens security-focused roles',
      ],
      suggestedTimeline: 'Month 5-7',
    },

    // General/Scrum
    {
      name: 'Certified ScrumMaster (CSM)',
      provider: 'Scrum Alliance',
      category: 'project-management',
      relevance: 'beneficial',
      cost: 1000,
      duration: '2 day workshop',
      difficulty: 'entry',
      prerequisites: ['None'],
      skills: ['Scrum', 'Agile', 'Team Facilitation'],
      industryRecognition: 'high',
      examFormat: 'Workshop + online exam (50 questions)',
      passingScore: '74%',
      renewalRequired: true,
      renewalPeriod: '2 years',
      preparationResources: [
        {
          type: 'course',
          title: 'CSM Workshop',
          provider: 'Scrum Alliance',
          duration: '16 hours',
          cost: 1000,
          costType: 'one-time',
          rating: 4.6,
          skills: ['Scrum'],
          description: 'Official CSM workshop',
          difficulty: 'beginner',
        },
      ],
      benefits: [
        'Standard for Agile teams',
        'Valuable for engineering leaders',
        'High industry recognition',
      ],
      suggestedTimeline: 'Month 4-6',
    },
  ];
}

/**
 * Get certification preparation tips
 */
export function getCertificationPreparationTips(cert: CertificationRecommendation): string[] {
  const tips: string[] = [];

  // Difficulty-based tips
  if (cert.difficulty === 'entry') {
    tips.push('Great starting point - most people pass on first attempt with 1-2 months study');
    tips.push('Focus on understanding core concepts rather than memorization');
  } else if (cert.difficulty === 'associate') {
    tips.push('Plan for 2-3 months of dedicated study (10-15 hours/week)');
    tips.push('Hands-on practice is critical - use free tier accounts to experiment');
    tips.push('Take practice exams to identify weak areas');
  } else if (cert.difficulty === 'professional') {
    tips.push('Advanced certification - expect 3-4 months preparation');
    tips.push('Real-world experience is essential before attempting');
    tips.push('Consider completing associate-level cert first');
  }

  // Exam format tips
  if (cert.examFormat.includes('performance-based')) {
    tips.push('Hands-on exam - practice in real environments, not just theory');
    tips.push('Time management is critical - practice under time pressure');
  } else {
    tips.push('Multiple choice format - process of elimination helps');
    tips.push('Read questions carefully - often testing edge cases');
  }

  // Cost tips
  if (cert.cost > 300) {
    tips.push('Premium certification - make sure you\'re ready before paying');
    tips.push('Many employers reimburse certification costs - ask your manager');
  }

  // General tips
  tips.push('Join study groups or online communities for support');
  tips.push('Schedule your exam 6-8 weeks out to create accountability');

  return tips.slice(0, 6);
}

/**
 * Calculate ROI for a certification
 */
export function calculateCertificationROI(cert: CertificationRecommendation): {
  estimatedSalaryIncrease: string;
  timeToROI: string;
  careerBenefits: string[];
} {
  let salaryIncrease = 0;

  // Estimate salary increase based on category and difficulty
  if (cert.category === 'cloud') {
    if (cert.difficulty === 'professional') salaryIncrease = 15000;
    else if (cert.difficulty === 'associate') salaryIncrease = 10000;
    else salaryIncrease = 5000;
  } else if (cert.category === 'data') {
    if (cert.difficulty === 'professional') salaryIncrease = 12000;
    else salaryIncrease = 8000;
  } else if (cert.category === 'security') {
    salaryIncrease = 10000;
  } else {
    salaryIncrease = 5000;
  }

  const totalCost = cert.cost + (cert.preparationResources[0]?.cost || 0);
  const monthsToROI = Math.ceil(totalCost / (salaryIncrease / 12));

  return {
    estimatedSalaryIncrease: `$${salaryIncrease.toLocaleString()}+`,
    timeToROI: `${monthsToROI} month${monthsToROI !== 1 ? 's' : ''}`,
    careerBenefits: cert.benefits,
  };
}

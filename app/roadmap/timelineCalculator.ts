// Career Roadmap Planner - Timeline Calculator

import { CareerTimeline, TimelinePhase, SkillsGapAnalysis, UserProfile, Milestone } from './types';

/**
 * Generate realistic career transition timeline
 */
export function generateCareerTimeline(
  skillsGap: SkillsGapAnalysis,
  userProfile: UserProfile,
  targetRole: string
): CareerTimeline {
  const currentDate = new Date().toISOString().split('T')[0];

  // Calculate total duration based on gaps and readiness
  const totalMonths = calculateTotalMonths(skillsGap, userProfile);

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + totalMonths);

  const totalDuration = formatDuration(totalMonths);

  // Generate phases
  const phases = generatePhases(skillsGap, userProfile, totalMonths, targetRole);

  // Generate assumptions
  const assumptions = generateAssumptions(userProfile, totalMonths);

  // Generate accelerators
  const accelerators = generateAccelerators(skillsGap, userProfile);

  // Generate risks
  const risks = generateRisks(skillsGap, userProfile);

  return {
    currentDate,
    targetDate: targetDate.toISOString().split('T')[0],
    totalDuration,
    phases,
    assumptions,
    accelerators,
    risks,
  };
}

/**
 * Calculate total months needed for transition
 */
function calculateTotalMonths(skillsGap: SkillsGapAnalysis, userProfile: UserProfile): number {
  const { readinessLevel, gaps } = skillsGap;

  // Base months by readiness level
  const baseMonths: Record<typeof readinessLevel, number> = {
    ready: 3,
    advanced: 6,
    intermediate: 12,
    beginner: 18,
  };

  let totalMonths = baseMonths[readinessLevel];

  // Adjust based on time commitment
  const hoursPerWeek = userProfile.constraints.timePerWeek;
  if (hoursPerWeek < 10) {
    totalMonths *= 1.5; // 50% longer if less than 10 hours/week
  } else if (hoursPerWeek >= 20) {
    totalMonths *= 0.75; // 25% faster if 20+ hours/week
  }

  // Adjust based on number of critical gaps
  const criticalGaps = gaps.filter(g => g.priority === 'critical').length;
  if (criticalGaps > 5) {
    totalMonths += 3;
  } else if (criticalGaps > 3) {
    totalMonths += 2;
  }

  // Round to nearest month
  return Math.round(totalMonths);
}

/**
 * Generate timeline phases
 */
function generatePhases(
  skillsGap: SkillsGapAnalysis,
  userProfile: UserProfile,
  totalMonths: number,
  targetRole: string
): TimelinePhase[] {
  const phases: TimelinePhase[] = [];

  // Phase 1: Foundation (first 25% of timeline)
  const foundationDuration = Math.ceil(totalMonths * 0.25);
  phases.push({
    phase: 1,
    title: 'Foundation & Core Skills',
    duration: formatDuration(foundationDuration),
    startMonth: 0,
    endMonth: foundationDuration,
    goals: [
      'Build foundational knowledge in critical skill areas',
      'Complete beginner-level courses and tutorials',
      'Set up development environment and tools',
      'Create a structured learning schedule',
    ],
    activities: [
      'Enroll in core courses for top 3 critical skills',
      'Complete daily coding/practice exercises (1-2 hours)',
      'Join relevant online communities and forums',
      'Start a learning journal to track progress',
      'Build 2-3 small beginner projects',
    ],
    successMetrics: [
      'Completed foundational courses for critical skills',
      'Can explain core concepts confidently',
      'Built and deployed first projects',
      'Consistent daily learning habit established',
    ],
    completionCriteria: [
      'Proficiency level 2-3 in critical technical skills',
      'Portfolio has at least 2 projects',
      'Active participation in learning communities',
    ],
  });

  // Phase 2: Skill Development (next 35% of timeline)
  const developmentDuration = Math.ceil(totalMonths * 0.35);
  const developmentStart = foundationDuration;
  phases.push({
    phase: 2,
    title: 'Skill Development & Practice',
    duration: formatDuration(developmentDuration),
    startMonth: developmentStart,
    endMonth: developmentStart + developmentDuration,
    goals: [
      'Achieve intermediate-level proficiency in core skills',
      'Build portfolio with real-world projects',
      'Start contributing to open-source or work projects',
      'Develop domain expertise',
    ],
    activities: [
      'Work on 3-5 intermediate-level projects',
      'Contribute to 2-3 open-source projects',
      'Take advanced courses in specialized areas',
      'Practice system design and problem-solving',
      'Attend virtual meetups and conferences',
      'Start building professional network in target domain',
    ],
    successMetrics: [
      'Portfolio has 4-6 high-quality projects',
      'Open-source contributions merged',
      'Can solve medium-difficulty technical problems',
      'Network includes 20+ relevant connections',
    ],
    completionCriteria: [
      'Proficiency level 3-4 in most required skills',
      'Portfolio demonstrates real-world problem-solving',
      'Positive code review feedback from community',
    ],
  });

  // Phase 3: Specialization (next 20% of timeline)
  const specializationDuration = Math.ceil(totalMonths * 0.20);
  const specializationStart = developmentStart + developmentDuration;
  phases.push({
    phase: 3,
    title: 'Specialization & Polish',
    duration: formatDuration(specializationDuration),
    startMonth: specializationStart,
    endMonth: specializationStart + specializationDuration,
    goals: [
      'Achieve advanced proficiency in specialized areas',
      'Build standout portfolio projects',
      'Earn relevant certifications',
      'Establish thought leadership',
    ],
    activities: [
      'Build 1-2 advanced showcase projects',
      'Complete certification exams',
      'Write technical blog posts or create content',
      'Mentor others in your learning areas',
      'Optimize LinkedIn and professional profiles',
      'Practice behavioral and technical interviews',
    ],
    successMetrics: [
      'Certifications earned',
      'Published technical content',
      'Portfolio includes standout project(s)',
      'Strong professional online presence',
    ],
    completionCriteria: [
      'Proficiency level 4+ in core skills',
      'Portfolio competitive with target role candidates',
      'Active thought leadership (blog, talks, mentoring)',
    ],
  });

  // Phase 4: Job Search & Transition (final 20%)
  const jobSearchDuration = totalMonths - (foundationDuration + developmentDuration + specializationDuration);
  const jobSearchStart = specializationStart + specializationDuration;
  phases.push({
    phase: 4,
    title: 'Job Search & Transition',
    duration: formatDuration(jobSearchDuration),
    startMonth: jobSearchStart,
    endMonth: totalMonths,
    goals: [
      'Secure target role position',
      'Pass technical interviews with confidence',
      'Negotiate competitive offer',
      'Successfully transition to new role',
    ],
    activities: [
      'Apply to 5-10 target companies per week',
      'Network with hiring managers and recruiters',
      'Practice 2-3 mock interviews per week',
      'Attend company info sessions and recruiting events',
      'Optimize resume and portfolio for each application',
      'Leverage referrals from network',
      'Continue learning and building through job search',
    ],
    successMetrics: [
      '20+ applications submitted',
      '5+ phone screens completed',
      '2-3 on-site interviews',
      'At least one job offer received',
    ],
    completionCriteria: [
      'Accepted offer for target role',
      'Negotiated competitive compensation',
      'Smooth transition plan in place',
    ],
  });

  return phases;
}

/**
 * Generate timeline assumptions
 */
function generateAssumptions(userProfile: UserProfile, totalMonths: number): string[] {
  const assumptions: string[] = [
    `You can dedicate ${userProfile.constraints.timePerWeek} hours per week to learning and skill development`,
  ];

  if (userProfile.constraints.budget) {
    assumptions.push(`Budget of $${userProfile.constraints.budget} available for courses and certifications`);
  }

  assumptions.push('You have access to a computer and internet for learning');
  assumptions.push('You can balance learning with current job/commitments');

  if (totalMonths > 12) {
    assumptions.push('You maintain consistent effort over extended period (12+ months)');
  }

  assumptions.push('Job market remains stable in your target domain');
  assumptions.push('You actively seek feedback and iterate on skills');
  assumptions.push('You network and build connections throughout the journey');

  return assumptions;
}

/**
 * Generate accelerators
 */
function generateAccelerators(skillsGap: SkillsGapAnalysis, userProfile: UserProfile): string[] {
  const accelerators: string[] = [];

  // Time-based accelerators
  if (userProfile.constraints.timePerWeek >= 20) {
    accelerators.push('Increase learning time to 25-30 hours/week to finish 30-40% faster');
  } else {
    accelerators.push('Dedicate 15-20 hours/week (vs current plan) to accelerate by 20-25%');
  }

  // Budget accelerators
  accelerators.push('Invest in premium courses and bootcamps for structured, faster learning');
  accelerators.push('Hire a mentor or coach for personalized guidance and accountability');

  // Strategy accelerators
  accelerators.push('Focus exclusively on critical skills first (defer nice-to-haves)');
  accelerators.push('Leverage internal transfers if already at a target company');
  accelerators.push('Build in public - share progress on LinkedIn/Twitter for visibility');
  accelerators.push('Contribute to open-source projects used by target companies');
  accelerators.push('Attend in-person conferences and networking events');

  if (userProfile.yearsOfExperience >= 5) {
    accelerators.push('Leverage existing experience - highlight transferable skills aggressively');
  }

  accelerators.push('Get referrals - referred candidates are 4x more likely to get interviews');

  return accelerators.slice(0, 8);
}

/**
 * Generate risks
 */
function generateRisks(skillsGap: SkillsGapAnalysis, userProfile: UserProfile): string[] {
  const risks: string[] = [];

  // Readiness-based risks
  if (skillsGap.readinessLevel === 'beginner') {
    risks.push('Large skill gap may lead to discouragement - celebrate small wins');
    risks.push('Extended timeline (12+ months) requires sustained motivation');
  }

  // Commitment risks
  if (userProfile.constraints.timePerWeek < 10) {
    risks.push('Limited time commitment may slow progress - consider reducing other commitments');
  }

  risks.push('Job market changes could affect demand for target role');
  risks.push('Burnout from balancing learning with current responsibilities');
  risks.push('Imposter syndrome may cause premature stopping - push through');

  // Skill-specific risks
  const criticalGaps = skillsGap.gaps.filter(g => g.priority === 'critical');
  if (criticalGaps.length > 5) {
    risks.push('Many critical gaps - missing even one could block job offers');
  }

  risks.push('Tutorial hell - doing courses without building real projects');
  risks.push('Not networking enough - skills alone may not be sufficient');
  risks.push('Applying too early before skills are interview-ready');

  return risks.slice(0, 6);
}

/**
 * Generate milestones for the timeline
 */
export function generateMilestones(
  phases: TimelinePhase[],
  skillsGap: SkillsGapAnalysis
): Milestone[] {
  const milestones: Milestone[] = [];
  let milestoneId = 1;

  // Foundation phase milestones
  milestones.push({
    id: `m${milestoneId++}`,
    title: 'Complete First Course',
    description: 'Finish your first foundational course in a critical skill area',
    targetMonth: 1,
    type: 'skill',
    priority: 'high',
    completionCriteria: ['Course completed', 'Quiz/exam passed', 'Notes documented'],
    dependencies: [],
    estimatedEffort: '30-40 hours',
  });

  milestones.push({
    id: `m${milestoneId++}`,
    title: 'First Portfolio Project',
    description: 'Build and deploy your first portfolio project',
    targetMonth: 2,
    type: 'project',
    priority: 'critical',
    completionCriteria: ['Project completed', 'Deployed live', 'Added to portfolio/GitHub'],
    dependencies: [`m1`],
    estimatedEffort: '20-30 hours',
  });

  // Development phase milestones
  milestones.push({
    id: `m${milestoneId++}`,
    title: 'Intermediate Projects Complete',
    description: 'Complete 3-5 intermediate-level projects',
    targetMonth: Math.ceil(phases[1].endMonth * 0.7),
    type: 'project',
    priority: 'critical',
    completionCriteria: ['3+ projects completed', 'Projects use target role technologies', 'Code quality is professional'],
    dependencies: [`m2`],
    estimatedEffort: '60-80 hours',
  });

  milestones.push({
    id: `m${milestoneId++}`,
    title: 'First Open Source Contribution',
    description: 'Make meaningful contribution to an open-source project',
    targetMonth: phases[1].startMonth + 2,
    type: 'project',
    priority: 'high',
    completionCriteria: ['Pull request merged', 'Positive feedback received'],
    dependencies: [`m2`],
    estimatedEffort: '15-25 hours',
  });

  // Specialization phase milestones
  const criticalCerts = skillsGap.gaps.filter(g =>
    g.skill.toLowerCase().includes('aws') ||
    g.skill.toLowerCase().includes('azure') ||
    g.skill.toLowerCase().includes('certification')
  );

  if (criticalCerts.length > 0 || skillsGap.readinessLevel !== 'beginner') {
    milestones.push({
      id: `m${milestoneId++}`,
      title: 'Earn Key Certification',
      description: 'Complete and pass a relevant industry certification',
      targetMonth: phases[2].startMonth + 1,
      type: 'certification',
      priority: 'high',
      completionCriteria: ['Certification exam passed', 'Certificate added to LinkedIn'],
      dependencies: [`m3`],
      estimatedEffort: '40-80 hours prep',
    });
  }

  milestones.push({
    id: `m${milestoneId++}`,
    title: 'Showcase Project Complete',
    description: 'Build an advanced project that demonstrates mastery',
    targetMonth: phases[2].endMonth - 1,
    type: 'project',
    priority: 'critical',
    completionCriteria: ['Project is production-quality', 'Deployed and accessible', 'Featured on portfolio'],
    dependencies: [`m3`],
    estimatedEffort: '40-60 hours',
  });

  milestones.push({
    id: `m${milestoneId++}`,
    title: 'Professional Presence Optimized',
    description: 'LinkedIn, portfolio, and resume are polished and optimized',
    targetMonth: phases[2].endMonth,
    type: 'networking',
    priority: 'critical',
    completionCriteria: ['LinkedIn optimized', 'Portfolio live and impressive', 'Resume tailored to target role'],
    dependencies: [],
    estimatedEffort: '10-15 hours',
  });

  // Job search milestones
  milestones.push({
    id: `m${milestoneId++}`,
    title: 'First Interview',
    description: 'Land and complete first technical interview',
    targetMonth: phases[3].startMonth + 1,
    type: 'application',
    priority: 'high',
    completionCriteria: ['Interview completed', 'Feedback received', 'Learnings documented'],
    dependencies: [`m${milestoneId - 2}`],
    estimatedEffort: '5-10 hours prep',
  });

  milestones.push({
    id: `m${milestoneId++}`,
    title: 'Job Offer Received',
    description: 'Receive and accept job offer for target role',
    targetMonth: phases[3].endMonth - 1,
    type: 'application',
    priority: 'critical',
    completionCriteria: ['Offer letter received', 'Compensation negotiated', 'Offer accepted'],
    dependencies: [`m${milestoneId - 2}`],
    estimatedEffort: 'Variable',
  });

  return milestones;
}

/**
 * Format duration in months to readable string
 */
function formatDuration(months: number): string {
  if (months < 1) return 'Less than 1 month';
  if (months === 1) return '1 month';
  if (months <= 3) return `${months} months`;
  if (months <= 6) return `${months} months (${Math.round(months / 3)} quarters)`;
  if (months <= 12) return `${months} months`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }

  return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
}

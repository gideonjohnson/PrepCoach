// Career Roadmap Planner - Skills Gap Analysis

import { Skill, SkillGap, SkillsGapAnalysis, RoleRequirements, UserProfile } from './types';

/**
 * Comprehensive role requirements database
 */
export function getRoleRequirements(role: string): RoleRequirements {
  const roleLower = role.toLowerCase();

  const roleDatabase: Record<string, RoleRequirements> = {
    'senior software engineer': {
      role: 'Senior Software Engineer',
      seniority: 'senior',
      requiredSkills: [
        { name: 'JavaScript/TypeScript', category: 'technical', proficiency: 4 },
        { name: 'System Design', category: 'technical', proficiency: 4 },
        { name: 'Data Structures & Algorithms', category: 'technical', proficiency: 4 },
        { name: 'REST APIs', category: 'technical', proficiency: 4 },
        { name: 'Git & Version Control', category: 'technical', proficiency: 4 },
        { name: 'Code Review', category: 'technical', proficiency: 4 },
        { name: 'Testing (Unit, Integration)', category: 'technical', proficiency: 4 },
        { name: 'Technical Leadership', category: 'leadership', proficiency: 3 },
        { name: 'Mentoring', category: 'leadership', proficiency: 3 },
        { name: 'Communication', category: 'soft', proficiency: 4 },
        { name: 'Problem Solving', category: 'soft', proficiency: 4 },
      ],
      preferredSkills: [
        { name: 'React/Vue/Angular', category: 'technical', proficiency: 4 },
        { name: 'Node.js/Python/Java', category: 'technical', proficiency: 4 },
        { name: 'Cloud (AWS/Azure/GCP)', category: 'technical', proficiency: 3 },
        { name: 'Docker/Kubernetes', category: 'technical', proficiency: 3 },
        { name: 'CI/CD', category: 'technical', proficiency: 3 },
        { name: 'Microservices Architecture', category: 'technical', proficiency: 3 },
        { name: 'Database Design', category: 'technical', proficiency: 3 },
        { name: 'Agile/Scrum', category: 'domain', proficiency: 3 },
      ],
      typicalYearsExperience: { min: 5, max: 10 },
      typicalSalaryRange: { min: 120000, max: 180000, currency: 'USD' },
      commonCertifications: ['AWS Certified Developer', 'Azure Developer Associate', 'CKAD'],
      industryDomains: ['SaaS', 'Fintech', 'E-commerce', 'Enterprise'],
    },
    'staff software engineer': {
      role: 'Staff Software Engineer',
      seniority: 'staff',
      requiredSkills: [
        { name: 'Advanced System Design', category: 'technical', proficiency: 5 },
        { name: 'Architecture Patterns', category: 'technical', proficiency: 5 },
        { name: 'Performance Optimization', category: 'technical', proficiency: 4 },
        { name: 'Distributed Systems', category: 'technical', proficiency: 4 },
        { name: 'Technical Strategy', category: 'leadership', proficiency: 4 },
        { name: 'Cross-team Leadership', category: 'leadership', proficiency: 4 },
        { name: 'Mentoring & Coaching', category: 'leadership', proficiency: 4 },
        { name: 'Stakeholder Management', category: 'soft', proficiency: 4 },
        { name: 'Technical Writing', category: 'soft', proficiency: 4 },
      ],
      preferredSkills: [
        { name: 'Multiple Languages Proficiency', category: 'technical', proficiency: 4 },
        { name: 'Cloud Architecture', category: 'technical', proficiency: 4 },
        { name: 'Security Best Practices', category: 'technical', proficiency: 4 },
        { name: 'Cost Optimization', category: 'technical', proficiency: 3 },
        { name: 'Team Building', category: 'leadership', proficiency: 3 },
      ],
      typicalYearsExperience: { min: 8, max: 15 },
      typicalSalaryRange: { min: 180000, max: 280000, currency: 'USD' },
      commonCertifications: ['AWS Solutions Architect', 'Azure Solutions Architect', 'CKA'],
      industryDomains: ['Big Tech', 'Startups', 'Fintech', 'Healthcare'],
    },
    'product manager': {
      role: 'Product Manager',
      seniority: 'mid',
      requiredSkills: [
        { name: 'Product Strategy', category: 'domain', proficiency: 4 },
        { name: 'User Research', category: 'domain', proficiency: 4 },
        { name: 'Data Analysis', category: 'technical', proficiency: 3 },
        { name: 'Roadmap Planning', category: 'domain', proficiency: 4 },
        { name: 'Stakeholder Management', category: 'soft', proficiency: 4 },
        { name: 'Prioritization Frameworks', category: 'domain', proficiency: 4 },
        { name: 'Agile/Scrum', category: 'domain', proficiency: 4 },
        { name: 'Communication', category: 'soft', proficiency: 5 },
        { name: 'Technical Understanding', category: 'technical', proficiency: 3 },
      ],
      preferredSkills: [
        { name: 'SQL', category: 'technical', proficiency: 3 },
        { name: 'A/B Testing', category: 'domain', proficiency: 3 },
        { name: 'Product Analytics Tools', category: 'technical', proficiency: 3 },
        { name: 'UX/UI Principles', category: 'domain', proficiency: 3 },
        { name: 'Go-to-Market Strategy', category: 'domain', proficiency: 3 },
      ],
      typicalYearsExperience: { min: 3, max: 7 },
      typicalSalaryRange: { min: 100000, max: 160000, currency: 'USD' },
      commonCertifications: ['CSPO', 'Pragmatic Marketing', 'Product School PM'],
      industryDomains: ['SaaS', 'Consumer Tech', 'Fintech', 'Healthcare'],
    },
    'data scientist': {
      role: 'Data Scientist',
      seniority: 'mid',
      requiredSkills: [
        { name: 'Python', category: 'technical', proficiency: 4 },
        { name: 'Machine Learning', category: 'technical', proficiency: 4 },
        { name: 'Statistics', category: 'technical', proficiency: 4 },
        { name: 'SQL', category: 'technical', proficiency: 4 },
        { name: 'Data Visualization', category: 'technical', proficiency: 3 },
        { name: 'Feature Engineering', category: 'technical', proficiency: 4 },
        { name: 'Model Evaluation', category: 'technical', proficiency: 4 },
        { name: 'Business Acumen', category: 'domain', proficiency: 3 },
      ],
      preferredSkills: [
        { name: 'Deep Learning', category: 'technical', proficiency: 3 },
        { name: 'TensorFlow/PyTorch', category: 'technical', proficiency: 3 },
        { name: 'Spark', category: 'technical', proficiency: 3 },
        { name: 'Cloud ML Platforms', category: 'technical', proficiency: 3 },
        { name: 'NLP', category: 'technical', proficiency: 3 },
        { name: 'A/B Testing', category: 'domain', proficiency: 3 },
      ],
      typicalYearsExperience: { min: 3, max: 7 },
      typicalSalaryRange: { min: 110000, max: 170000, currency: 'USD' },
      commonCertifications: ['Google Data Analytics', 'AWS ML Specialty', 'TensorFlow Developer'],
      industryDomains: ['Tech', 'Finance', 'Healthcare', 'E-commerce'],
    },
    'devops engineer': {
      role: 'DevOps Engineer',
      seniority: 'mid',
      requiredSkills: [
        { name: 'Linux/Unix', category: 'technical', proficiency: 4 },
        { name: 'CI/CD Pipelines', category: 'technical', proficiency: 4 },
        { name: 'Docker', category: 'technical', proficiency: 4 },
        { name: 'Kubernetes', category: 'technical', proficiency: 4 },
        { name: 'Infrastructure as Code', category: 'technical', proficiency: 4 },
        { name: 'Cloud Platforms', category: 'technical', proficiency: 4 },
        { name: 'Scripting (Bash/Python)', category: 'technical', proficiency: 4 },
        { name: 'Monitoring & Logging', category: 'technical', proficiency: 4 },
      ],
      preferredSkills: [
        { name: 'Terraform/CloudFormation', category: 'technical', proficiency: 4 },
        { name: 'Jenkins/GitLab CI', category: 'technical', proficiency: 3 },
        { name: 'Prometheus/Grafana', category: 'technical', proficiency: 3 },
        { name: 'Security Best Practices', category: 'technical', proficiency: 3 },
        { name: 'Database Administration', category: 'technical', proficiency: 3 },
      ],
      typicalYearsExperience: { min: 3, max: 7 },
      typicalSalaryRange: { min: 100000, max: 160000, currency: 'USD' },
      commonCertifications: ['CKA', 'AWS DevOps Engineer', 'Azure DevOps Engineer'],
      industryDomains: ['Tech', 'Finance', 'SaaS', 'Cloud Services'],
    },
    'engineering manager': {
      role: 'Engineering Manager',
      seniority: 'lead',
      requiredSkills: [
        { name: 'People Management', category: 'leadership', proficiency: 5 },
        { name: 'Team Building', category: 'leadership', proficiency: 4 },
        { name: 'Performance Management', category: 'leadership', proficiency: 4 },
        { name: 'Technical Strategy', category: 'leadership', proficiency: 4 },
        { name: 'Project Management', category: 'domain', proficiency: 4 },
        { name: 'Stakeholder Communication', category: 'soft', proficiency: 5 },
        { name: 'Technical Background', category: 'technical', proficiency: 3 },
        { name: 'Hiring & Recruiting', category: 'leadership', proficiency: 4 },
        { name: 'Conflict Resolution', category: 'soft', proficiency: 4 },
      ],
      preferredSkills: [
        { name: 'Agile/Scrum', category: 'domain', proficiency: 4 },
        { name: 'Budget Management', category: 'leadership', proficiency: 3 },
        { name: 'Career Development', category: 'leadership', proficiency: 4 },
        { name: 'Technical Architecture', category: 'technical', proficiency: 3 },
      ],
      typicalYearsExperience: { min: 7, max: 12 },
      typicalSalaryRange: { min: 150000, max: 220000, currency: 'USD' },
      commonCertifications: ['Scrum Master', 'PMP', 'Leadership Certifications'],
      industryDomains: ['Tech', 'Startups', 'Enterprise', 'Finance'],
    },
  };

  // Find matching role
  for (const [key, value] of Object.entries(roleDatabase)) {
    if (roleLower.includes(key)) {
      return value;
    }
  }

  // Default fallback
  return {
    role: role,
    seniority: 'mid',
    requiredSkills: [],
    preferredSkills: [],
    typicalYearsExperience: { min: 3, max: 7 },
    typicalSalaryRange: { min: 80000, max: 140000, currency: 'USD' },
    commonCertifications: [],
    industryDomains: [],
  };
}

/**
 * Analyze skills gap between current profile and target role
 */
export function analyzeSkillsGap(
  userProfile: UserProfile,
  targetRole: string
): SkillsGapAnalysis {
  const roleReqs = getRoleRequirements(targetRole);
  const allRequiredSkills = [...roleReqs.requiredSkills, ...roleReqs.preferredSkills];

  const currentSkillsMap = new Map<string, Skill>();
  userProfile.currentSkills.forEach(skill => {
    currentSkillsMap.set(skill.name.toLowerCase(), skill);
  });

  const gaps: SkillGap[] = [];

  allRequiredSkills.forEach(requiredSkill => {
    const currentSkill = currentSkillsMap.get(requiredSkill.name.toLowerCase());
    const currentLevel = currentSkill?.proficiency || 0;
    const requiredLevel = requiredSkill.proficiency;

    if (currentLevel < requiredLevel) {
      const gap: SkillGap = {
        skill: requiredSkill.name,
        category: requiredSkill.category,
        currentLevel,
        requiredLevel,
        priority: determinePriority(requiredSkill, roleReqs.requiredSkills),
        estimatedTimeToLearn: estimateTimeToLearn(currentLevel, requiredLevel, requiredSkill.category),
        difficulty: estimateDifficulty(currentLevel, requiredLevel, requiredSkill.category),
        reasoning: generateReasoning(requiredSkill, currentLevel, requiredLevel, roleReqs),
      };
      gaps.push(gap);
    }
  });

  // Sort gaps by priority
  gaps.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Calculate gap score
  const totalGapPoints = gaps.reduce((sum, gap) => {
    return sum + (gap.requiredLevel - gap.currentLevel);
  }, 0);

  const maxPossibleGap = allRequiredSkills.reduce((sum, skill) => sum + skill.proficiency, 0);
  const gapScore = Math.max(0, Math.round(100 - (totalGapPoints / maxPossibleGap) * 100));

  // Determine readiness level
  let readinessLevel: 'beginner' | 'intermediate' | 'advanced' | 'ready';
  if (gapScore >= 80) readinessLevel = 'ready';
  else if (gapScore >= 60) readinessLevel = 'advanced';
  else if (gapScore >= 40) readinessLevel = 'intermediate';
  else readinessLevel = 'beginner';

  // Generate summary
  const criticalGaps = gaps.filter(g => g.priority === 'critical').length;
  const highGaps = gaps.filter(g => g.priority === 'high').length;

  let summary = '';
  if (readinessLevel === 'ready') {
    summary = `You're well-positioned for this role! You have ${gapScore}% of required skills. Focus on the remaining ${gaps.length} skills to become an exceptional candidate.`;
  } else if (readinessLevel === 'advanced') {
    summary = `You're on the right track with ${gapScore}% skill coverage. Addressing ${criticalGaps + highGaps} key gaps will significantly boost your competitiveness.`;
  } else if (readinessLevel === 'intermediate') {
    summary = `You have a solid foundation with ${gapScore}% coverage. Focus on ${criticalGaps} critical and ${highGaps} high-priority skills first.`;
  } else {
    summary = `This is an ambitious transition! You'll need to develop ${criticalGaps} critical and ${highGaps} high-priority skills. Plan for 12-18+ months of focused learning.`;
  }

  return {
    currentSkills: userProfile.currentSkills,
    requiredSkills: allRequiredSkills,
    gaps,
    gapScore,
    readinessLevel,
    summary,
  };
}

/**
 * Determine priority level for a skill gap
 */
function determinePriority(
  skill: Skill,
  requiredSkills: Skill[]
): 'critical' | 'high' | 'medium' | 'low' {
  // Critical if it's a required skill with high proficiency
  const isRequired = requiredSkills.some(rs => rs.name === skill.name);

  if (isRequired && skill.proficiency >= 4) return 'critical';
  if (isRequired && skill.proficiency >= 3) return 'high';
  if (isRequired) return 'medium';

  // Preferred skills
  if (skill.proficiency >= 4) return 'high';
  if (skill.proficiency >= 3) return 'medium';
  return 'low';
}

/**
 * Estimate time to learn a skill
 */
function estimateTimeToLearn(
  currentLevel: number,
  requiredLevel: number,
  category: 'technical' | 'soft' | 'domain' | 'leadership'
): string {
  const levelDiff = requiredLevel - currentLevel;

  // Base months per level
  const baseMonthsPerLevel: Record<string, number> = {
    technical: 3,
    soft: 2,
    domain: 2.5,
    leadership: 4,
  };

  const baseMonths = baseMonthsPerLevel[category];
  const totalMonths = levelDiff * baseMonths;

  if (totalMonths <= 1) return '2-4 weeks';
  if (totalMonths <= 2) return '1-2 months';
  if (totalMonths <= 4) return '2-4 months';
  if (totalMonths <= 6) return '4-6 months';
  if (totalMonths <= 9) return '6-9 months';
  if (totalMonths <= 12) return '9-12 months';
  return '12+ months';
}

/**
 * Estimate difficulty of learning a skill
 */
function estimateDifficulty(
  currentLevel: number,
  requiredLevel: number,
  category: 'technical' | 'soft' | 'domain' | 'leadership'
): 'easy' | 'moderate' | 'challenging' | 'advanced' {
  const levelDiff = requiredLevel - currentLevel;

  if (category === 'technical') {
    if (levelDiff <= 1) return 'easy';
    if (levelDiff <= 2) return 'moderate';
    if (levelDiff <= 3) return 'challenging';
    return 'advanced';
  } else if (category === 'leadership') {
    if (levelDiff <= 1) return 'moderate';
    if (levelDiff <= 2) return 'challenging';
    return 'advanced';
  } else {
    if (levelDiff <= 1) return 'easy';
    if (levelDiff <= 2) return 'moderate';
    return 'challenging';
  }
}

/**
 * Generate reasoning for why a skill is needed
 */
function generateReasoning(
  skill: Skill,
  currentLevel: number,
  requiredLevel: number,
  roleReqs: RoleRequirements
): string {
  const isRequired = roleReqs.requiredSkills.some(rs => rs.name === skill.name);

  if (isRequired) {
    if (currentLevel === 0) {
      return `Essential for ${roleReqs.role}. This is a core requirement that most job postings list as mandatory.`;
    } else {
      return `You have foundational knowledge, but need to reach level ${requiredLevel} proficiency. This is a core requirement for ${roleReqs.role}.`;
    }
  } else {
    return `While not always required, ${skill.name} is highly valued and commonly found in competitive candidates for ${roleReqs.role}.`;
  }
}

/**
 * Get personalized skill development recommendations
 */
export function getSkillDevelopmentRecommendations(gap: SkillGap): string[] {
  const recommendations: string[] = [];

  if (gap.category === 'technical') {
    if (gap.currentLevel === 0) {
      recommendations.push('Start with beginner-friendly courses and tutorials');
      recommendations.push('Build 2-3 small projects to practice fundamentals');
      recommendations.push('Join online communities to ask questions and learn');
    } else if (gap.currentLevel <= 2) {
      recommendations.push('Take intermediate courses focusing on practical applications');
      recommendations.push('Contribute to open-source projects');
      recommendations.push('Build a portfolio project showcasing this skill');
    } else {
      recommendations.push('Work on advanced, production-level projects');
      recommendations.push('Study system design and architectural patterns');
      recommendations.push('Consider mentoring others to deepen expertise');
    }
  } else if (gap.category === 'leadership') {
    recommendations.push('Seek opportunities to lead small projects or initiatives');
    recommendations.push('Find a mentor who excels in this area');
    recommendations.push('Read leadership books and apply learnings immediately');
    recommendations.push('Practice in low-stakes environments first');
  } else if (gap.category === 'soft') {
    recommendations.push('Take courses on communication and interpersonal skills');
    recommendations.push('Practice in real-world situations consistently');
    recommendations.push('Seek feedback from peers and managers');
    recommendations.push('Join groups like Toastmasters or professional networks');
  }

  return recommendations;
}

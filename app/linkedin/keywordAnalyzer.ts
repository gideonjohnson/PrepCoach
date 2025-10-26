// LinkedIn Profile Optimizer - Keyword Analysis Engine

import { LinkedInProfile, JobPosting, KeywordAnalysis, KeywordGap } from './types';

/**
 * Extract keywords from job postings
 */
export function extractJobKeywords(jobDescription: string): string[] {
  // Common technical skills and industry terms
  const techSkills = [
    // Programming languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'PHP', 'Scala', 'R', 'MATLAB', 'SQL', 'NoSQL',

    // Frameworks & Libraries
    'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET',
    'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'Pandas', 'NumPy',

    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CircleCI', 'GitHub Actions',
    'Terraform', 'Ansible', 'CloudFormation', 'Lambda', 'EC2', 'S3',

    // Databases
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB', 'Cassandra', 'Elasticsearch',

    // Tools & Platforms
    'Git', 'Jira', 'Confluence', 'Slack', 'Figma', 'Tableau', 'Power BI', 'Salesforce',

    // Methodologies
    'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'Microservices', 'REST', 'GraphQL',

    // Soft skills
    'Leadership', 'Communication', 'Collaboration', 'Problem Solving', 'Critical Thinking',
    'Project Management', 'Stakeholder Management', 'Cross-functional', 'Team Lead',

    // Business & Analytics
    'Data Analysis', 'Machine Learning', 'AI', 'Deep Learning', 'NLP', 'Computer Vision',
    'A/B Testing', 'Analytics', 'KPIs', 'Metrics', 'ROI', 'Business Intelligence',

    // Security
    'Security', 'Authentication', 'OAuth', 'Encryption', 'GDPR', 'Compliance',
  ];

  const keywords: Set<string> = new Set();
  const lowerDesc = jobDescription.toLowerCase();

  // Extract tech skills mentioned in job description
  techSkills.forEach(skill => {
    if (lowerDesc.includes(skill.toLowerCase())) {
      keywords.add(skill);
    }
  });

  // Extract degree requirements
  const degreePattern = /(bachelor|master|phd|mba|b\.s\.|m\.s\.|ph\.d)/gi;
  const degreeMatches = jobDescription.match(degreePattern);
  if (degreeMatches) {
    degreeMatches.forEach(degree => keywords.add(degree.toLowerCase()));
  }

  // Extract years of experience patterns
  const expPattern = /(\d+)\+?\s*years?/gi;
  const expMatches = jobDescription.match(expPattern);
  if (expMatches) {
    expMatches.forEach(exp => keywords.add(exp.toLowerCase()));
  }

  // Extract important noun phrases (simplified)
  const importantPhrases = [
    'full stack', 'front end', 'back end', 'frontend', 'backend',
    'product manager', 'software engineer', 'data scientist', 'data engineer',
    'team lead', 'engineering manager', 'principal engineer', 'senior engineer',
    'system design', 'distributed systems', 'scalability', 'performance optimization',
    'user experience', 'ui/ux', 'responsive design', 'mobile development',
    'api design', 'database design', 'architecture', 'technical leadership',
  ];

  importantPhrases.forEach(phrase => {
    if (lowerDesc.includes(phrase)) {
      keywords.add(phrase);
    }
  });

  return Array.from(keywords);
}

/**
 * Analyze profile against target job keywords
 */
export function analyzeKeywords(
  profile: LinkedInProfile,
  jobKeywords: string[][]
): KeywordAnalysis {
  // Flatten all job keywords
  const allJobKeywords = jobKeywords.flat();
  const keywordFrequency = new Map<string, number>();

  // Count how many jobs mention each keyword
  allJobKeywords.forEach(keyword => {
    keywordFrequency.set(keyword, (keywordFrequency.get(keyword) || 0) + 1);
  });

  // Get profile text
  const profileText = [
    profile.headline,
    profile.about,
    ...profile.experience.map(exp => exp.description),
    ...profile.skills,
  ].join(' ').toLowerCase();

  // Categorize keywords
  const presentKeywords: string[] = [];
  const missingKeywords: string[] = [];
  const keywordGaps: KeywordGap[] = [];

  keywordFrequency.forEach((count, keyword) => {
    const isPresent = profileText.includes(keyword.toLowerCase());

    if (isPresent) {
      presentKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);

      // Determine importance based on frequency
      let importance: 'high' | 'medium' | 'low' = 'low';
      const percentage = (count / jobKeywords.length) * 100;

      if (percentage >= 75) importance = 'high';
      else if (percentage >= 40) importance = 'medium';

      keywordGaps.push({
        keyword,
        importance,
        foundInJobs: count,
        suggestion: generateKeywordSuggestion(keyword, profile),
      });
    }
  });

  // Sort gaps by importance
  keywordGaps.sort((a, b) => {
    const importanceOrder = { high: 3, medium: 2, low: 1 };
    return importanceOrder[b.importance] - importanceOrder[a.importance];
  });

  // Calculate coverage score
  const totalKeywords = presentKeywords.length + missingKeywords.length;
  const coverageScore = totalKeywords > 0
    ? Math.round((presentKeywords.length / totalKeywords) * 100)
    : 0;

  // Generate recommendations
  const recommendations = generateRecommendations(keywordGaps, coverageScore);

  return {
    missingKeywords,
    presentKeywords,
    keywordGaps,
    coverageScore,
    recommendations,
  };
}

/**
 * Generate suggestion for adding a missing keyword
 */
function generateKeywordSuggestion(keyword: string, profile: LinkedInProfile): string {
  const lowerKeyword = keyword.toLowerCase();

  // Check if it's a skill
  const techTerms = ['javascript', 'python', 'react', 'aws', 'docker', 'kubernetes', 'sql'];
  if (techTerms.some(term => lowerKeyword.includes(term))) {
    return `Add "${keyword}" to your Skills section and mention it in relevant experience bullets.`;
  }

  // Check if it's a methodology
  const methodologies = ['agile', 'scrum', 'devops', 'ci/cd'];
  if (methodologies.some(method => lowerKeyword.includes(method))) {
    return `Highlight your experience with ${keyword} in your About section and project descriptions.`;
  }

  // Check if it's a soft skill
  const softSkills = ['leadership', 'communication', 'collaboration', 'management'];
  if (softSkills.some(skill => lowerKeyword.includes(skill))) {
    return `Demonstrate ${keyword} through specific examples in your experience bullets.`;
  }

  // Check if it's related to years of experience
  if (lowerKeyword.includes('year')) {
    return `If applicable, mention your years of experience in your headline or About section.`;
  }

  // Default suggestion
  return `Consider incorporating "${keyword}" if it's relevant to your experience.`;
}

/**
 * Generate actionable recommendations based on analysis
 */
function generateRecommendations(gaps: KeywordGap[], coverageScore: number): string[] {
  const recommendations: string[] = [];

  // Coverage-based recommendations
  if (coverageScore < 40) {
    recommendations.push(
      '🚨 Critical: Your profile has low keyword alignment with target roles. Prioritize adding high-importance keywords to your headline and About section.'
    );
  } else if (coverageScore < 70) {
    recommendations.push(
      '⚠️ Your profile matches some requirements but needs improvement. Focus on adding medium and high-priority keywords throughout your profile.'
    );
  } else {
    recommendations.push(
      '✅ Good keyword coverage! Fine-tune by adding remaining keywords where genuinely applicable.'
    );
  }

  // High-priority gaps
  const highPriorityGaps = gaps.filter(g => g.importance === 'high').slice(0, 3);
  if (highPriorityGaps.length > 0) {
    recommendations.push(
      `🎯 Top missing keywords: ${highPriorityGaps.map(g => g.keyword).join(', ')}. These appear in most target jobs.`
    );
  }

  // Specific recommendations based on gap count
  if (gaps.length > 20) {
    recommendations.push(
      '📝 Consider creating a "Core Competencies" section in your About to showcase multiple relevant skills.'
    );
  }

  if (gaps.length > 10) {
    recommendations.push(
      '💡 Update your experience bullets to include more technical terms and measurable outcomes.'
    );
  }

  // Always provide skill recommendations
  recommendations.push(
    '⭐ Make sure your top 3-5 most relevant skills are listed first on LinkedIn for better recruiter visibility.'
  );

  return recommendations;
}

/**
 * Parse job posting URL or text to extract relevant information
 */
export function parseJobPosting(input: string): JobPosting {
  // For now, treat input as job description text
  // In a real implementation, this would fetch from URL or parse structured data

  const keywords = extractJobKeywords(input);

  // Extract title (look for common patterns)
  const titleMatch = input.match(/(?:position|role|title):\s*(.+)/i) ||
                     input.match(/^(.+?)(?:\n|$)/);
  const title = titleMatch ? titleMatch[1].trim() : 'Software Engineer';

  // Extract company (look for common patterns)
  const companyMatch = input.match(/(?:company|employer):\s*(.+)/i);
  const company = companyMatch ? companyMatch[1].trim() : 'Target Company';

  // Extract requirements (look for bullet points or requirement sections)
  const requirements = extractRequirements(input);

  return {
    url: '',
    title,
    company,
    description: input,
    requirements,
    keywords,
  };
}

/**
 * Extract requirements from job description
 */
function extractRequirements(description: string): string[] {
  const requirements: string[] = [];

  // Look for bullet points or numbered lists
  const bulletPattern = /[•\-\*]\s*(.+)/g;
  let match;

  while ((match = bulletPattern.exec(description)) !== null) {
    requirements.push(match[1].trim());
  }

  // If no bullets found, look for "requirements" section
  if (requirements.length === 0) {
    const reqSection = description.match(/requirements?:(.+?)(?:\n\n|qualifications|$)/i);
    if (reqSection) {
      const lines = reqSection[1].split('\n').filter(line => line.trim().length > 0);
      requirements.push(...lines.map(line => line.trim()));
    }
  }

  return requirements.slice(0, 10); // Limit to top 10
}

/**
 * Analyze multiple job postings and aggregate insights
 */
export function analyzeMultipleJobs(
  profile: LinkedInProfile,
  jobDescriptions: string[]
): KeywordAnalysis {
  const jobKeywords = jobDescriptions.map(desc => extractJobKeywords(desc));
  return analyzeKeywords(profile, jobKeywords);
}

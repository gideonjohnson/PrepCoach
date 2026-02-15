import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

interface TalentProfile {
  id: string;
  anonymousId: string;
  displayTitle: string | null;
  codingScore: number | null;
  systemDesignScore: number | null;
  behavioralScore: number | null;
  overallScore: number | null;
  verifiedSkills: string[];
  seniorityLevel: string | null;
  yearsExperience: number | null;
  availability: string;
  totalSessions: number;
  totalPracticeHours: number;
}

interface JobRequirements {
  title: string;
  description?: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  experienceLevel?: string;
  minYearsExperience?: number;
}

interface ScoredProfile extends TalentProfile {
  relevanceScore: number;
  matchReasons: string[];
  skillMatches: string[];
  gaps: string[];
}

export async function scoreProfileRelevance(
  profile: TalentProfile,
  requirements: JobRequirements
): Promise<{ score: number; reasons: string[]; skillMatches: string[]; gaps: string[] }> {
  try {
    const prompt = `You are an expert talent matching system. Score how relevant this candidate profile is to the job requirements.

JOB REQUIREMENTS:
- Title: ${requirements.title}
${requirements.description ? `- Description: ${requirements.description}` : ''}
${requirements.requiredSkills?.length ? `- Required Skills: ${requirements.requiredSkills.join(', ')}` : ''}
${requirements.preferredSkills?.length ? `- Preferred Skills: ${requirements.preferredSkills.join(', ')}` : ''}
${requirements.experienceLevel ? `- Experience Level: ${requirements.experienceLevel}` : ''}
${requirements.minYearsExperience ? `- Minimum Years Experience: ${requirements.minYearsExperience}` : ''}

CANDIDATE PROFILE:
- Title: ${profile.displayTitle}
- Verified Skills: ${profile.verifiedSkills.join(', ')}
- Seniority Level: ${profile.seniorityLevel}
- Years of Experience: ${profile.yearsExperience}
- Interview Scores: Coding ${profile.codingScore}%, System Design ${profile.systemDesignScore}%, Behavioral ${profile.behavioralScore}%
- Overall Score: ${profile.overallScore}%
- Practice Hours: ${profile.totalPracticeHours}
- Mock Interviews Completed: ${profile.totalSessions}

Analyze the match and respond in this exact JSON format:
{
  "score": <0-100 relevance score>,
  "reasons": ["<reason 1>", "<reason 2>", ...],
  "skillMatches": ["<matching skill 1>", "<matching skill 2>", ...],
  "gaps": ["<gap 1>", "<gap 2>", ...]
}

Score Guidelines:
- 90-100: Exceptional match, meets all requirements and has additional strengths
- 75-89: Strong match, meets most key requirements
- 60-74: Good match, meets some requirements but has gaps
- 40-59: Partial match, significant gaps but some potential
- 0-39: Poor match, does not meet core requirements

Only output the JSON, no other text.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const result = JSON.parse(content.text);
    return {
      score: Math.min(100, Math.max(0, result.score)),
      reasons: result.reasons || [],
      skillMatches: result.skillMatches || [],
      gaps: result.gaps || [],
    };
  } catch (error) {
    console.error('AI scoring error:', error);
    // Fallback to basic keyword matching
    return calculateBasicRelevance(profile, requirements);
  }
}

function calculateBasicRelevance(
  profile: TalentProfile,
  requirements: JobRequirements
): { score: number; reasons: string[]; skillMatches: string[]; gaps: string[] } {
  let score = 50; // Base score
  const reasons: string[] = [];
  const skillMatches: string[] = [];
  const gaps: string[] = [];

  const profileSkillsLower = profile.verifiedSkills.map(s => s.toLowerCase());

  // Check required skills
  if (requirements.requiredSkills?.length) {
    const matches = requirements.requiredSkills.filter(skill =>
      profileSkillsLower.some(ps => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps))
    );
    const matchRatio = matches.length / requirements.requiredSkills.length;
    score += matchRatio * 30;
    skillMatches.push(...matches);

    if (matchRatio >= 0.8) {
      reasons.push('Matches most required skills');
    }

    const missing = requirements.requiredSkills.filter(skill =>
      !profileSkillsLower.some(ps => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps))
    );
    gaps.push(...missing.map(s => `Missing required skill: ${s}`));
  }

  // Check preferred skills
  if (requirements.preferredSkills?.length) {
    const matches = requirements.preferredSkills.filter(skill =>
      profileSkillsLower.some(ps => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps))
    );
    score += (matches.length / requirements.preferredSkills.length) * 10;
    skillMatches.push(...matches);
  }

  // Experience level matching
  if (requirements.minYearsExperience && profile.yearsExperience != null && profile.yearsExperience >= requirements.minYearsExperience) {
    score += 10;
    reasons.push(`Has ${profile.yearsExperience} years experience (required: ${requirements.minYearsExperience}+)`);
  } else if (requirements.minYearsExperience && profile.yearsExperience != null && profile.yearsExperience < requirements.minYearsExperience) {
    gaps.push(`Only ${profile.yearsExperience} years experience (required: ${requirements.minYearsExperience}+)`);
  }

  // Bonus for high interview scores
  if (profile.overallScore != null && profile.overallScore >= 80) {
    score += 5;
    reasons.push('High interview performance scores');
  }

  return {
    score: Math.min(100, Math.max(0, Math.round(score))),
    reasons,
    skillMatches: [...new Set(skillMatches)],
    gaps,
  };
}

export async function batchScoreProfiles(
  profiles: TalentProfile[],
  requirements: JobRequirements
): Promise<ScoredProfile[]> {
  // For performance, limit concurrent AI calls
  const batchSize = 5;
  const results: ScoredProfile[] = [];

  for (let i = 0; i < profiles.length; i += batchSize) {
    const batch = profiles.slice(i, i + batchSize);
    const scored = await Promise.all(
      batch.map(async (profile) => {
        const scoring = await scoreProfileRelevance(profile, requirements);
        return {
          ...profile,
          relevanceScore: scoring.score,
          matchReasons: scoring.reasons,
          skillMatches: scoring.skillMatches,
          gaps: scoring.gaps,
        };
      })
    );
    results.push(...scored);
  }

  // Sort by relevance score descending
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

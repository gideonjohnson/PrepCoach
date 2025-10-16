// LinkedIn Profile Optimizer - 4-Week Visibility Plan Generator

import { VisibilityPlan, WeekPlan, VisibilityTask } from './types';

/**
 * Generate a 4-week visibility and engagement plan
 */
export function generate4WeekPlan(
  targetRole: string,
  currentConnections: number = 500
): VisibilityPlan {
  const weeks: WeekPlan[] = [
    generateWeek1Plan(targetRole),
    generateWeek2Plan(targetRole),
    generateWeek3Plan(targetRole, currentConnections),
    generateWeek4Plan(targetRole),
  ];

  const goals = [
    'Increase profile views by 300%',
    'Grow network by 50+ relevant connections',
    'Establish thought leadership in your domain',
    'Get on recruiter radars for target roles',
    'Build engagement with industry leaders',
  ];

  const metrics = [
    'Profile views per week',
    'Connection requests sent/accepted',
    'Post engagement rate (likes, comments, shares)',
    'InMail messages from recruiters',
    'Profile search appearances',
  ];

  return {
    weeks,
    goals,
    metrics,
  };
}

/**
 * Week 1: Profile Optimization & Foundation
 */
function generateWeek1Plan(targetRole: string): WeekPlan {
  const tasks: VisibilityTask[] = [
    {
      task: 'Complete profile optimization with new headline, About, and experience bullets',
      frequency: 'Once',
      impact: 'high',
      timeEstimate: '2-3 hours',
    },
    {
      task: 'Add/reorder skills to match target role requirements',
      frequency: 'Once',
      impact: 'high',
      timeEstimate: '30 minutes',
    },
    {
      task: 'Request endorsements from 10 colleagues for top skills',
      frequency: 'Once',
      impact: 'medium',
      timeEstimate: '20 minutes',
    },
    {
      task: 'Update profile photo to professional, high-quality image',
      frequency: 'Once (if needed)',
      impact: 'medium',
      timeEstimate: '1 hour',
    },
    {
      task: 'Add custom LinkedIn URL (linkedin.com/in/yourname)',
      frequency: 'Once',
      impact: 'low',
      timeEstimate: '5 minutes',
    },
    {
      task: 'Turn on "Open to Work" feature (visible to recruiters only)',
      frequency: 'Once',
      impact: 'high',
      timeEstimate: '5 minutes',
    },
  ];

  const postTopics = [
    'Share your career journey or a recent professional milestone',
    'Post about a technical challenge you recently solved',
    'Share insights from a recent project or learning experience',
  ];

  return {
    week: 1,
    focus: 'Profile Optimization & Foundation',
    tasks,
    postTopics,
  };
}

/**
 * Week 2: Content Creation & Engagement
 */
function generateWeek2Plan(targetRole: string): WeekPlan {
  const tasks: VisibilityTask[] = [
    {
      task: 'Publish 2-3 posts about your expertise or industry insights',
      frequency: '2-3x this week',
      impact: 'high',
      timeEstimate: '30 min per post',
    },
    {
      task: 'Comment meaningfully on 10-15 posts from industry leaders',
      frequency: 'Daily (2-3 per day)',
      impact: 'high',
      timeEstimate: '15 minutes/day',
    },
    {
      task: 'Send 20 personalized connection requests to people in target companies',
      frequency: '5 per day',
      impact: 'high',
      timeEstimate: '20 minutes/day',
    },
    {
      task: 'Engage with every comment on your posts within 2 hours',
      frequency: 'As needed',
      impact: 'medium',
      timeEstimate: '10 minutes/day',
    },
    {
      task: 'Join 3-5 relevant LinkedIn groups for your industry',
      frequency: 'Once',
      impact: 'medium',
      timeEstimate: '15 minutes',
    },
    {
      task: 'Follow 20 companies you want to work for',
      frequency: 'Once',
      impact: 'low',
      timeEstimate: '10 minutes',
    },
  ];

  const postTopics = getPostTopicsForRole(targetRole, 'week2');

  return {
    week: 2,
    focus: 'Content Creation & Engagement',
    tasks,
    postTopics,
  };
}

/**
 * Week 3: Strategic Networking & Outreach
 */
function generateWeek3Plan(targetRole: string, currentConnections: number): WeekPlan {
  const tasks: VisibilityTask[] = [
    {
      task: 'Send 25-30 personalized connection requests (recruiters, hiring managers, peers)',
      frequency: '6-8 per day',
      impact: 'high',
      timeEstimate: '25 minutes/day',
    },
    {
      task: 'Request 3-5 informational interviews with people in your target role',
      frequency: '1 per day',
      impact: 'high',
      timeEstimate: '15 minutes/day',
    },
    {
      task: 'Publish 2-3 valuable posts (how-to guides, lessons learned, industry trends)',
      frequency: '2-3x this week',
      impact: 'high',
      timeEstimate: '45 min per post',
    },
    {
      task: 'Share and comment on company posts from target employers',
      frequency: 'Daily (2-3 per day)',
      impact: 'medium',
      timeEstimate: '10 minutes/day',
    },
    {
      task: 'Update job preferences and location settings for better recruiter matching',
      frequency: 'Once',
      impact: 'medium',
      timeEstimate: '10 minutes',
    },
    {
      task: 'Message 5-10 existing connections to catch up and share your job search',
      frequency: 'Spread across week',
      impact: 'medium',
      timeEstimate: '20 minutes total',
    },
  ];

  const postTopics = getPostTopicsForRole(targetRole, 'week3');

  return {
    week: 3,
    focus: 'Strategic Networking & Outreach',
    tasks,
    postTopics,
  };
}

/**
 * Week 4: Momentum & Consistency
 */
function generateWeek4Plan(targetRole: string): WeekPlan {
  const tasks: VisibilityTask[] = [
    {
      task: 'Maintain posting cadence: 2-3 posts this week',
      frequency: '2-3x this week',
      impact: 'high',
      timeEstimate: '30 min per post',
    },
    {
      task: 'Continue targeted connection requests (20-25 this week)',
      frequency: '5 per day',
      impact: 'high',
      timeEstimate: '20 minutes/day',
    },
    {
      task: 'Follow up with connections from Week 3, nurture relationships',
      frequency: '3-4x this week',
      impact: 'medium',
      timeEstimate: '15 minutes each',
    },
    {
      task: 'Comment on 15-20 posts from your network',
      frequency: 'Daily (3-4 per day)',
      impact: 'medium',
      timeEstimate: '15 minutes/day',
    },
    {
      task: 'Review and respond to all messages within 24 hours',
      frequency: 'Daily',
      impact: 'high',
      timeEstimate: '10 minutes/day',
    },
    {
      task: 'Publish a "case study" post showcasing a major project or achievement',
      frequency: 'Once',
      impact: 'high',
      timeEstimate: '1 hour',
    },
    {
      task: 'Audit your profile - check analytics and adjust strategy for Week 5+',
      frequency: 'Once',
      impact: 'medium',
      timeEstimate: '30 minutes',
    },
  ];

  const postTopics = getPostTopicsForRole(targetRole, 'week4');

  return {
    week: 4,
    focus: 'Momentum & Consistency',
    tasks,
    postTopics,
  };
}

/**
 * Get post topic suggestions based on role and week
 */
function getPostTopicsForRole(targetRole: string, week: string): string[] {
  const roleLower = targetRole.toLowerCase();

  const baseTopics: Record<string, string[]> = {
    week2: [
      'Share a technical challenge you solved and your approach',
      'Post about a tool or framework you recently learned',
      'Discuss an industry trend and your perspective on it',
      'Share a "lessons learned" from a recent project',
    ],
    week3: [
      'Write a "how-to" guide on something you\'re expert in',
      'Share your thoughts on a recent industry development or news',
      'Post about best practices in your domain',
      'Discuss a common mistake in your field and how to avoid it',
    ],
    week4: [
      'Create a case study of a major project you delivered',
      'Share your predictions for your industry in the next year',
      'Post a "top 5 tips" for aspiring professionals in your field',
      'Discuss what makes a great team/culture in your domain',
    ],
  };

  const roleSpecificTopics: Record<string, Record<string, string[]>> = {
    'software engineer': {
      week2: [
        'Share a code optimization or refactoring win',
        'Discuss debugging techniques that saved you hours',
        'Post about a new tech stack you\'re exploring',
      ],
      week3: [
        'How-to guide: Setting up CI/CD pipeline',
        'Best practices for code review',
        'Common pitfalls in [your primary language]',
      ],
      week4: [
        'Case study: How I scaled our API to handle 10x traffic',
        'Future of software development: My predictions',
        'Top 5 tips for junior developers',
      ],
    },
    'product manager': {
      week2: [
        'Share a tough product decision and the framework you used',
        'Discuss how you prioritized competing stakeholder needs',
        'Post about user research insights that changed your roadmap',
      ],
      week3: [
        'How-to guide: Running effective product discovery',
        'Best practices for writing PRDs',
        'Common mistakes in product prioritization',
      ],
      week4: [
        'Case study: How we achieved product-market fit',
        'Future of product management in AI era',
        'Top 5 tips for aspiring PMs',
      ],
    },
    'data scientist': {
      week2: [
        'Share an ML model that outperformed expectations',
        'Discuss data quality issues and solutions',
        'Post about a statistical concept many get wrong',
      ],
      week3: [
        'How-to guide: Feature engineering best practices',
        'Best practices for model deployment',
        'Common mistakes in A/B testing',
      ],
      week4: [
        'Case study: How ML increased revenue by X%',
        'Future of AI/ML: My predictions',
        'Top 5 tips for aspiring data scientists',
      ],
    },
  };

  // Get base topics for the week
  let topics = baseTopics[week] || [];

  // Add role-specific topics if available
  for (const [role, weekTopics] of Object.entries(roleSpecificTopics)) {
    if (roleLower.includes(role)) {
      topics = [...topics, ...(weekTopics[week] || [])];
      break;
    }
  }

  return topics.slice(0, 5);
}

/**
 * Get best practices for LinkedIn posting
 */
export function getPostingBestPractices(): {
  timing: string[];
  format: string[];
  engagement: string[];
  content: string[];
} {
  return {
    timing: [
      '📅 Best days: Tuesday-Thursday get 20% more engagement',
      '⏰ Best times: 7-8am, 12-1pm, 5-6pm (local time)',
      '🔄 Post 2-3 times per week consistently',
      '⏱️ Space posts at least 24-48 hours apart',
    ],
    format: [
      '📝 Hook in first 2 lines (before "see more")',
      '🔢 Use line breaks for readability',
      '❌ Don\'t use external links (lower reach)',
      '📊 Posts with 8-12 lines perform best',
      '# Use 3-5 relevant hashtags (not more)',
      '🖼️ Add images/carousels for 2x engagement',
    ],
    engagement: [
      '💬 Respond to all comments within first 2 hours',
      '🤝 Ask a question to encourage discussion',
      '🔔 Tag relevant people/companies (sparingly)',
      '↩️ Reply to comments with substance, not just "thanks"',
      '⏱️ First 60 minutes are critical for reach',
    ],
    content: [
      '📖 Tell stories, not just facts',
      '💡 Provide value: teach, inspire, or entertain',
      '🎯 Be specific and authentic',
      '🔥 Controversial (but professional) opinions drive engagement',
      '✅ End with a clear call-to-action',
      '📈 Share wins AND lessons from failures',
    ],
  };
}

/**
 * Generate engagement strategy
 */
export function getEngagementStrategy(): {
  commenting: string[];
  networking: string[];
  messaging: string[];
} {
  return {
    commenting: [
      'Comment within first 60 mins of post going live for max visibility',
      'Add genuine value - share experience, ask thoughtful questions',
      'Aim for 3-5 sentence comments, not just "Great post!"',
      'Tag others who might benefit from the discussion',
      'Follow up on conversations - build relationships in comments',
    ],
    networking: [
      'Quality over quantity - 10 meaningful connections > 100 random',
      'Always personalize connection requests (acceptance rate doubles)',
      'Follow up within 48 hours after connection accepts',
      'Provide value before asking for favors',
      'Set reminder to check in every 3-6 months',
    ],
    messaging: [
      'Keep messages under 100 words (higher response rate)',
      'Be specific about why you\'re reaching out',
      'Make it easy to respond with a clear, simple question',
      'Don\'t pitch or ask for job immediately',
      'Follow up once if no response after 1 week',
    ],
  };
}

/**
 * Generate content ideas based on profile and role
 */
export function generateContentIdeas(
  targetRole: string,
  yearsExperience: number
): string[] {
  const ideas: string[] = [];

  // Universal content ideas
  ideas.push(
    'Share your "origin story" - how you got into your field',
    'Document a "day in the life" of your role',
    'Break down a complex concept in your domain for beginners',
    'Share your favorite tools/resources and why',
    'Post about a mistake you made and what you learned'
  );

  // Experience-based ideas
  if (yearsExperience < 3) {
    ideas.push(
      'Share what surprised you most about your role',
      'Document your learning journey and resources',
      'Ask thoughtful questions to spark discussions',
      'Share wins from your first projects'
    );
  } else if (yearsExperience < 7) {
    ideas.push(
      'Share frameworks or mental models you use',
      'Mentor others by sharing detailed how-tos',
      'Discuss career growth lessons',
      'Compare tools/approaches you\'ve used'
    );
  } else {
    ideas.push(
      'Share strategic insights from leading teams/projects',
      'Discuss industry evolution you\'ve witnessed',
      'Provide career advice and mentorship',
      'Share predictions and thought leadership'
    );
  }

  return ideas;
}

/**
 * Get weekly checklist summary
 */
export function getWeeklyChecklist(): string[] {
  return [
    '✅ Posted 2-3 times this week',
    '✅ Commented on 15+ posts from network',
    '✅ Sent 20-30 personalized connection requests',
    '✅ Responded to all messages within 24 hours',
    '✅ Engaged with all comments on my posts',
    '✅ Checked profile analytics and adjusted strategy',
    '✅ Followed up with new connections',
  ];
}

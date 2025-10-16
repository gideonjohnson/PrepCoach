// LinkedIn Profile Optimizer - Connection Message Templates

import { ConnectionMessageTemplate } from './types';

/**
 * Get all connection message templates
 */
export function getConnectionTemplates(): ConnectionMessageTemplate[] {
  return [
    // Recruiter outreach
    {
      scenario: 'Reaching out to a recruiter',
      template: `Hi {firstName},

I noticed you recruit for {companyName} {roleType} roles. I'm a {yourTitle} with {yearsExp} years of experience in {keySkills}.

I'm particularly interested in {companyName}'s work in {specificArea} and would love to learn more about current opportunities.

Would you be open to connecting?`,
      variables: ['firstName', 'companyName', 'roleType', 'yourTitle', 'yearsExp', 'keySkills', 'specificArea'],
      example: `Hi Sarah,

I noticed you recruit for Google Software Engineering roles. I'm a Full-Stack Engineer with 5 years of experience in React, Node.js, and AWS.

I'm particularly interested in Google's work in Cloud Infrastructure and would love to learn more about current opportunities.

Would you be open to connecting?`,
      tips: [
        'Keep it under 300 characters for better response rates',
        'Mention specific company initiatives to show genuine interest',
        'Reference 1-2 key skills that match their typical roles',
        'End with a clear, low-pressure ask',
      ],
    },

    // Hiring manager outreach
    {
      scenario: 'Connecting with a hiring manager',
      template: `Hi {firstName},

I saw you're leading the {teamName} team at {companyName}. Your recent post about {topicMentioned} really resonated with me.

I have {yearsExp} years of experience in {keySkills} and I'm passionate about {sharedInterest}. I'd love to learn more about your team's work and explore if there might be a fit.

Looking forward to connecting!`,
      variables: ['firstName', 'teamName', 'companyName', 'topicMentioned', 'yearsExp', 'keySkills', 'sharedInterest'],
      example: `Hi Michael,

I saw you're leading the Platform Engineering team at Stripe. Your recent post about scaling payment infrastructure really resonated with me.

I have 6 years of experience in distributed systems and microservices and I'm passionate about building resilient, high-throughput systems. I'd love to learn more about your team's work and explore if there might be a fit.

Looking forward to connecting!`,
      tips: [
        'Reference their recent content to show you did your homework',
        'Highlight relevant experience without being pushy',
        'Express genuine interest in their work, not just job opportunities',
        'Keep the tone conversational and professional',
      ],
    },

    // Alumni connection
    {
      scenario: 'Reaching out to an alumni',
      template: `Hi {firstName},

Fellow {universityName} alum here! I graduated with a degree in {yourMajor} in {gradYear}.

I noticed you're now a {theirTitle} at {companyName}. I'm exploring opportunities in {targetArea} and would love to hear about your journey from {universityName} to {companyName}.

Would you be open to a brief chat?`,
      variables: ['firstName', 'universityName', 'yourMajor', 'gradYear', 'theirTitle', 'companyName', 'targetArea'],
      example: `Hi Jennifer,

Fellow Stanford alum here! I graduated with a degree in Computer Science in 2019.

I noticed you're now a Senior Product Manager at Meta. I'm exploring opportunities in Product Management and would love to hear about your journey from Stanford to Meta.

Would you be open to a brief chat?`,
      tips: [
        'Lead with the shared connection (alumni bond)',
        'Mention your graduation year to establish context',
        'Express interest in their career path, not just job openings',
        'Be specific about what you want to learn',
      ],
    },

    // Industry peer connection
    {
      scenario: 'Connecting with an industry peer',
      template: `Hi {firstName},

I came across your profile while researching {topic}. Your background in {theirExpertise} is impressive!

I'm also working in {yourArea} at {yourCompany} and would love to connect with others in the {industry} space.

Let's stay connected!`,
      variables: ['firstName', 'topic', 'theirExpertise', 'yourArea', 'yourCompany', 'industry'],
      example: `Hi David,

I came across your profile while researching machine learning in healthcare. Your background in AI-driven diagnostics is impressive!

I'm also working in Healthcare AI at a startup and would love to connect with others in the medical technology space.

Let's stay connected!`,
      tips: [
        'Mention how you found them (shows it\'s not random)',
        'Compliment their specific expertise',
        'Emphasize mutual benefit of the connection',
        'Keep it brief and friendly',
      ],
    },

    // After meeting at event
    {
      scenario: 'Following up after meeting at an event',
      template: `Hi {firstName},

Great meeting you at {eventName}! I really enjoyed our conversation about {topicDiscussed}.

I'd love to stay connected and continue the discussion. {optionalFollowUp}

Looking forward to keeping in touch!`,
      variables: ['firstName', 'eventName', 'topicDiscussed', 'optionalFollowUp'],
      example: `Hi Alex,

Great meeting you at TechCrunch Disrupt! I really enjoyed our conversation about scaling engineering teams.

I'd love to stay connected and continue the discussion. I'll send you that article about remote team management we talked about.

Looking forward to keeping in touch!`,
      tips: [
        'Send within 24 hours of meeting',
        'Reference specific details from your conversation',
        'Mention any promised follow-up action',
        'Keep the tone warm and genuine',
      ],
    },

    // Cold outreach to learn
    {
      scenario: 'Cold outreach for informational interview',
      template: `Hi {firstName},

I'm a {yourTitle} looking to transition into {targetRole}. I'm impressed by your career path from {theirPastRole} to {theirCurrentRole} at {companyName}.

I'd greatly appreciate 15 minutes of your time to learn about your experience and any advice you might have for someone making a similar transition.

Thank you for considering!`,
      variables: ['firstName', 'yourTitle', 'targetRole', 'theirPastRole', 'theirCurrentRole', 'companyName'],
      example: `Hi Rachel,

I'm a Software Engineer looking to transition into Product Management. I'm impressed by your career path from Engineering to PM at Airbnb.

I'd greatly appreciate 15 minutes of your time to learn about your experience and any advice you might have for someone making a similar transition.

Thank you for considering!`,
      tips: [
        'Be upfront about your ask (informational interview)',
        'Show you researched their background',
        'Specify a short time commitment (15 minutes)',
        'Express gratitude and respect for their time',
      ],
    },

    // Reconnecting with old colleague
    {
      scenario: 'Reconnecting with a former colleague',
      template: `Hi {firstName},

It's been a while since our time at {formerCompany}! I hope you're doing well at {currentCompany}.

I'm currently {yourCurrentSituation} and would love to catch up. It would be great to hear what you're working on and share what I've been up to.

Let me know if you're open to a quick call!`,
      variables: ['firstName', 'formerCompany', 'currentCompany', 'yourCurrentSituation'],
      example: `Hi Tom,

It's been a while since our time at Amazon! I hope you're doing well at Snowflake.

I'm currently exploring new opportunities in data engineering and would love to catch up. It would be great to hear what you're working on and share what I've been up to.

Let me know if you're open to a quick call!`,
      tips: [
        'Reference your shared history',
        'Show interest in what they\'re doing now',
        'Be honest about your current situation',
        'Suggest a specific next step (call, coffee, etc.)',
      ],
    },

    // Company employee for insider info
    {
      scenario: 'Reaching out to learn about a company',
      template: `Hi {firstName},

I'm exploring opportunities at {companyName} and came across your profile. I'm particularly interested in the {teamOrArea} team.

Would you be willing to share your experience working at {companyName}? I'd love to learn about the culture and what makes it a great place to work.

Thanks for considering!`,
      variables: ['firstName', 'companyName', 'teamOrArea'],
      example: `Hi Lisa,

I'm exploring opportunities at Databricks and came across your profile. I'm particularly interested in the Platform Engineering team.

Would you be willing to share your experience working at Databricks? I'd love to learn about the culture and what makes it a great place to work.

Thanks for considering!`,
      tips: [
        'Show specific interest in their company/team',
        'Ask about experience and culture, not just jobs',
        'Keep it brief and respectful',
        'Don\'t ask them to refer you in the first message',
      ],
    },

    // Thought leader in your field
    {
      scenario: 'Connecting with a thought leader',
      template: `Hi {firstName},

I've been following your work on {topic} and found your recent {contentType} about {specificContent} incredibly insightful.

As someone working in {yourArea}, your perspective on {keyInsight} resonated with challenges I'm facing. I'd love to connect and stay updated on your work.

Thank you for sharing your knowledge!`,
      variables: ['firstName', 'topic', 'contentType', 'specificContent', 'yourArea', 'keyInsight'],
      example: `Hi Martin,

I've been following your work on distributed systems and found your recent article about event-driven architectures incredibly insightful.

As someone working in cloud infrastructure, your perspective on eventual consistency resonated with challenges I'm facing. I'd love to connect and stay updated on your work.

Thank you for sharing your knowledge!`,
      tips: [
        'Reference specific content they created',
        'Explain how it helped you',
        'Show you understand the topic (not just a fan)',
        'Don\'t ask for anything in the first message',
      ],
    },

    // Referral request (after established connection)
    {
      scenario: 'Asking for a referral (follow-up message)',
      template: `Hi {firstName},

Thank you for connecting and sharing insights about {companyName}!

I've applied for the {roleTitle} position and believe my experience in {keySkills} aligns well with the role. If you feel comfortable doing so, would you be willing to refer me or introduce me to the hiring manager?

I completely understand if that's not possible. I appreciate your help either way!`,
      variables: ['firstName', 'companyName', 'roleTitle', 'keySkills'],
      example: `Hi Chris,

Thank you for connecting and sharing insights about Netflix!

I've applied for the Senior Software Engineer position and believe my experience in microservices and video streaming aligns well with the role. If you feel comfortable doing so, would you be willing to refer me or introduce me to the hiring manager?

I completely understand if that's not possible. I appreciate your help either way!`,
      tips: [
        'Only ask after you\'ve established rapport',
        'Mention you\'ve already applied',
        'Explain why you\'re a good fit',
        'Give them an easy out',
        'Express gratitude regardless of outcome',
      ],
    },
  ];
}

/**
 * Get templates filtered by scenario type
 */
export function getTemplatesByScenario(scenarioType: string): ConnectionMessageTemplate[] {
  const allTemplates = getConnectionTemplates();

  const scenarioKeywords: Record<string, string[]> = {
    recruiter: ['recruiter'],
    hiring: ['hiring', 'manager'],
    alumni: ['alumni'],
    peer: ['peer', 'industry'],
    event: ['event', 'meeting'],
    informational: ['informational', 'learn'],
    colleague: ['colleague', 'former'],
    company: ['company', 'insider'],
    leader: ['leader', 'thought'],
    referral: ['referral'],
  };

  const keywords = scenarioKeywords[scenarioType.toLowerCase()] || [];

  if (keywords.length === 0) {
    return allTemplates;
  }

  return allTemplates.filter(template =>
    keywords.some(keyword =>
      template.scenario.toLowerCase().includes(keyword)
    )
  );
}

/**
 * Customize a template with user-provided variables
 */
export function customizeTemplate(
  template: ConnectionMessageTemplate,
  variables: Record<string, string>
): string {
  let customized = template.template;

  // Replace all variables
  template.variables.forEach(variable => {
    const value = variables[variable] || `{${variable}}`;
    const regex = new RegExp(`\\{${variable}\\}`, 'g');
    customized = customized.replace(regex, value);
  });

  return customized;
}

/**
 * Get general connection message best practices
 */
export function getConnectionBestPractices(): string[] {
  return [
    '📏 Keep it under 300 characters - shorter messages get 30% higher acceptance rates',
    '🎯 Personalize every message - mention something specific about their profile or work',
    '🚫 Never use "I\'d like to add you to my professional network" - it screams spam',
    '💡 Lead with value or commonality, not what you want',
    '✨ Be specific about why you want to connect',
    '⏰ Send connection requests on Tuesday-Thursday for best response rates',
    '🔄 Follow up with a message after they accept to continue the conversation',
    '📊 Track your acceptance rate - aim for 30%+ (industry average is 20%)',
    '🎁 Offer value before asking for favors',
    '🤝 Build genuine relationships, not just transactional connections',
  ];
}

/**
 * Generate message quality score
 */
export function scoreConnectionMessage(message: string): {
  score: number;
  feedback: string[];
  strengths: string[];
  improvements: string[];
} {
  const feedback: string[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];
  let score = 100;

  // Check length
  if (message.length > 300) {
    score -= 15;
    improvements.push('Message is too long (over 300 characters). Shorter messages get better response rates.');
  } else if (message.length > 200) {
    score -= 5;
    feedback.push('Consider shortening to under 200 characters for optimal engagement.');
  } else {
    strengths.push('Good length - concise messages perform better.');
  }

  // Check for personalization
  const hasName = /hi\s+\w+|hello\s+\w+/i.test(message);
  if (!hasName) {
    score -= 20;
    improvements.push('Start with their first name for personalization.');
  } else {
    strengths.push('Personalized greeting included.');
  }

  // Check for generic phrases
  const genericPhrases = [
    'add you to my professional network',
    'expand my network',
    'grow my network',
  ];

  if (genericPhrases.some(phrase => message.toLowerCase().includes(phrase))) {
    score -= 25;
    improvements.push('Avoid generic phrases like "add you to my network" - be more specific.');
  }

  // Check for specificity
  const specificIndicators = [
    /your (post|article|work) (on|about)/i,
    /noticed you/i,
    /impressed by/i,
    /came across your/i,
  ];

  if (specificIndicators.some(pattern => pattern.test(message))) {
    strengths.push('Message shows specific research or interest.');
  } else {
    score -= 10;
    improvements.push('Reference something specific about their profile or work.');
  }

  // Check for clear purpose
  if (message.includes('?') || /would you|could you|can we/i.test(message)) {
    strengths.push('Includes a clear call-to-action or question.');
  } else {
    score -= 10;
    improvements.push('Add a clear next step or question.');
  }

  // Check tone
  if (/please|thank you|appreciate/i.test(message)) {
    strengths.push('Polite and professional tone.');
  }

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    feedback,
    strengths,
    improvements,
  };
}

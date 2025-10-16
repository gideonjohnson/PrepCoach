// Negotiation Scripts Library - Professional templates for every scenario

import { NegotiationScript } from './types';

export const NEGOTIATION_SCRIPTS: NegotiationScript[] = [
  {
    id: 'initial-offer-below-market',
    scenario: 'initial-offer',
    title: 'Initial Offer Below Market Rate',
    difficulty: 'beginner',
    tags: ['initial-offer', 'below-market', 'data-driven'],
    whenToUse: 'When you receive an initial offer that is below the market median for your role and location.',
    script: `Thank you so much for the offer! I'm really excited about the opportunity to join [Company] and contribute to [specific project/team].

I've done some research on market compensation for [role] positions with [X] years of experience in [location], and I noticed that the offer is a bit below the market median. Based on data from [sources like Levels.fyi], the median total compensation for this role is around $[market median].

Given my experience with [specific relevant skills] and the value I can bring to the team, I was hoping we could discuss adjusting the total compensation to be more in line with the market rate. Would it be possible to increase the base salary to $[target base] and the equity grant to $[target equity]?

I'm confident I can make a significant impact on [specific goals], and I'm very eager to join the team. Is there flexibility in the compensation package?`,
    tips: [
      'Always express enthusiasm first before discussing numbers',
      'Use specific market data and cite your sources (Levels.fyi, Glassdoor, etc.)',
      'Mention specific skills and experiences that justify higher compensation',
      'Ask if there\'s flexibility rather than making demands',
      'Focus on total compensation, not just base salary',
      'Be prepared to explain why you deserve market rate',
    ],
  },
  {
    id: 'competing-offers',
    scenario: 'competing-offers',
    title: 'Leveraging Competing Offers',
    difficulty: 'intermediate',
    tags: ['competing-offers', 'leverage', 'multiple-options'],
    whenToUse: 'When you have other competitive offers and want to negotiate higher compensation.',
    script: `Thank you for the offer! I'm genuinely excited about [Company] and the work you're doing in [specific area].

I wanted to be transparent with you - I'm currently evaluating a few offers, and while [Company] is my top choice because of [specific reasons: culture, mission, team, technology], I do have another offer that's higher in total compensation.

The competing offer is at $[competing total comp], and while compensation isn't the only factor in my decision, it is important. I'd love to work something out that makes joining [Company] the clear choice.

Is there any flexibility to adjust the compensation package? I'm open to creative solutions - whether that's through base salary, equity, signing bonus, or a combination.

I want to make this work because I truly believe [Company] is the best fit for my career goals, and I'm excited to contribute to [specific projects/goals].`,
    tips: [
      'Be honest and transparent about having other offers',
      'Emphasize that this company is your top choice (if true)',
      'Don\'t reveal exact competing offer numbers unless asked',
      'Frame it as wanting to make the decision easy, not as a threat',
      'Mention specific reasons why you prefer this company',
      'Be open to creative compensation structures',
      'Have a deadline in mind but be flexible',
    ],
  },
  {
    id: 'equity-focus',
    scenario: 'equity-negotiation',
    title: 'Negotiating for More Equity',
    difficulty: 'intermediate',
    tags: ['equity', 'startup', 'long-term'],
    whenToUse: 'When you want to increase the equity portion of your offer, especially at startups or pre-IPO companies.',
    script: `Thank you for the offer! I'm very excited about [Company]'s vision and the opportunity to be part of the journey.

I've been thinking about the equity component of the offer. Given that I'll be joining at this stage of the company and will be contributing to [specific high-impact areas], I believe there's an opportunity to adjust the equity grant.

I understand that [Company] is currently valued at [valuation], and I'm bullish on the company's future. I'd love to have more ownership and be more aligned with the company's long-term success.

Would it be possible to increase the equity grant from [current shares] to [target shares]? I'm willing to discuss trade-offs in other areas of the compensation package if needed.

I'm committed to being here for the long term and want to ensure my compensation reflects that commitment and the value I'll create.`,
    tips: [
      'Show that you understand the company stage and equity value',
      'Emphasize long-term commitment and alignment',
      'Be willing to trade off other compensation for equity',
      'Ask about the current valuation and dilution expectations',
      'Discuss vesting schedule flexibility',
      'Understand the difference between ISOs and NSOs',
      'Ask about strike price and 409A valuation',
    ],
  },
  {
    id: 'signing-bonus',
    scenario: 'signing-bonus',
    title: 'Requesting a Signing Bonus',
    difficulty: 'beginner',
    tags: ['signing-bonus', 'one-time', 'bridge-gap'],
    whenToUse: 'When there\'s a gap in base salary or you\'re leaving money on the table from your current job.',
    script: `Thank you for the offer! I'm very excited about joining [Company] and getting started.

I wanted to discuss the possibility of adding a signing bonus to the package. I'm currently leaving [X months/years] of unvested equity at my current company, which amounts to approximately $[amount]. Additionally, I'm forgoing my annual bonus which would have been around $[amount].

Would it be possible to include a signing bonus of $[target amount] to help bridge this gap? This would make the transition much easier and allow me to join [Company] without financial concerns.

I'm very eager to join the team and start contributing to [specific goals], and I believe this adjustment would make the offer work well for both of us.`,
    tips: [
      'Quantify exactly what you\'re leaving behind (unvested equity, bonus, etc.)',
      'Be specific about the amount you\'re requesting',
      'Signing bonuses are often easier to negotiate than base salary',
      'Mention your eagerness to start and contribute',
      'Be prepared to show documentation of what you\'re leaving',
      'Consider asking for the bonus to cover relocation or other one-time costs',
    ],
  },
  {
    id: 'remote-work',
    scenario: 'benefits-negotiation',
    title: 'Negotiating Remote Work Flexibility',
    difficulty: 'beginner',
    tags: ['remote-work', 'flexibility', 'work-life-balance'],
    whenToUse: 'When the compensation is fair but you need more flexibility in work arrangement.',
    script: `Thank you for the offer! I'm excited about the role and the opportunity to work with the team.

I wanted to discuss the work arrangement. While I'm happy to be in the office for key meetings and collaboration, would there be flexibility to work remotely [2-3 days per week / partially / from a different location]?

Remote work would [specific benefit: allow me to be more productive, better manage family commitments, reduce commute stress], and I'm confident it wouldn't impact my ability to deliver results. In fact, at my current company, I've successfully [specific achievement] while working remotely.

I'm committed to being highly available, maintaining strong communication, and ensuring that my work quality exceeds expectations. Would this flexibility be possible?`,
    tips: [
      'Explain the specific benefits remote work would provide',
      'Show evidence that you can be successful working remotely',
      'Emphasize commitment to communication and results',
      'Offer a trial period to prove yourself',
      'Be flexible about hybrid arrangements',
      'Understand the company\'s current remote work policy',
    ],
  },
  {
    id: 'title-level',
    scenario: 'title-negotiation',
    title: 'Negotiating for Higher Title/Level',
    difficulty: 'advanced',
    tags: ['title', 'level', 'career-growth'],
    whenToUse: 'When you believe your experience warrants a higher level than what was offered.',
    script: `Thank you for the offer! I'm very excited about the opportunity and the work [Company] is doing.

I wanted to discuss the level/title of the role. Based on my [X years] of experience and the scope of work we discussed - including [specific responsibilities like leading projects, mentoring, technical decisions] - I believe the [Senior/Staff/Principal] level would be more appropriate.

At my current company, I've been operating at this level for [time period], where I've [specific achievements: led a team of X, drove Y revenue, architected Z system]. I'm confident I can bring this same level of impact to [Company] from day one.

Would it be possible to discuss adjusting the level to [target level]? I understand this may come with additional compensation expectations, and I'm happy to discuss what makes sense for both parties.

I'm committed to exceeding expectations and proving that this is the right decision.`,
    tips: [
      'Provide concrete evidence of work at the higher level',
      'Explain the specific responsibilities that warrant the higher level',
      'Show understanding of what the higher level means at this company',
      'Be prepared to discuss compensation expectations at that level',
      'Offer to demonstrate your capabilities during the interview process',
      'Understand that title changes can be harder than compensation changes',
      'Consider asking for a clear path to promotion instead',
    ],
  },
  {
    id: 'performance-review',
    scenario: 'future-guarantee',
    title: 'Securing Early Performance Review',
    difficulty: 'intermediate',
    tags: ['performance-review', 'raise', 'guarantee'],
    whenToUse: 'When the initial offer is lower than you want, but you can accept it with a guaranteed review.',
    script: `Thank you for the offer! I'm excited about the opportunity to join [Company].

I appreciate the offer, and while the compensation is slightly below what I was targeting, I understand [Company's constraints / budget cycle / market conditions].

Would it be possible to schedule a performance and compensation review after [6 months / when I complete X milestone] instead of the standard annual review? I'm confident that I can demonstrate significant value by then, and this would give us both a chance to reassess compensation based on my actual impact.

Could we agree to this early review in writing, with specific success criteria we can both reference? I'm very motivated to exceed expectations and earn a raise through my performance.`,
    tips: [
      'Ask for the early review to be documented in your offer letter',
      'Define specific, measurable success criteria',
      'Propose a realistic timeline (6-9 months, not 3 months)',
      'Frame it as a performance-based approach, not just asking for more money',
      'Be prepared to overdeliver during this period',
      'Understand that this isn\'t a guarantee of a raise, just a review',
      'Ask what metrics/goals would warrant a compensation increase',
    ],
  },
  {
    id: 'learning-budget',
    scenario: 'benefits-negotiation',
    title: 'Negotiating Learning & Development Budget',
    difficulty: 'beginner',
    tags: ['learning', 'professional-development', 'benefits'],
    whenToUse: 'When you want to invest in your professional growth and the company doesn\'t have a standard L&D budget.',
    script: `Thank you for the offer! I'm excited to join [Company] and grow with the team.

I'm very committed to continuous learning and staying current with [specific technologies/skills relevant to the role]. I noticed the benefits package doesn't mention a professional development or learning budget.

Would it be possible to include a learning & development budget of $[amount, e.g., $2,000-5,000] per year? I'd use this for [specific uses: conferences, courses, certifications, books] that would directly benefit my work at [Company].

I believe this investment would pay dividends as I'll be able to bring cutting-edge knowledge and skills to the team. Many companies in the industry offer similar budgets, and I'd love for [Company] to support my growth in this way.`,
    tips: [
      'Be specific about how you\'d use the learning budget',
      'Mention how the learning would benefit the company',
      'Research what other companies in the industry offer',
      'Start with a reasonable amount ($2-5K annually)',
      'Offer to share learnings with the team',
      'Frame it as an investment in your effectiveness',
      'Consider alternative benefits if learning budget isn\'t possible',
    ],
  },
  {
    id: 'counteroffer-response',
    scenario: 'counteroffer',
    title: 'Responding to a Counteroffer from Current Employer',
    difficulty: 'advanced',
    tags: ['counteroffer', 'current-employer', 'retention'],
    whenToUse: 'When your current employer makes a counteroffer after you announce your resignation.',
    script: `Thank you so much for the counteroffer and for recognizing my contributions. I really appreciate that [Company] values my work.

However, I've given this a lot of thought, and my decision to explore new opportunities isn't solely about compensation. While I appreciate the salary increase, I'm looking for [specific non-monetary factors: new challenges, career growth, different technology stack, company culture, mission alignment].

I've accepted an offer with [New Company] because it aligns better with my long-term career goals. They offer [specific opportunities: chance to work on X, path to Y role, exposure to Z technology] that I'm really excited about.

I'm committed to making this transition as smooth as possible. I'd like to [give X weeks notice / help train my replacement / document my work thoroughly] to ensure the team is set up for success.

I'm grateful for my time here and the opportunities I've had, and I hope we can stay in touch.`,
    tips: [
      'Don\'t accept a counteroffer just for money - stats show 70% leave within a year anyway',
      'Reiterate the non-monetary reasons for leaving',
      'Show appreciation for your time at the company',
      'Be firm but professional in your decision',
      'Offer to help with the transition',
      'Don\'t burn bridges - be gracious',
      'Remember why you wanted to leave in the first place',
      'If you do accept a counteroffer, get it in writing',
    ],
  },
  {
    id: 'relocation-package',
    scenario: 'relocation',
    title: 'Negotiating Relocation Package',
    difficulty: 'intermediate',
    tags: ['relocation', 'moving', 'reimbursement'],
    whenToUse: 'When you need to relocate for the job and want the company to cover moving expenses.',
    script: `Thank you for the offer! I'm very excited about joining [Company] and relocating to [location].

I wanted to discuss the relocation package. Moving from [current location] to [new location] will involve [specific costs: moving company, temporary housing, travel, breaking current lease, etc.], which I estimate at around $[amount].

Would [Company] be able to provide a relocation package to help cover these costs? I'm thinking of either [reimbursement up to $X / lump sum of $X / company-arranged move].

Additionally, since I'll need to find housing in [new location], would it be possible to have [temporary housing for X weeks / travel budget for house-hunting trips / flexible start date]?

I'm committed to making this move and joining the team, and I want to ensure the transition is smooth for everyone involved.`,
    tips: [
      'Get specific quotes for moving costs to justify your request',
      'Ask if the company has a standard relocation package',
      'Break down costs clearly (moving, housing, storage, etc.)',
      'Ask about tax gross-up since relocation reimbursement is taxable',
      'Consider asking for temporary housing if needed',
      'Discuss flexible start date to allow time for the move',
      'Ask about spouse/family support if applicable',
      'Get the relocation package in writing',
    ],
  },
  {
    id: 'offer-too-good',
    scenario: 'acceptance',
    title: 'Accepting an Excellent Offer',
    difficulty: 'beginner',
    tags: ['acceptance', 'gratitude', 'enthusiasm'],
    whenToUse: 'When the offer meets or exceeds your expectations and you want to accept immediately.',
    script: `Thank you so much for this generous offer! I'm thrilled to accept and join [Company].

The compensation package is excellent and reflects the value I hope to bring to the team. I'm particularly excited about [specific aspects: the equity grant / the signing bonus / the benefits package / the work arrangement].

I'm ready to get started and make an immediate impact on [specific projects/goals we discussed]. My target start date would be [date], which gives me [X weeks] to wrap up at my current company and ensure a smooth transition.

Is there anything I should be doing between now and my start date to prepare? I'd love to hit the ground running.

Thank you again for this opportunity. I can't wait to join the team!`,
    tips: [
      'Express genuine enthusiasm and gratitude',
      'Confirm your acceptance clearly',
      'Mention specific aspects of the offer you appreciate',
      'Propose a start date',
      'Ask about onboarding and preparation',
      'Get the offer in writing before accepting',
      'Notify your current employer professionally after accepting',
      'Respond promptly - don\'t leave them waiting',
    ],
  },
  {
    id: 'budget-constraints',
    scenario: 'creative-solutions',
    title: 'Negotiating When Company Has Budget Constraints',
    difficulty: 'advanced',
    tags: ['budget-constraints', 'creative', 'alternative-compensation'],
    whenToUse: 'When the company wants to hire you but legitimately has budget limitations.',
    script: `Thank you for the offer and for being transparent about the budget constraints. I appreciate the honesty.

I'm very excited about [Company] and want to find a way to make this work. Since there's limited flexibility in base salary right now, I'm wondering if we could explore some creative alternatives:

1. **Equity**: Could we increase the equity grant to [target shares]? I'm bullish on the company and happy to bet on its success.

2. **Performance bonus**: Could we add a performance-based bonus of [X%] tied to [specific metrics]?

3. **Early review**: Could we schedule a compensation review after [6 months] with specific success criteria?

4. **Signing bonus**: Could we include a one-time signing bonus of $[amount]?

5. **Future equity grants**: Could we agree to a refresh grant of [shares] after [12 months]?

I'm flexible and open to creative solutions. What would work best given [Company's] current situation?`,
    tips: [
      'Show understanding and empathy for the company\'s position',
      'Propose multiple alternative options',
      'Be genuinely flexible and creative',
      'Focus on long-term value creation',
      'Consider non-cash benefits (extra PTO, remote work, etc.)',
      'Ask what other successful candidates have negotiated',
      'Be willing to bet on yourself and the company\'s growth',
      'Get any alternative arrangements in writing',
    ],
  },
];

/**
 * Get negotiation scripts filtered by scenario
 */
export function getScriptsByScenario(scenario: string): NegotiationScript[] {
  return NEGOTIATION_SCRIPTS.filter(script => script.scenario === scenario);
}

/**
 * Get negotiation scripts filtered by difficulty
 */
export function getScriptsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): NegotiationScript[] {
  return NEGOTIATION_SCRIPTS.filter(script => script.difficulty === difficulty);
}

/**
 * Get negotiation scripts filtered by tags
 */
export function getScriptsByTags(tags: string[]): NegotiationScript[] {
  return NEGOTIATION_SCRIPTS.filter(script =>
    tags.some(tag => script.tags.includes(tag))
  );
}

/**
 * Get a single script by ID
 */
export function getScriptById(id: string): NegotiationScript | undefined {
  return NEGOTIATION_SCRIPTS.find(script => script.id === id);
}

/**
 * Get recommended scripts based on user situation
 */
export function getRecommendedScripts(params: {
  hasCompetingOffers: boolean;
  offerBelowMarket: boolean;
  wantsRemoteWork: boolean;
  needsRelocation: boolean;
  isStartup: boolean;
}): NegotiationScript[] {
  const recommended: NegotiationScript[] = [];

  if (params.hasCompetingOffers) {
    const script = getScriptById('competing-offers');
    if (script) recommended.push(script);
  }

  if (params.offerBelowMarket) {
    const script = getScriptById('initial-offer-below-market');
    if (script) recommended.push(script);
  }

  if (params.wantsRemoteWork) {
    const script = getScriptById('remote-work');
    if (script) recommended.push(script);
  }

  if (params.needsRelocation) {
    const script = getScriptById('relocation-package');
    if (script) recommended.push(script);
  }

  if (params.isStartup) {
    const script = getScriptById('equity-focus');
    if (script) recommended.push(script);
  }

  // Always include signing bonus as a fallback option
  if (recommended.length < 3) {
    const script = getScriptById('signing-bonus');
    if (script) recommended.push(script);
  }

  return recommended;
}

/**
 * Get all available scenarios
 */
export function getAllScenarios(): string[] {
  return Array.from(new Set(NEGOTIATION_SCRIPTS.map(script => script.scenario)));
}

/**
 * Get all available tags
 */
export function getAllTags(): string[] {
  const allTags = NEGOTIATION_SCRIPTS.flatMap(script => script.tags);
  return Array.from(new Set(allTags)).sort();
}

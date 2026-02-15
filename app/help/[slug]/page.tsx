'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Breadcrumbs from '../../components/Breadcrumbs';

interface ArticleContent {
  id: string;
  title: string;
  category: string;
  icon: string;
  content: {
    introduction: string;
    sections: {
      heading: string;
      content: string | string[];
    }[];
    tips?: string[];
  };
}

const articles: Record<string, ArticleContent> = {
  'quick-start': {
    id: 'quick-start',
    title: 'Quick Start Guide',
    category: 'Getting Started',
    icon: '⚡',
    content: {
      introduction: 'Get up and running with PrepCoach in just 5 minutes. This guide will walk you through everything you need to start practicing interviews and building better resumes.',
      sections: [
        {
          heading: 'Step 1: Create Your Account',
          content: 'Sign up using your email address or Google account. Once verified, you\'ll be taken to your personalized dashboard.',
        },
        {
          heading: 'Step 2: Choose Your Focus',
          content: 'Decide whether you want to start with interview practice, resume building, or LinkedIn optimization. You can do all three, but we recommend starting with one.',
        },
        {
          heading: 'Step 3: Start Your First Session',
          content: [
            'For Interview Practice: Click "Start Practice" and select your industry and role',
            'For Resume Builder: Upload your current resume or start from scratch',
            'For LinkedIn: Enter your profile URL for analysis',
          ],
        },
        {
          heading: 'Step 4: Get AI Feedback',
          content: 'After each session, review your personalized AI feedback. Our system analyzes your responses and provides actionable insights.',
        },
        {
          heading: 'Step 5: Track Your Progress',
          content: 'Visit your dashboard regularly to see how you\'re improving over time. Set goals and watch your confidence scores increase.',
        },
      ],
      tips: [
        'Start with 2-3 practice sessions per week for best results',
        'Enable browser microphone permissions for interview practice',
        'Keep your resume updated as you gain new skills',
      ],
    },
  },
  'create-account': {
    id: 'create-account',
    title: 'Creating Your Account',
    category: 'Getting Started',
    icon: '👤',
    content: {
      introduction: 'Setting up your PrepCoach account is quick and easy. Follow these steps to get started.',
      sections: [
        {
          heading: 'Sign Up Options',
          content: [
            'Email & Password: Use any email address and create a secure password',
            'Google Sign-In: One-click sign-up using your Google account',
          ],
        },
        {
          heading: 'Email Verification',
          content: 'After signing up, check your email for a verification link. Click it to activate your account. If you don\'t see it, check your spam folder.',
        },
        {
          heading: 'Profile Setup',
          content: 'Complete your profile with your name, target role, and industry. This helps us personalize your experience and provide relevant interview questions.',
        },
        {
          heading: 'Choose Your Plan',
          content: 'Start with our Free plan to try out the features, or upgrade to Pro for unlimited practice sessions and advanced feedback.',
        },
      ],
      tips: [
        'Use a professional email address you check regularly',
        'Create a strong password with at least 8 characters',
        'Complete your profile for better personalization',
      ],
    },
  },
  'choose-plan': {
    id: 'choose-plan',
    title: 'Choosing the Right Plan',
    category: 'Getting Started',
    icon: '💎',
    content: {
      introduction: 'PrepCoach offers three plans to fit your needs. Here\'s how to choose the right one for you.',
      sections: [
        {
          heading: 'Free Plan',
          content: 'Perfect for trying out PrepCoach. Includes 5 interview sessions, basic resume analysis, and access to our question library. Great for casual practice.',
        },
        {
          heading: 'Pro Plan - $29/month',
          content: 'Our most popular plan! Unlimited interview practice, advanced AI feedback, resume transformations, LinkedIn optimization, and priority support. Best for active job seekers.',
        },
        {
          heading: 'Enterprise Plan',
          content: 'Custom solutions for teams and organizations. Includes everything in Pro plus team analytics, bulk user management, and dedicated support. Contact us for pricing.',
        },
        {
          heading: 'Which Plan Should I Choose?',
          content: [
            'Free: Just exploring or need occasional practice',
            'Pro: Actively job hunting or preparing for interviews',
            'Enterprise: Managing career development for a team',
          ],
        },
        {
          heading: 'Upgrading Your Plan',
          content: 'You can upgrade or downgrade at any time from your account settings. Changes take effect immediately, and you\'ll only pay the prorated difference.',
        },
      ],
      tips: [
        'Start with Free to test the platform',
        'Upgrade to Pro when you start actively applying',
        'Annual billing saves 20% compared to monthly',
      ],
    },
  },
  'start-interview': {
    id: 'start-interview',
    title: 'Starting Your First Interview',
    category: 'Interview Practice',
    icon: '🎯',
    content: {
      introduction: 'Ready to practice? Here\'s everything you need to know to start your first mock interview session.',
      sections: [
        {
          heading: 'Before You Begin',
          content: [
            'Find a quiet space with minimal background noise',
            'Test your microphone in browser settings',
            'Have a notepad ready for taking notes',
            'Set aside 20-30 minutes without interruptions',
          ],
        },
        {
          heading: 'Selecting Your Interview Type',
          content: 'Choose from Behavioral, Technical, or Situational interviews. For your first session, we recommend starting with Behavioral questions.',
        },
        {
          heading: 'Choosing Your Industry & Role',
          content: 'Select your target industry and job role. This ensures you get relevant questions that match real interviews in your field.',
        },
        {
          heading: 'During the Interview',
          content: 'Read each question carefully, think before responding, and speak clearly. Aim for 1-2 minute answers. The AI will listen and analyze your response.',
        },
        {
          heading: 'After Completion',
          content: 'Review your AI feedback immediately while the interview is fresh in your mind. Focus on one improvement area at a time.',
        },
      ],
      tips: [
        'Treat practice sessions like real interviews',
        'Don\'t worry about perfection on your first try',
        'Review feedback before your next session',
      ],
    },
  },
  'interview-recording': {
    id: 'interview-recording',
    title: 'Recording Your Responses',
    category: 'Interview Practice',
    icon: '🎙️',
    content: {
      introduction: 'Getting clear audio recordings is crucial for accurate AI feedback. Follow these best practices.',
      sections: [
        {
          heading: 'Microphone Setup',
          content: 'When prompted, click "Allow" to grant microphone access. Use a headset or external microphone for best quality. Built-in laptop mics work but may pick up more background noise.',
        },
        {
          heading: 'Test Your Audio',
          content: 'Before starting, do a quick test recording. Speak at your normal interview volume and play it back. Adjust your microphone position if needed.',
        },
        {
          heading: 'Speaking Tips',
          content: [
            'Speak at a normal pace - not too fast or slow',
            'Enunciate clearly without over-pronouncing',
            'Maintain consistent volume throughout',
            'Pause briefly between thoughts',
          ],
        },
        {
          heading: 'Troubleshooting Poor Audio',
          content: 'If the AI has trouble understanding you, check for background noise, move closer to the microphone, or switch to a different device.',
        },
        {
          heading: 'Browser Compatibility',
          content: 'PrepCoach works best on Chrome, Firefox, and Edge. Safari is supported but may have audio limitations on older versions.',
        },
      ],
      tips: [
        'Use headphones to prevent echo feedback',
        'Mute notifications during recording',
        'Speak at the same volume as a real interview',
      ],
    },
  },
  'ai-feedback': {
    id: 'ai-feedback',
    title: 'Understanding AI Feedback',
    category: 'Interview Practice',
    icon: '🤖',
    content: {
      introduction: 'Our AI analyzes multiple aspects of your interview responses. Here\'s how to interpret and act on the feedback.',
      sections: [
        {
          heading: 'Feedback Categories',
          content: [
            'Content Quality: How well you answered the question',
            'Structure: Organization and clarity of your response',
            'Confidence: Tone, pace, and assertiveness',
            'Relevance: Alignment with the question asked',
          ],
        },
        {
          heading: 'Scoring System',
          content: 'Each response receives a score from 1-10. Scores of 7+ are strong, 4-6 need improvement, and below 4 require significant work. Don\'t be discouraged by initial low scores - improvement takes practice.',
        },
        {
          heading: 'Specific Suggestions',
          content: 'Pay attention to the specific improvement suggestions. These are tailored to your actual response and provide actionable next steps.',
        },
        {
          heading: 'Example Answers',
          content: 'When provided, study the example answers. Notice the structure, level of detail, and how they incorporate relevant keywords.',
        },
        {
          heading: 'Tracking Improvement',
          content: 'Your dashboard shows progress over time. Look for upward trends in your average scores and confidence ratings.',
        },
      ],
      tips: [
        'Focus on one improvement area per session',
        'Re-practice questions where you scored below 6',
        'Compare your responses to the examples provided',
      ],
    },
  },
  'interview-types': {
    id: 'interview-types',
    title: 'Interview Question Types',
    category: 'Interview Practice',
    icon: '❓',
    content: {
      introduction: 'PrepCoach supports three main types of interview questions. Understanding each type helps you prepare more effectively.',
      sections: [
        {
          heading: 'Behavioral Questions',
          content: 'These ask about past experiences: "Tell me about a time when..." or "Give me an example of...". Use the STAR method: Situation, Task, Action, Result.',
        },
        {
          heading: 'Technical Questions',
          content: 'Industry or role-specific questions testing your knowledge. Examples: coding problems for developers, case studies for consultants, or technical processes for engineers.',
        },
        {
          heading: 'Situational Questions',
          content: 'Hypothetical scenarios: "What would you do if..." or "How would you handle...". These assess problem-solving and judgment.',
        },
        {
          heading: 'Best Practices for Each Type',
          content: [
            'Behavioral: Always use real examples with specific details',
            'Technical: Think aloud to show your reasoning process',
            'Situational: Explain your thought process step-by-step',
          ],
        },
        {
          heading: 'Mixing Question Types',
          content: 'Most real interviews include all three types. We recommend practicing each type separately first, then doing mixed sessions.',
        },
      ],
      tips: [
        'Prepare 5-7 STAR stories for behavioral questions',
        'Review industry knowledge before technical practice',
        'For situational questions, consider multiple perspectives',
      ],
    },
  },
  'upload-resume': {
    id: 'upload-resume',
    title: 'Uploading Your Resume',
    category: 'Resume Builder',
    icon: '📤',
    content: {
      introduction: 'Get started with resume transformation by uploading your current resume. Here\'s what you need to know.',
      sections: [
        {
          heading: 'Supported Formats',
          content: 'We accept PDF, DOCX, and DOC files. PDFs maintain formatting best, but DOCX allows for easier editing. Maximum file size: 10MB.',
        },
        {
          heading: 'Upload Process',
          content: [
            'Click "Upload Resume" on the Resume Builder page',
            'Select your file or drag and drop it',
            'Wait for processing (usually 10-30 seconds)',
            'Review the extracted content for accuracy',
          ],
        },
        {
          heading: 'What Happens After Upload',
          content: 'Our AI extracts your information including work experience, education, skills, and contact details. You\'ll see a preview to verify everything was captured correctly.',
        },
        {
          heading: 'Editing Extracted Content',
          content: 'If any information was missed or incorrect, you can edit it directly in the builder before proceeding to transformation.',
        },
        {
          heading: 'Privacy & Security',
          content: 'Your resume data is encrypted and stored securely. We never share your information with third parties. You can delete your resume data at any time.',
        },
      ],
      tips: [
        'Use a clean, well-formatted resume for best results',
        'Remove any images or complex graphics before upload',
        'Double-check extracted content before transforming',
      ],
    },
  },
  'transform-resume': {
    id: 'transform-resume',
    title: 'AI Resume Transformation',
    category: 'Resume Builder',
    icon: '✨',
    content: {
      introduction: 'Transform your resume for specific job postings with AI-powered optimization. Here\'s how it works.',
      sections: [
        {
          heading: 'Paste Job Description',
          content: 'Copy the full job posting and paste it into the transformation tool. Include requirements, responsibilities, and preferred qualifications for best results.',
        },
        {
          heading: 'AI Analysis',
          content: 'Our AI compares your experience with the job requirements, identifying key skills and keywords that should be highlighted.',
        },
        {
          heading: 'Transformation Options',
          content: [
            'Full Transformation: Complete rewrite optimized for the role',
            'Enhancement: Keep your content but add relevant keywords',
            'Targeted: Focus on specific sections like experience or skills',
          ],
        },
        {
          heading: 'Review Changes',
          content: 'The AI will show before/after comparisons. Review each change to ensure accuracy and authenticity. You have full control to accept or reject suggestions.',
        },
        {
          heading: 'Multiple Versions',
          content: 'Save different versions for different job applications. Each transformation is stored separately so you can apply to multiple roles.',
        },
      ],
      tips: [
        'Transform your resume for each application',
        'Keep your original resume as a master copy',
        'Review AI suggestions - don\'t accept blindly',
      ],
    },
  },
  'ats-optimization': {
    id: 'ats-optimization',
    title: 'ATS Optimization',
    category: 'Resume Builder',
    icon: '🎯',
    content: {
      introduction: 'Applicant Tracking Systems (ATS) screen resumes before humans see them. Here\'s how to make your resume ATS-friendly.',
      sections: [
        {
          heading: 'What is ATS?',
          content: 'ATS software scans resumes for keywords, formatting, and qualifications. About 75% of resumes are rejected by ATS before reaching a recruiter.',
        },
        {
          heading: 'ATS-Friendly Formatting',
          content: [
            'Use standard fonts (Arial, Calibri, Times New Roman)',
            'Avoid headers, footers, and text boxes',
            'Use standard section headings (Experience, Education, Skills)',
            'Save as .docx for best ATS compatibility',
          ],
        },
        {
          heading: 'Keyword Optimization',
          content: 'Include exact keywords from the job posting. If they say "project management," use that phrase, not "managed projects." Our AI identifies these matches.',
        },
        {
          heading: 'ATS Scoring',
          content: 'PrepCoach shows you an ATS compatibility score. Aim for 80% or higher. We highlight issues and suggest fixes to improve your score.',
        },
        {
          heading: 'Common ATS Mistakes',
          content: [
            'Using images or graphics',
            'Creative formatting or columns',
            'Abbreviations without spelling out',
            'Special characters or symbols',
          ],
        },
      ],
      tips: [
        'Always check ATS score before applying',
        'Use job posting keywords naturally in context',
        'Test your resume with multiple ATS checkers',
      ],
    },
  },
  'download-resume': {
    id: 'download-resume',
    title: 'Downloading & Formats',
    category: 'Resume Builder',
    icon: '💾',
    content: {
      introduction: 'Export your optimized resume in multiple formats. Here are your options and when to use each.',
      sections: [
        {
          heading: 'Available Formats',
          content: [
            'PDF: Best for email applications and maintaining formatting',
            'DOCX: Required by some ATS systems and allows recruiter editing',
            'TXT: Plain text version for online application forms',
          ],
        },
        {
          heading: 'When to Use PDF',
          content: 'Use PDF when emailing directly to recruiters, uploading to your website, or when visual presentation matters. PDFs maintain exact formatting across all devices.',
        },
        {
          heading: 'When to Use DOCX',
          content: 'Some companies require editable formats. DOCX is also better for ATS parsing. Use when the application specifically requests Word format.',
        },
        {
          heading: 'Download Process',
          content: 'Click the download button, select your format, and the file will save to your downloads folder. The filename includes your name and the date.',
        },
        {
          heading: 'Multiple Versions',
          content: 'You can download the same resume in multiple formats. We recommend keeping both PDF and DOCX versions for different application scenarios.',
        },
      ],
      tips: [
        'Name files professionally: FirstName_LastName_Resume.pdf',
        'Keep a master folder with all resume versions',
        'Review the downloaded file before sending',
      ],
    },
  },
  'linkedin-optimize': {
    id: 'linkedin-optimize',
    title: 'LinkedIn Profile Optimization',
    category: 'LinkedIn',
    icon: '🌟',
    content: {
      introduction: 'Optimize your LinkedIn profile to attract recruiters and showcase your professional brand.',
      sections: [
        {
          heading: 'Profile Photo',
          content: 'Use a professional headshot with good lighting and a neutral background. Profiles with photos receive 21x more views than those without.',
        },
        {
          heading: 'Headline Optimization',
          content: 'Your headline should be more than just your job title. Include keywords, specializations, and value proposition. Example: "Senior Product Manager | SaaS | Helping Teams Build User-Centric Solutions"',
        },
        {
          heading: 'About Section',
          content: 'Write in first person and tell your professional story. Include your expertise, achievements, and what you\'re passionate about. Aim for 3-5 short paragraphs.',
        },
        {
          heading: 'Experience Descriptions',
          content: 'Use bullet points, quantify achievements, and include relevant keywords. Mirror the language used in your target industry.',
        },
        {
          heading: 'Skills & Endorsements',
          content: 'Add 20-30 relevant skills. Pin your top 3 most important skills. Request endorsements from colleagues for credibility.',
        },
        {
          heading: 'PrepCoach Analysis',
          content: 'Our AI analyzes your profile and provides specific suggestions to improve each section. We also compare your profile to top performers in your industry.',
        },
      ],
      tips: [
        'Update your profile weekly during job search',
        'Post relevant content to increase visibility',
        'Engage with posts in your industry',
      ],
    },
  },
  'headline-summary': {
    id: 'headline-summary',
    title: 'Writing Effective Headlines',
    category: 'LinkedIn',
    icon: '📝',
    content: {
      introduction: 'Your LinkedIn headline is prime real estate. Here\'s how to make it work for you.',
      sections: [
        {
          heading: 'Headline Formula',
          content: 'Role | Industry/Specialization | Value Proposition. Example: "Data Scientist | Healthcare Analytics | Transforming Patient Data into Actionable Insights"',
        },
        {
          heading: 'Keywords Matter',
          content: 'Include searchable keywords recruiters use. If you\'re a "Software Engineer," say so - don\'t just use "Code Wizard" or creative titles.',
        },
        {
          heading: 'Show Your Value',
          content: 'What problem do you solve? What impact do you make? Add a brief value statement after your role and specialty.',
        },
        {
          heading: 'Examples by Industry',
          content: [
            'Marketing: "Digital Marketing Manager | B2B SaaS | Driving 10x ROI Through Data-Driven Campaigns"',
            'Sales: "Enterprise Sales Executive | Cloud Solutions | $5M+ Annual Revenue | Building Strategic Partnerships"',
            'Engineering: "Full Stack Developer | React & Node.js | Building Scalable Applications for Startups"',
          ],
        },
        {
          heading: 'What to Avoid',
          content: [
            'Generic titles like "Seeking New Opportunities"',
            'Too many emojis or special characters',
            'Buzzwords without substance ("thought leader," "guru")',
            'Listing every skill you have',
          ],
        },
      ],
      tips: [
        'Update your headline when changing careers',
        'Test different versions and track profile views',
        'Keep it under 120 characters for mobile display',
      ],
    },
  },
  'upgrade-plan': {
    id: 'upgrade-plan',
    title: 'Upgrading Your Plan',
    category: 'Billing & Plans',
    icon: '⬆️',
    content: {
      introduction: 'Ready to unlock the full power of PrepCoach? Here\'s how to upgrade your account.',
      sections: [
        {
          heading: 'How to Upgrade',
          content: [
            'Go to Settings > Billing',
            'Click "Upgrade to Pro"',
            'Enter payment information',
            'Confirm your subscription',
          ],
        },
        {
          heading: 'Immediate Access',
          content: 'Once you upgrade, all Pro features are instantly available. You can start unlimited practice sessions right away.',
        },
        {
          heading: 'Billing Cycle',
          content: 'Choose monthly ($29/month) or annual ($290/year - save $58!). You can switch between billing cycles at any time.',
        },
        {
          heading: 'Payment Methods',
          content: 'We accept all major credit cards through Stripe. Your payment information is securely encrypted and never stored on our servers.',
        },
        {
          heading: 'Pro Features Unlocked',
          content: [
            'Unlimited interview practice sessions',
            'Advanced AI feedback with detailed insights',
            'Unlimited resume transformations',
            'LinkedIn profile optimization',
            'Priority email support',
            'Export all session data',
          ],
        },
      ],
      tips: [
        'Annual billing saves almost 2 months',
        'Upgrade before a big interview push',
        'Pro users get new features first',
      ],
    },
  },
  'billing-faq': {
    id: 'billing-faq',
    title: 'Billing Questions',
    category: 'Billing & Plans',
    icon: '💰',
    content: {
      introduction: 'Common questions about billing, payments, and subscriptions.',
      sections: [
        {
          heading: 'When am I charged?',
          content: 'You\'re charged immediately when you upgrade. Subsequent charges happen on the same day each month (monthly) or year (annual).',
        },
        {
          heading: 'Can I get a refund?',
          content: 'We offer a 14-day money-back guarantee. If you\'re not satisfied with Pro, email gideonbosiregj@gmail.com within 14 days for a full refund.',
        },
        {
          heading: 'What happens if payment fails?',
          content: 'We\'ll email you immediately and retry the payment. You have 7 days to update your payment method before your account is downgraded to Free.',
        },
        {
          heading: 'Can I change payment methods?',
          content: 'Yes! Go to Settings > Billing > Update Payment Method. Changes take effect immediately for future charges.',
        },
        {
          heading: 'Do you offer student discounts?',
          content: 'Yes! Students get 50% off Pro with a valid .edu email address. Contact gideonbosiregj@gmail.com to verify your student status.',
        },
        {
          heading: 'What about teams or companies?',
          content: 'We offer Enterprise plans with volume discounts. Contact us for custom pricing based on team size.',
        },
      ],
      tips: [
        'Set a calendar reminder before renewal dates',
        'Keep payment methods up to date',
        'Check your email for payment receipts',
      ],
    },
  },
  'cancel-subscription': {
    id: 'cancel-subscription',
    title: 'Canceling Subscription',
    category: 'Billing & Plans',
    icon: '🛑',
    content: {
      introduction: 'Need to cancel? We\'re sorry to see you go. Here\'s what you need to know.',
      sections: [
        {
          heading: 'How to Cancel',
          content: [
            'Go to Settings > Billing',
            'Click "Cancel Subscription"',
            'Confirm cancellation',
            'You\'ll receive a confirmation email',
          ],
        },
        {
          heading: 'Access Until Period Ends',
          content: 'You keep Pro access until the end of your current billing period. If you cancel on Jan 15 but paid until Feb 1, you have Pro until Feb 1.',
        },
        {
          heading: 'What Happens to Your Data',
          content: 'All your interview sessions, resumes, and progress data are saved. You can reactivate anytime and pick up where you left off.',
        },
        {
          heading: 'Pausing Instead of Canceling',
          content: 'Need a break? Contact gideonbosiregj@gmail.com about pausing your subscription instead of canceling. We can work something out.',
        },
        {
          heading: 'Reactivating Your Subscription',
          content: 'Changed your mind? Just go to Settings > Billing > Reactivate. You\'ll be charged immediately and Pro access resumes.',
        },
      ],
      tips: [
        'Export your data before canceling if needed',
        'Free plan is always available',
        'We\'d love feedback on why you\'re leaving',
      ],
    },
  },
  'audio-issues': {
    id: 'audio-issues',
    title: 'Audio Recording Problems',
    category: 'Troubleshooting',
    icon: '🔊',
    content: {
      introduction: 'Having trouble with audio during interview practice? Here are solutions to common problems.',
      sections: [
        {
          heading: 'Microphone Not Detected',
          content: [
            'Check browser permissions: Click the lock icon in address bar > Allow microphone',
            'Ensure your microphone is plugged in and set as default device',
            'Try a different browser (Chrome recommended)',
            'Restart your browser and try again',
          ],
        },
        {
          heading: 'Poor Audio Quality',
          content: 'Background noise, echo, or muffled sound? Move to a quieter location, use headphones to prevent echo, position microphone 6-12 inches from your mouth, and close other apps using your microphone.',
        },
        {
          heading: 'Recording Cuts Out',
          content: 'If your recording stops randomly, check your internet connection stability, close bandwidth-heavy apps, disable browser extensions that might interfere, and try reducing the length of individual responses.',
        },
        {
          heading: 'AI Can\'t Understand My Recording',
          content: 'Speak more slowly and clearly, reduce background noise, check recording volume levels, and ensure you\'re speaking in a supported language (English).',
        },
        {
          heading: 'System Requirements',
          content: 'Modern browser (Chrome 90+, Firefox 88+, Edge 90+), working microphone, stable internet (5+ Mbps recommended), and microphone permissions enabled.',
        },
      ],
      tips: [
        'Test your microphone before important practice sessions',
        'Use a wired headset for best reliability',
        'Clear your browser cache if problems persist',
      ],
    },
  },
  'login-issues': {
    id: 'login-issues',
    title: 'Login & Access Issues',
    category: 'Troubleshooting',
    icon: '🔐',
    content: {
      introduction: 'Can\'t access your account? Here\'s how to troubleshoot login problems.',
      sections: [
        {
          heading: 'Forgot Password',
          content: [
            'Click "Forgot Password" on the login page',
            'Enter your email address',
            'Check email for reset link (check spam folder)',
            'Create a new password',
          ],
        },
        {
          heading: 'Email Not Recognized',
          content: 'Double-check spelling and try the email you used to sign up. If you used Google Sign-In, use that option instead of email/password. Still stuck? Contact support with your name and approximate signup date.',
        },
        {
          heading: 'Account Locked',
          content: 'After 5 failed login attempts, accounts are temporarily locked for security. Wait 15 minutes and try again, or use the password reset option to unlock immediately.',
        },
        {
          heading: 'Google Sign-In Not Working',
          content: 'Clear browser cookies and cache, check that you\'re using the Google account you signed up with, disable popup blockers, and try a different browser.',
        },
        {
          heading: 'Session Expired Messages',
          content: 'You\'re automatically logged out after 30 days of inactivity or if you log in on another device. Simply log in again to continue.',
        },
      ],
      tips: [
        'Use a password manager to avoid forgotten passwords',
        'Keep your email address up to date',
        'Enable two-factor authentication for extra security',
      ],
    },
  },
  'browser-support': {
    id: 'browser-support',
    title: 'Browser Compatibility',
    category: 'Troubleshooting',
    icon: '🌐',
    content: {
      introduction: 'PrepCoach works best on modern browsers. Here\'s what you need to know about compatibility.',
      sections: [
        {
          heading: 'Recommended Browsers',
          content: [
            'Chrome 90+ (Best experience)',
            'Firefox 88+ (Fully supported)',
            'Edge 90+ (Fully supported)',
            'Safari 14+ (Limited - audio features may vary)',
          ],
        },
        {
          heading: 'Required Browser Features',
          content: 'JavaScript enabled, cookies enabled, microphone access for interview practice, and local storage enabled. Most modern browsers support these by default.',
        },
        {
          heading: 'Known Browser Issues',
          content: [
            'Safari on iOS: Some audio recording limitations',
            'Internet Explorer: Not supported',
            'Firefox on iOS: Limited audio support',
            'Opera: Mostly works but not officially tested',
          ],
        },
        {
          heading: 'Updating Your Browser',
          content: 'Always use the latest browser version for best security and performance. Most browsers auto-update. Check your version in Settings > About.',
        },
        {
          heading: 'Mobile Browsers',
          content: 'PrepCoach is mobile-responsive and works on phones/tablets. For interview recording, we recommend desktop for the best experience. Resume building works great on mobile.',
        },
        {
          heading: 'Troubleshooting Browser Problems',
          content: 'Clear cache and cookies, disable browser extensions, try incognito/private mode, restart your browser, and update to the latest version.',
        },
      ],
      tips: [
        'Use Chrome for the most reliable experience',
        'Keep your browser updated for security',
        'Disable ad blockers on PrepCoach if you encounter issues',
      ],
    },
  },
};

export default function HelpArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const article = articles[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-6">📄</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            We couldn&apos;t find the help article you&apos;re looking for.
          </p>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Help Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Article Header */}
        <div className="mb-8">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Help Center
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{article.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-orange-600 mb-2">{article.category}</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{article.title}</h1>
            </div>
          </div>

          <p className="text-lg text-gray-600">{article.content.introduction}</p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 sm:p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {article.content.sections.map((section, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-orange-500">→</span>
                  {section.heading}
                </h2>
                {typeof section.content === 'string' ? (
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                ) : (
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Tips Section */}
          {article.content.tips && article.content.tips.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Pro Tips
              </h3>
              <ul className="space-y-2">
                {article.content.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-orange-500 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Related Articles */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 sm:p-8 border-2 border-orange-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need More Help?</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/help"
              className="flex-1 flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div>
                <div className="font-semibold text-gray-900">Browse All Articles</div>
                <div className="text-sm text-gray-600">Explore the help center</div>
              </div>
            </Link>
            <a
              href="mailto:gideonbosiregj@gmail.com"
              className="flex-1 flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl hover:shadow-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="font-semibold">Contact Support</div>
                <div className="text-sm text-white/80">We&apos;re here to help</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

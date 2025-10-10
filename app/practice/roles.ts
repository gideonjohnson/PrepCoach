export interface Role {
  id: string;
  title: string;
  company: string;
  level: string;
  description: string;
  category: string;
}

export const roles: Role[] = [
  // Technology (45 roles)
  {
    id: '1',
    title: 'Software Engineer I (Frontend)',
    company: 'Meta',
    level: 'Entry-Level',
    description: 'Build UI components, fix bugs, and learn React, TypeScript, and frontend best practices.',
    category: 'Technology'
  },
  {
    id: '1a',
    title: 'Software Engineer II (Frontend)',
    company: 'Airbnb',
    level: 'Mid-Level',
    description: 'Design and implement features, optimize performance, and mentor junior engineers.',
    category: 'Technology'
  },
  {
    id: '1b',
    title: 'Software Engineer III (Frontend)',
    company: 'Google',
    level: 'Senior',
    description: 'Lead frontend architecture, set technical direction, and drive cross-team initiatives.',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Software Engineer I (Backend)',
    company: 'Stripe',
    level: 'Entry-Level',
    description: 'Develop APIs, write tests, and learn backend systems and database design.',
    category: 'Technology'
  },
  {
    id: '2a',
    title: 'Software Engineer II (Backend)',
    company: 'Uber',
    level: 'Mid-Level',
    description: 'Design scalable services, optimize databases, and implement microservices.',
    category: 'Technology'
  },
  {
    id: '2b',
    title: 'Software Engineer III (Backend)',
    company: 'Amazon',
    level: 'Senior',
    description: 'Architect distributed systems, lead technical designs, and drive engineering excellence.',
    category: 'Technology'
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'Shopify',
    level: 'Mid-Level',
    description: 'Develop end-to-end features for e-commerce platform, working across frontend and backend technologies.',
    category: 'Technology'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'Netflix',
    level: 'Senior',
    description: 'Maintain CI/CD pipelines, infrastructure automation, and cloud platform reliability for streaming services.',
    category: 'Technology'
  },
  {
    id: '5',
    title: 'Site Reliability Engineer',
    company: 'Google',
    level: 'Senior',
    description: 'Ensure system reliability, performance monitoring, and incident response for large-scale distributed systems.',
    category: 'Technology'
  },
  {
    id: '6',
    title: 'Cloud Architect',
    company: 'Amazon Web Services',
    level: 'Lead',
    description: 'Design and implement enterprise cloud solutions, migration strategies, and multi-cloud architectures.',
    category: 'Technology'
  },
  {
    id: '7',
    title: 'Security Engineer',
    company: 'CrowdStrike',
    level: 'Senior',
    description: 'Develop security tools, conduct vulnerability assessments, and implement threat detection systems.',
    category: 'Technology'
  },
  {
    id: '8',
    title: 'Mobile Engineer (iOS)',
    company: 'Uber',
    level: 'Mid-Level',
    description: 'Build and maintain iOS applications using Swift, focusing on performance and user experience.',
    category: 'Technology'
  },
  {
    id: '9',
    title: 'Mobile Engineer (Android)',
    company: 'Spotify',
    level: 'Senior',
    description: 'Develop Android applications using Kotlin, implement new features for music streaming platform.',
    category: 'Technology'
  },
  {
    id: '10',
    title: 'AI/ML Engineer',
    company: 'OpenAI',
    level: 'Senior',
    description: 'Build and deploy machine learning models, optimize AI systems, and work on large language models.',
    category: 'Technology'
  },
  {
    id: '11',
    title: 'Platform Engineer',
    company: 'Airbnb',
    level: 'Senior',
    description: 'Build internal developer platforms, tooling, and infrastructure to accelerate engineering productivity.',
    category: 'Technology'
  },
  {
    id: '12',
    title: 'Engineering Manager',
    company: 'Microsoft',
    level: 'Lead',
    description: 'Lead engineering teams, manage technical roadmaps, and drive execution of strategic initiatives.',
    category: 'Technology'
  },
  {
    id: '13',
    title: 'Principal Engineer',
    company: 'Apple',
    level: 'Lead',
    description: 'Define technical strategy, architect complex systems, and mentor senior engineers across the organization.',
    category: 'Technology'
  },
  {
    id: '14',
    title: 'Software Engineer Intern',
    company: 'Dropbox',
    level: 'Entry-Level',
    description: 'Contribute to real-world projects, collaborate with engineering teams, and learn software development best practices.',
    category: 'Technology'
  },
  {
    id: '15',
    title: 'QA Engineer',
    company: 'Tesla',
    level: 'Mid-Level',
    description: 'Design and execute test plans, automate testing processes, and ensure software quality for automotive systems.',
    category: 'Technology'
  },
  {
    id: '16',
    title: 'Database Administrator',
    company: 'Oracle',
    level: 'Senior',
    description: 'Manage database systems, optimize performance, ensure data integrity, and implement backup strategies.',
    category: 'Technology'
  },
  {
    id: '17',
    title: 'Blockchain Engineer',
    company: 'Coinbase',
    level: 'Senior',
    description: 'Develop smart contracts, build decentralized applications, and maintain blockchain infrastructure.',
    category: 'Technology'
  },
  {
    id: '18',
    title: 'Game Developer',
    company: 'Epic Games',
    level: 'Mid-Level',
    description: 'Create game mechanics, optimize performance, and implement features using Unreal Engine.',
    category: 'Technology'
  },
  {
    id: '19',
    title: 'Embedded Systems Engineer',
    company: 'SpaceX',
    level: 'Senior',
    description: 'Design and develop embedded software for spacecraft systems, focusing on real-time performance.',
    category: 'Technology'
  },
  {
    id: '20',
    title: 'Network Engineer',
    company: 'Cisco',
    level: 'Mid-Level',
    description: 'Design, implement, and maintain network infrastructure, troubleshoot connectivity issues.',
    category: 'Technology'
  },
  {
    id: '21',
    title: 'Systems Engineer',
    company: 'IBM',
    level: 'Senior',
    description: 'Maintain enterprise systems, implement server infrastructure, and ensure system availability.',
    category: 'Technology'
  },
  {
    id: '22',
    title: 'Solutions Architect',
    company: 'Salesforce',
    level: 'Lead',
    description: 'Design technical solutions for enterprise clients, lead implementation projects, and provide technical guidance.',
    category: 'Technology'
  },
  {
    id: '23',
    title: 'API Developer',
    company: 'Twilio',
    level: 'Mid-Level',
    description: 'Build and maintain RESTful APIs, design API documentation, and ensure API performance and reliability.',
    category: 'Technology'
  },
  {
    id: '24',
    title: 'Computer Vision Engineer',
    company: 'NVIDIA',
    level: 'Senior',
    description: 'Develop computer vision algorithms, implement image processing pipelines, and optimize GPU performance.',
    category: 'Technology'
  },
  {
    id: '25',
    title: 'Robotics Engineer',
    company: 'Boston Dynamics',
    level: 'Senior',
    description: 'Design control systems for robots, implement motion planning algorithms, and conduct hardware integration.',
    category: 'Technology'
  },
  {
    id: '26',
    title: 'Cybersecurity Analyst',
    company: 'Palo Alto Networks',
    level: 'Mid-Level',
    description: 'Monitor security threats, conduct penetration testing, and respond to security incidents.',
    category: 'Technology'
  },
  {
    id: '27',
    title: 'Technical Lead',
    company: 'LinkedIn',
    level: 'Lead',
    description: 'Lead technical teams, make architectural decisions, and drive engineering best practices.',
    category: 'Technology'
  },
  {
    id: '28',
    title: 'Performance Engineer',
    company: 'Twitter',
    level: 'Senior',
    description: 'Optimize application performance, conduct load testing, and improve system scalability.',
    category: 'Technology'
  },
  {
    id: '29',
    title: 'Integration Engineer',
    company: 'Workday',
    level: 'Mid-Level',
    description: 'Build integrations between enterprise systems, implement ETL processes, and maintain data pipelines.',
    category: 'Technology'
  },
  {
    id: '30',
    title: 'Infrastructure Engineer',
    company: 'DigitalOcean',
    level: 'Senior',
    description: 'Manage cloud infrastructure, implement infrastructure as code, and ensure platform reliability.',
    category: 'Technology'
  },
  {
    id: '31',
    title: 'Release Manager',
    company: 'Atlassian',
    level: 'Mid-Level',
    description: 'Coordinate software releases, manage deployment schedules, and ensure smooth production rollouts.',
    category: 'Technology'
  },
  {
    id: '32',
    title: 'Automation Engineer',
    company: 'UiPath',
    level: 'Mid-Level',
    description: 'Develop automation scripts, implement RPA solutions, and optimize business processes.',
    category: 'Technology'
  },
  {
    id: '33',
    title: 'Firmware Engineer',
    company: 'Intel',
    level: 'Senior',
    description: 'Develop low-level software for hardware devices, optimize performance, and implement device drivers.',
    category: 'Technology'
  },
  {
    id: '34',
    title: 'VR/AR Developer',
    company: 'Meta Reality Labs',
    level: 'Senior',
    description: 'Build immersive virtual and augmented reality experiences, optimize 3D rendering performance.',
    category: 'Technology'
  },
  {
    id: '35',
    title: 'Software Architect',
    company: 'Adobe',
    level: 'Lead',
    description: 'Define software architecture patterns, establish technical standards, and guide engineering teams.',
    category: 'Technology'
  },
  {
    id: '36',
    title: 'Cloud Security Engineer',
    company: 'Cloudflare',
    level: 'Senior',
    description: 'Implement cloud security controls, conduct security audits, and ensure compliance with standards.',
    category: 'Technology'
  },
  {
    id: '37',
    title: 'IoT Engineer',
    company: 'Samsung',
    level: 'Mid-Level',
    description: 'Develop IoT solutions, implement device connectivity, and build data collection systems.',
    category: 'Technology'
  },
  {
    id: '38',
    title: 'Search Engineer',
    company: 'Elasticsearch',
    level: 'Senior',
    description: 'Build and optimize search systems, implement ranking algorithms, and improve search relevance.',
    category: 'Technology'
  },
  {
    id: '39',
    title: 'Video Streaming Engineer',
    company: 'YouTube',
    level: 'Senior',
    description: 'Optimize video delivery, implement adaptive streaming protocols, and ensure playback quality.',
    category: 'Technology'
  },
  {
    id: '40',
    title: 'Build Engineer',
    company: 'GitLab',
    level: 'Mid-Level',
    description: 'Maintain build systems, optimize compilation times, and manage dependency management.',
    category: 'Technology'
  },
  {
    id: '41',
    title: 'Technical Writer',
    company: 'MongoDB',
    level: 'Mid-Level',
    description: 'Create technical documentation, API guides, and developer tutorials for database products.',
    category: 'Technology'
  },
  {
    id: '42',
    title: 'Developer Advocate',
    company: 'HashiCorp',
    level: 'Senior',
    description: 'Engage with developer communities, create technical content, and represent company at conferences.',
    category: 'Technology'
  },
  {
    id: '43',
    title: 'Site Performance Engineer',
    company: 'Akamai',
    level: 'Senior',
    description: 'Optimize web performance, implement CDN strategies, and improve page load times.',
    category: 'Technology'
  },
  {
    id: '44',
    title: 'Compiler Engineer',
    company: 'JetBrains',
    level: 'Senior',
    description: 'Develop compiler optimizations, implement language features, and improve compilation performance.',
    category: 'Technology'
  },
  {
    id: '45',
    title: 'Junior Software Engineer',
    company: 'Startup Inc.',
    level: 'Entry-Level',
    description: 'Learn software development practices, contribute to feature development, and collaborate with senior engineers.',
    category: 'Technology'
  },

  // Data Science (18 roles)
  {
    id: '46',
    title: 'Data Scientist I',
    company: 'Netflix',
    level: 'Entry-Level',
    description: 'Develop basic ML models, clean data, and support senior data scientists with analytics projects.',
    category: 'Data Science'
  },
  {
    id: '46a',
    title: 'Data Scientist II',
    company: 'Spotify',
    level: 'Mid-Level',
    description: 'Build predictive models, design experiments, and deliver insights to product teams.',
    category: 'Data Science'
  },
  {
    id: '46b',
    title: 'Data Scientist III (Senior)',
    company: 'Meta',
    level: 'Senior',
    description: 'Lead data science initiatives, mentor team members, and drive strategic decision-making with advanced analytics.',
    category: 'Data Science'
  },
  {
    id: '47',
    title: 'Machine Learning Engineer',
    company: 'Tesla',
    level: 'Senior',
    description: 'Develop ML models for autonomous driving, train neural networks, and optimize model performance.',
    category: 'Data Science'
  },
  {
    id: '48',
    title: 'Data Analyst',
    company: 'Amazon',
    level: 'Mid-Level',
    description: 'Analyze business metrics, create dashboards, and provide data-driven recommendations to stakeholders.',
    category: 'Data Science'
  },
  {
    id: '49',
    title: 'Research Scientist',
    company: 'DeepMind',
    level: 'Lead',
    description: 'Conduct cutting-edge AI research, publish papers, and develop novel machine learning algorithms.',
    category: 'Data Science'
  },
  {
    id: '50',
    title: 'Business Intelligence Analyst',
    company: 'Walmart',
    level: 'Mid-Level',
    description: 'Build BI reports, analyze retail trends, and create visualizations to support business decisions.',
    category: 'Data Science'
  },
  {
    id: '51',
    title: 'NLP Engineer',
    company: 'Google AI',
    level: 'Senior',
    description: 'Develop natural language processing models, improve language understanding systems, and conduct research.',
    category: 'Data Science'
  },
  {
    id: '52',
    title: 'Data Engineer',
    company: 'Airbnb',
    level: 'Senior',
    description: 'Build data pipelines, maintain data warehouse, and ensure data quality and availability.',
    category: 'Data Science'
  },
  {
    id: '53',
    title: 'Analytics Manager',
    company: 'Uber',
    level: 'Lead',
    description: 'Lead analytics team, define metrics strategy, and deliver insights for business growth.',
    category: 'Data Science'
  },
  {
    id: '54',
    title: 'Quantitative Analyst',
    company: 'Two Sigma',
    level: 'Senior',
    description: 'Develop trading algorithms, analyze financial data, and build predictive models for investment strategies.',
    category: 'Data Science'
  },
  {
    id: '55',
    title: 'AI Research Engineer',
    company: 'Microsoft Research',
    level: 'Senior',
    description: 'Research and implement AI systems, collaborate on research publications, and develop prototypes.',
    category: 'Data Science'
  },
  {
    id: '56',
    title: 'Computer Vision Scientist',
    company: 'Waymo',
    level: 'Senior',
    description: 'Research computer vision techniques for autonomous vehicles, develop perception algorithms.',
    category: 'Data Science'
  },
  {
    id: '57',
    title: 'Data Science Intern',
    company: 'Meta',
    level: 'Entry-Level',
    description: 'Work on data analysis projects, learn ML techniques, and contribute to data-driven initiatives.',
    category: 'Data Science'
  },
  {
    id: '58',
    title: 'MLOps Engineer',
    company: 'DataRobot',
    level: 'Senior',
    description: 'Deploy ML models to production, build ML infrastructure, and monitor model performance.',
    category: 'Data Science'
  },
  {
    id: '59',
    title: 'Statistician',
    company: 'Pharmaceutical Research Corp',
    level: 'Senior',
    description: 'Design experiments, conduct statistical analysis, and interpret clinical trial data.',
    category: 'Data Science'
  },
  {
    id: '60',
    title: 'Data Visualization Specialist',
    company: 'Tableau',
    level: 'Mid-Level',
    description: 'Create interactive dashboards, design data visualizations, and help clients understand their data.',
    category: 'Data Science'
  },
  {
    id: '61',
    title: 'Applied Scientist',
    company: 'Amazon Web Services',
    level: 'Senior',
    description: 'Apply machine learning to solve business problems, develop ML products, and conduct research.',
    category: 'Data Science'
  },
  {
    id: '62',
    title: 'Lead Data Scientist',
    company: 'Spotify',
    level: 'Lead',
    description: 'Lead data science initiatives, mentor team members, and drive ML strategy for personalization.',
    category: 'Data Science'
  },
  {
    id: '63',
    title: 'Predictive Modeler',
    company: 'Insurance Analytics Co.',
    level: 'Mid-Level',
    description: 'Build predictive models for risk assessment, analyze claims data, and optimize pricing strategies.',
    category: 'Data Science'
  },

  // Product (17 roles)
  {
    id: '64',
    title: 'Product Manager',
    company: 'Google',
    level: 'Senior',
    description: 'Define product strategy, prioritize features, and work with engineering teams to deliver user value.',
    category: 'Product'
  },
  {
    id: '65',
    title: 'Senior Product Manager',
    company: 'Meta',
    level: 'Lead',
    description: 'Lead product vision, manage cross-functional teams, and drive strategic product initiatives.',
    category: 'Product'
  },
  {
    id: '66',
    title: 'Technical Product Manager',
    company: 'Amazon',
    level: 'Senior',
    description: 'Manage technical products, work closely with engineering, and translate technical capabilities into features.',
    category: 'Product'
  },
  {
    id: '67',
    title: 'Product Owner',
    company: 'Atlassian',
    level: 'Mid-Level',
    description: 'Manage product backlog, define user stories, and ensure team delivers value to customers.',
    category: 'Product'
  },
  {
    id: '68',
    title: 'Growth Product Manager',
    company: 'Dropbox',
    level: 'Senior',
    description: 'Drive user acquisition and retention, run experiments, and optimize conversion funnels.',
    category: 'Product'
  },
  {
    id: '69',
    title: 'Associate Product Manager',
    company: 'Stripe',
    level: 'Entry-Level',
    description: 'Support product development, conduct user research, and learn product management best practices.',
    category: 'Product'
  },
  {
    id: '70',
    title: 'Director of Product',
    company: 'Salesforce',
    level: 'Director',
    description: 'Lead product organization, define company product strategy, and manage product leadership team.',
    category: 'Product'
  },
  {
    id: '71',
    title: 'Platform Product Manager',
    company: 'Shopify',
    level: 'Senior',
    description: 'Manage platform products, build developer tools, and create API strategies.',
    category: 'Product'
  },
  {
    id: '72',
    title: 'Product Marketing Manager',
    company: 'HubSpot',
    level: 'Mid-Level',
    description: 'Develop go-to-market strategies, create product messaging, and launch new features.',
    category: 'Product'
  },
  {
    id: '73',
    title: 'AI Product Manager',
    company: 'OpenAI',
    level: 'Senior',
    description: 'Manage AI-powered products, define ML product requirements, and work with research teams.',
    category: 'Product'
  },
  {
    id: '74',
    title: 'Data Product Manager',
    company: 'Snowflake',
    level: 'Senior',
    description: 'Manage data products, define analytics features, and work with data engineering teams.',
    category: 'Product'
  },
  {
    id: '75',
    title: 'Mobile Product Manager',
    company: 'Instagram',
    level: 'Senior',
    description: 'Define mobile app strategy, prioritize iOS and Android features, and optimize mobile experiences.',
    category: 'Product'
  },
  {
    id: '76',
    title: 'Product Operations Manager',
    company: 'Asana',
    level: 'Mid-Level',
    description: 'Streamline product processes, manage product tools, and enable product team efficiency.',
    category: 'Product'
  },
  {
    id: '77',
    title: 'Hardware Product Manager',
    company: 'Apple',
    level: 'Senior',
    description: 'Manage hardware product development, coordinate with engineering and design, launch new devices.',
    category: 'Product'
  },
  {
    id: '78',
    title: 'Enterprise Product Manager',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Manage enterprise software products, work with B2B customers, and define enterprise features.',
    category: 'Product'
  },
  {
    id: '79',
    title: 'Product Analyst',
    company: 'Airbnb',
    level: 'Mid-Level',
    description: 'Analyze product metrics, conduct A/B tests, and provide insights to inform product decisions.',
    category: 'Product'
  },
  {
    id: '80',
    title: 'Group Product Manager',
    company: 'LinkedIn',
    level: 'Lead',
    description: 'Manage multiple product managers, define product area strategy, and coordinate cross-team initiatives.',
    category: 'Product'
  },

  // Design (17 roles)
  {
    id: '81',
    title: 'UX Designer',
    company: 'Apple',
    level: 'Mid-Level',
    description: 'Design user experiences, create wireframes and prototypes, and conduct usability research.',
    category: 'Design'
  },
  {
    id: '82',
    title: 'UI Designer',
    company: 'Adobe',
    level: 'Mid-Level',
    description: 'Create visual designs, design systems, and ensure consistent brand experience across products.',
    category: 'Design'
  },
  {
    id: '83',
    title: 'Product Designer',
    company: 'Airbnb',
    level: 'Senior',
    description: 'Design end-to-end product experiences, collaborate with product and engineering teams.',
    category: 'Design'
  },
  {
    id: '84',
    title: 'UX Researcher',
    company: 'Google',
    level: 'Senior',
    description: 'Conduct user research studies, analyze user behavior, and provide insights to design teams.',
    category: 'Design'
  },
  {
    id: '85',
    title: 'Interaction Designer',
    company: 'Meta',
    level: 'Senior',
    description: 'Design interactive experiences, create animations and transitions, and prototype new interactions.',
    category: 'Design'
  },
  {
    id: '86',
    title: 'Design Lead',
    company: 'Spotify',
    level: 'Lead',
    description: 'Lead design team, define design strategy, and ensure high-quality design execution.',
    category: 'Design'
  },
  {
    id: '87',
    title: 'Graphic Designer',
    company: 'Nike',
    level: 'Mid-Level',
    description: 'Create marketing materials, design brand assets, and produce visual content for campaigns.',
    category: 'Design'
  },
  {
    id: '88',
    title: 'Motion Designer',
    company: 'Netflix',
    level: 'Mid-Level',
    description: 'Create motion graphics, design animations, and produce video content for UI and marketing.',
    category: 'Design'
  },
  {
    id: '89',
    title: 'Brand Designer',
    company: 'Notion',
    level: 'Senior',
    description: 'Define brand identity, create brand guidelines, and ensure consistent brand expression.',
    category: 'Design'
  },
  {
    id: '90',
    title: 'Design Systems Designer',
    company: 'Figma',
    level: 'Senior',
    description: 'Build and maintain design systems, create component libraries, and establish design standards.',
    category: 'Design'
  },
  {
    id: '91',
    title: 'Visual Designer',
    company: 'Squarespace',
    level: 'Mid-Level',
    description: 'Create visual designs for web and mobile, design marketing materials, and maintain brand consistency.',
    category: 'Design'
  },
  {
    id: '92',
    title: 'UX Writer',
    company: 'Dropbox',
    level: 'Mid-Level',
    description: 'Write product copy, create microcopy, and ensure clear and consistent product communication.',
    category: 'Design'
  },
  {
    id: '93',
    title: 'Service Designer',
    company: 'IBM',
    level: 'Senior',
    description: 'Design end-to-end service experiences, map customer journeys, and optimize touchpoints.',
    category: 'Design'
  },
  {
    id: '94',
    title: '3D Designer',
    company: 'Meta Reality Labs',
    level: 'Senior',
    description: 'Create 3D models and environments, design VR/AR experiences, and optimize 3D assets.',
    category: 'Design'
  },
  {
    id: '95',
    title: 'Design Manager',
    company: 'Uber',
    level: 'Lead',
    description: 'Manage design team, set design vision, and collaborate with product and engineering leadership.',
    category: 'Design'
  },
  {
    id: '96',
    title: 'Accessibility Designer',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Ensure products are accessible, design inclusive experiences, and advocate for accessibility standards.',
    category: 'Design'
  },
  {
    id: '97',
    title: 'Junior Designer',
    company: 'Design Studio Co.',
    level: 'Entry-Level',
    description: 'Support design projects, create mockups, and learn design tools and methodologies.',
    category: 'Design'
  },

  // Marketing (22 roles)
  {
    id: '98',
    title: 'Digital Marketing Manager',
    company: 'Amazon',
    level: 'Senior',
    description: 'Develop digital marketing strategies, manage campaigns across channels, and optimize ROI.',
    category: 'Marketing'
  },
  {
    id: '99',
    title: 'Content Marketing Manager',
    company: 'HubSpot',
    level: 'Senior',
    description: 'Create content strategy, manage content calendar, and produce high-quality marketing content.',
    category: 'Marketing'
  },
  {
    id: '100',
    title: 'SEO Specialist',
    company: 'Moz',
    level: 'Mid-Level',
    description: 'Optimize website for search engines, conduct keyword research, and improve organic rankings.',
    category: 'Marketing'
  },
  {
    id: '101',
    title: 'Brand Manager',
    company: 'Coca-Cola',
    level: 'Senior',
    description: 'Manage brand strategy, develop brand campaigns, and ensure consistent brand messaging.',
    category: 'Marketing'
  },
  {
    id: '102',
    title: 'Growth Marketing Manager',
    company: 'Stripe',
    level: 'Senior',
    description: 'Drive user acquisition, optimize conversion funnels, and run growth experiments.',
    category: 'Marketing'
  },
  {
    id: '103',
    title: 'Email Marketing Specialist',
    company: 'Mailchimp',
    level: 'Mid-Level',
    description: 'Create email campaigns, optimize email performance, and manage email automation workflows.',
    category: 'Marketing'
  },
  {
    id: '104',
    title: 'Social Media Manager',
    company: 'Twitter',
    level: 'Mid-Level',
    description: 'Manage social media presence, create content calendars, and engage with online communities.',
    category: 'Marketing'
  },
  {
    id: '105',
    title: 'Performance Marketing Manager',
    company: 'Airbnb',
    level: 'Senior',
    description: 'Manage paid advertising campaigns, optimize ad spend, and drive measurable marketing results.',
    category: 'Marketing'
  },
  {
    id: '106',
    title: 'Marketing Operations Manager',
    company: 'Salesforce',
    level: 'Senior',
    description: 'Manage marketing technology stack, optimize marketing processes, and enable team efficiency.',
    category: 'Marketing'
  },
  {
    id: '107',
    title: 'Demand Generation Manager',
    company: 'Adobe',
    level: 'Senior',
    description: 'Generate qualified leads, manage demand gen campaigns, and optimize lead nurturing programs.',
    category: 'Marketing'
  },
  {
    id: '108',
    title: 'Marketing Analyst',
    company: 'Google',
    level: 'Mid-Level',
    description: 'Analyze marketing data, measure campaign performance, and provide insights for optimization.',
    category: 'Marketing'
  },
  {
    id: '109',
    title: 'Influencer Marketing Manager',
    company: 'Instagram',
    level: 'Mid-Level',
    description: 'Manage influencer partnerships, coordinate campaigns, and measure influencer marketing ROI.',
    category: 'Marketing'
  },
  {
    id: '110',
    title: 'Product Marketing Lead',
    company: 'Slack',
    level: 'Lead',
    description: 'Lead product launches, develop messaging and positioning, and enable sales teams.',
    category: 'Marketing'
  },
  {
    id: '111',
    title: 'Marketing Director',
    company: 'Nike',
    level: 'Director',
    description: 'Lead marketing organization, set marketing strategy, and drive brand growth initiatives.',
    category: 'Marketing'
  },
  {
    id: '112',
    title: 'Event Marketing Manager',
    company: 'Salesforce',
    level: 'Senior',
    description: 'Plan and execute events, manage event logistics, and drive event marketing strategy.',
    category: 'Marketing'
  },
  {
    id: '113',
    title: 'Affiliate Marketing Manager',
    company: 'Amazon Associates',
    level: 'Mid-Level',
    description: 'Manage affiliate programs, recruit partners, and optimize affiliate marketing performance.',
    category: 'Marketing'
  },
  {
    id: '114',
    title: 'Marketing Automation Specialist',
    company: 'Marketo',
    level: 'Mid-Level',
    description: 'Build marketing automation workflows, manage nurture campaigns, and optimize lead scoring.',
    category: 'Marketing'
  },
  {
    id: '115',
    title: 'Community Manager',
    company: 'Reddit',
    level: 'Mid-Level',
    description: 'Build and engage online communities, moderate discussions, and foster user engagement.',
    category: 'Marketing'
  },
  {
    id: '116',
    title: 'Paid Search Specialist',
    company: 'Google Ads',
    level: 'Mid-Level',
    description: 'Manage PPC campaigns, optimize ad copy and bidding, and improve campaign performance.',
    category: 'Marketing'
  },
  {
    id: '117',
    title: 'Conversion Rate Optimizer',
    company: 'Optimizely',
    level: 'Senior',
    description: 'Run A/B tests, optimize landing pages, and improve conversion rates across customer journey.',
    category: 'Marketing'
  },
  {
    id: '118',
    title: 'Marketing Coordinator',
    company: 'Tech Startup',
    level: 'Entry-Level',
    description: 'Support marketing initiatives, coordinate campaigns, and assist with content creation.',
    category: 'Marketing'
  },
  {
    id: '119',
    title: 'PR Manager',
    company: 'Apple',
    level: 'Senior',
    description: 'Manage public relations, handle media inquiries, and develop PR strategies for product launches.',
    category: 'Marketing'
  },

  // Sales (22 roles)
  {
    id: '120',
    title: 'Sales Development Representative',
    company: 'Salesforce',
    level: 'Entry-Level',
    description: 'Generate qualified leads, conduct outreach, and schedule meetings for account executives.',
    category: 'Sales'
  },
  {
    id: '121',
    title: 'Account Executive',
    company: 'Oracle',
    level: 'Mid-Level',
    description: 'Close deals, manage sales cycles, and build relationships with prospective customers.',
    category: 'Sales'
  },
  {
    id: '122',
    title: 'Enterprise Sales Executive',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Sell to Fortune 500 companies, manage complex sales cycles, and close large enterprise deals.',
    category: 'Sales'
  },
  {
    id: '123',
    title: 'Inside Sales Representative',
    company: 'HubSpot',
    level: 'Mid-Level',
    description: 'Sell products remotely, conduct demos, and manage pipeline through phone and video calls.',
    category: 'Sales'
  },
  {
    id: '124',
    title: 'Customer Success Manager',
    company: 'Stripe',
    level: 'Senior',
    description: 'Ensure customer success, drive product adoption, and manage customer renewals.',
    category: 'Sales'
  },
  {
    id: '125',
    title: 'Account Manager',
    company: 'Adobe',
    level: 'Mid-Level',
    description: 'Manage existing accounts, identify upsell opportunities, and ensure customer satisfaction.',
    category: 'Sales'
  },
  {
    id: '126',
    title: 'Sales Engineer',
    company: 'AWS',
    level: 'Senior',
    description: 'Provide technical expertise in sales process, conduct technical demos, and support complex deals.',
    category: 'Sales'
  },
  {
    id: '127',
    title: 'Regional Sales Director',
    company: 'Salesforce',
    level: 'Director',
    description: 'Lead regional sales team, set sales strategy, and drive revenue growth in territory.',
    category: 'Sales'
  },
  {
    id: '128',
    title: 'Channel Sales Manager',
    company: 'Cisco',
    level: 'Senior',
    description: 'Manage partner relationships, develop channel strategy, and drive indirect sales revenue.',
    category: 'Sales'
  },
  {
    id: '129',
    title: 'Sales Operations Manager',
    company: 'Google Cloud',
    level: 'Senior',
    description: 'Optimize sales processes, manage sales tools, and provide analytics to sales leadership.',
    category: 'Sales'
  },
  {
    id: '130',
    title: 'Business Development Manager',
    company: 'LinkedIn',
    level: 'Senior',
    description: 'Identify new business opportunities, build strategic partnerships, and drive revenue growth.',
    category: 'Sales'
  },
  {
    id: '131',
    title: 'Customer Success Director',
    company: 'Zoom',
    level: 'Director',
    description: 'Lead customer success organization, define CS strategy, and ensure high customer retention.',
    category: 'Sales'
  },
  {
    id: '132',
    title: 'Strategic Account Executive',
    company: 'IBM',
    level: 'Senior',
    description: 'Manage strategic accounts, develop account plans, and drive expansion in key customers.',
    category: 'Sales'
  },
  {
    id: '133',
    title: 'Territory Sales Representative',
    company: 'Pharmaceutical Sales Co.',
    level: 'Mid-Level',
    description: 'Manage sales territory, build relationships with clients, and achieve sales quotas.',
    category: 'Sales'
  },
  {
    id: '134',
    title: 'Solutions Consultant',
    company: 'ServiceNow',
    level: 'Senior',
    description: 'Demonstrate product capabilities, design solutions for prospects, and support sales process.',
    category: 'Sales'
  },
  {
    id: '135',
    title: 'VP of Sales',
    company: 'Startup Inc.',
    level: 'Director',
    description: 'Lead entire sales organization, set sales strategy, and drive company revenue goals.',
    category: 'Sales'
  },
  {
    id: '136',
    title: 'Renewals Manager',
    company: 'Adobe',
    level: 'Mid-Level',
    description: 'Manage customer renewals, prevent churn, and ensure contract continuity.',
    category: 'Sales'
  },
  {
    id: '137',
    title: 'Technical Account Manager',
    company: 'AWS',
    level: 'Senior',
    description: 'Provide technical guidance to customers, ensure product success, and drive account growth.',
    category: 'Sales'
  },
  {
    id: '138',
    title: 'Sales Enablement Manager',
    company: 'Salesforce',
    level: 'Senior',
    description: 'Train sales teams, create sales content, and enable sales team productivity.',
    category: 'Sales'
  },
  {
    id: '139',
    title: 'Partnership Manager',
    company: 'Shopify',
    level: 'Senior',
    description: 'Build strategic partnerships, negotiate partnership agreements, and drive partner success.',
    category: 'Sales'
  },
  {
    id: '140',
    title: 'Field Sales Representative',
    company: 'Oracle',
    level: 'Mid-Level',
    description: 'Conduct in-person sales meetings, manage territory, and close deals through field visits.',
    category: 'Sales'
  },
  {
    id: '141',
    title: 'Outbound Sales Specialist',
    company: 'Tech Company',
    level: 'Entry-Level',
    description: 'Make outbound calls, generate leads, and schedule appointments for sales team.',
    category: 'Sales'
  },

  // Finance (16 roles)
  {
    id: '142',
    title: 'Financial Analyst',
    company: 'Goldman Sachs',
    level: 'Mid-Level',
    description: 'Analyze financial data, create financial models, and provide insights for investment decisions.',
    category: 'Finance'
  },
  {
    id: '143',
    title: 'Investment Banker',
    company: 'J.P. Morgan',
    level: 'Senior',
    description: 'Advise on M&A transactions, raise capital for clients, and structure complex financial deals.',
    category: 'Finance'
  },
  {
    id: '144',
    title: 'Accountant',
    company: 'Deloitte',
    level: 'Mid-Level',
    description: 'Manage financial records, prepare financial statements, and ensure accounting compliance.',
    category: 'Finance'
  },
  {
    id: '145',
    title: 'FP&A Manager',
    company: 'Meta',
    level: 'Senior',
    description: 'Lead financial planning and analysis, manage budgeting process, and provide financial guidance.',
    category: 'Finance'
  },
  {
    id: '146',
    title: 'Corporate Controller',
    company: 'Fortune 500 Company',
    level: 'Director',
    description: 'Oversee accounting operations, manage financial reporting, and ensure internal controls.',
    category: 'Finance'
  },
  {
    id: '147',
    title: 'Private Equity Associate',
    company: 'KKR',
    level: 'Senior',
    description: 'Evaluate investment opportunities, conduct due diligence, and manage portfolio companies.',
    category: 'Finance'
  },
  {
    id: '148',
    title: 'Venture Capital Analyst',
    company: 'Sequoia Capital',
    level: 'Mid-Level',
    description: 'Source investment opportunities, analyze startups, and support portfolio companies.',
    category: 'Finance'
  },
  {
    id: '149',
    title: 'Treasury Analyst',
    company: 'Apple',
    level: 'Mid-Level',
    description: 'Manage cash flow, optimize treasury operations, and handle corporate financing activities.',
    category: 'Finance'
  },
  {
    id: '150',
    title: 'Risk Analyst',
    company: 'Bank of America',
    level: 'Mid-Level',
    description: 'Assess financial risks, develop risk models, and ensure regulatory compliance.',
    category: 'Finance'
  },
  {
    id: '151',
    title: 'Credit Analyst',
    company: 'Wells Fargo',
    level: 'Mid-Level',
    description: 'Evaluate creditworthiness, analyze financial statements, and make lending recommendations.',
    category: 'Finance'
  },
  {
    id: '152',
    title: 'Tax Manager',
    company: 'PwC',
    level: 'Senior',
    description: 'Provide tax planning advice, prepare tax returns, and ensure tax compliance for clients.',
    category: 'Finance'
  },
  {
    id: '153',
    title: 'Audit Manager',
    company: 'KPMG',
    level: 'Senior',
    description: 'Lead audit engagements, review financial statements, and ensure audit quality.',
    category: 'Finance'
  },
  {
    id: '154',
    title: 'Financial Controller',
    company: 'Startup Inc.',
    level: 'Lead',
    description: 'Oversee all financial operations, manage accounting team, and prepare financial reports.',
    category: 'Finance'
  },
  {
    id: '155',
    title: 'CFO',
    company: 'Tech Unicorn',
    level: 'Director',
    description: 'Lead financial strategy, manage finance organization, and oversee all financial operations.',
    category: 'Finance'
  },
  {
    id: '156',
    title: 'Equity Research Analyst',
    company: 'Morgan Stanley',
    level: 'Mid-Level',
    description: 'Research public companies, publish investment reports, and provide stock recommendations.',
    category: 'Finance'
  },
  {
    id: '157',
    title: 'Compliance Analyst',
    company: 'Citigroup',
    level: 'Mid-Level',
    description: 'Ensure regulatory compliance, monitor financial transactions, and implement compliance programs.',
    category: 'Finance'
  },

  // Consulting (12 roles)
  {
    id: '158',
    title: 'Management Consultant',
    company: 'McKinsey & Company',
    level: 'Senior',
    description: 'Advise clients on business strategy, solve complex problems, and drive organizational transformation.',
    category: 'Consulting'
  },
  {
    id: '159',
    title: 'Strategy Consultant',
    company: 'Boston Consulting Group',
    level: 'Senior',
    description: 'Develop corporate strategies, analyze market opportunities, and provide strategic recommendations.',
    category: 'Consulting'
  },
  {
    id: '160',
    title: 'Business Analyst',
    company: 'Bain & Company',
    level: 'Entry-Level',
    description: 'Conduct research and analysis, support consulting projects, and create client presentations.',
    category: 'Consulting'
  },
  {
    id: '161',
    title: 'Technology Consultant',
    company: 'Accenture',
    level: 'Senior',
    description: 'Advise on technology strategy, implement digital solutions, and drive IT transformation.',
    category: 'Consulting'
  },
  {
    id: '162',
    title: 'IT Consultant',
    company: 'IBM Consulting',
    level: 'Mid-Level',
    description: 'Implement technology solutions, advise on IT infrastructure, and optimize systems.',
    category: 'Consulting'
  },
  {
    id: '163',
    title: 'SAP Consultant',
    company: 'Deloitte Consulting',
    level: 'Senior',
    description: 'Implement SAP solutions, customize ERP systems, and provide SAP expertise to clients.',
    category: 'Consulting'
  },
  {
    id: '164',
    title: 'Change Management Consultant',
    company: 'PwC Consulting',
    level: 'Senior',
    description: 'Lead organizational change initiatives, develop change strategies, and enable transformation.',
    category: 'Consulting'
  },
  {
    id: '165',
    title: 'Operations Consultant',
    company: 'EY-Parthenon',
    level: 'Senior',
    description: 'Optimize business operations, improve processes, and drive operational efficiency.',
    category: 'Consulting'
  },
  {
    id: '166',
    title: 'HR Consultant',
    company: 'Mercer',
    level: 'Senior',
    description: 'Advise on HR strategy, design compensation programs, and improve people operations.',
    category: 'Consulting'
  },
  {
    id: '167',
    title: 'Financial Advisory Consultant',
    company: 'KPMG Advisory',
    level: 'Senior',
    description: 'Provide M&A advisory, financial due diligence, and transaction support services.',
    category: 'Consulting'
  },
  {
    id: '168',
    title: 'Digital Transformation Consultant',
    company: 'Capgemini',
    level: 'Senior',
    description: 'Lead digital transformation initiatives, implement new technologies, and modernize businesses.',
    category: 'Consulting'
  },
  {
    id: '169',
    title: 'Cybersecurity Consultant',
    company: 'Booz Allen Hamilton',
    level: 'Senior',
    description: 'Assess security risks, design security architectures, and implement cybersecurity solutions.',
    category: 'Consulting'
  },

  // Operations (17 roles)
  {
    id: '170',
    title: 'Operations Manager',
    company: 'Amazon',
    level: 'Senior',
    description: 'Manage operational processes, optimize efficiency, and lead operations teams.',
    category: 'Operations'
  },
  {
    id: '171',
    title: 'Supply Chain Manager',
    company: 'Walmart',
    level: 'Senior',
    description: 'Manage supply chain operations, optimize logistics, and ensure product availability.',
    category: 'Operations'
  },
  {
    id: '172',
    title: 'Logistics Coordinator',
    company: 'FedEx',
    level: 'Mid-Level',
    description: 'Coordinate shipments, manage transportation logistics, and optimize delivery routes.',
    category: 'Operations'
  },
  {
    id: '173',
    title: 'Project Manager',
    company: 'Google',
    level: 'Senior',
    description: 'Manage cross-functional projects, coordinate teams, and ensure project delivery on time.',
    category: 'Operations'
  },
  {
    id: '174',
    title: 'Program Manager',
    company: 'Microsoft',
    level: 'Lead',
    description: 'Manage large-scale programs, coordinate multiple projects, and drive strategic initiatives.',
    category: 'Operations'
  },
  {
    id: '175',
    title: 'Business Operations Manager',
    company: 'Meta',
    level: 'Senior',
    description: 'Optimize business processes, manage operations strategy, and improve organizational efficiency.',
    category: 'Operations'
  },
  {
    id: '176',
    title: 'Procurement Manager',
    company: 'Apple',
    level: 'Senior',
    description: 'Manage vendor relationships, negotiate contracts, and optimize procurement processes.',
    category: 'Operations'
  },
  {
    id: '177',
    title: 'Warehouse Manager',
    company: 'Target',
    level: 'Mid-Level',
    description: 'Manage warehouse operations, supervise staff, and ensure inventory accuracy.',
    category: 'Operations'
  },
  {
    id: '178',
    title: 'Quality Assurance Manager',
    company: 'Toyota',
    level: 'Senior',
    description: 'Ensure product quality, implement QA processes, and manage quality control teams.',
    category: 'Operations'
  },
  {
    id: '179',
    title: 'Facilities Manager',
    company: 'WeWork',
    level: 'Mid-Level',
    description: 'Manage building operations, coordinate maintenance, and ensure workplace functionality.',
    category: 'Operations'
  },
  {
    id: '180',
    title: 'Process Improvement Manager',
    company: 'General Electric',
    level: 'Senior',
    description: 'Identify process inefficiencies, implement Lean Six Sigma, and drive continuous improvement.',
    category: 'Operations'
  },
  {
    id: '181',
    title: 'Inventory Manager',
    company: 'Best Buy',
    level: 'Mid-Level',
    description: 'Manage inventory levels, optimize stock, and minimize inventory costs.',
    category: 'Operations'
  },
  {
    id: '182',
    title: 'Operations Analyst',
    company: 'McKinsey Operations',
    level: 'Mid-Level',
    description: 'Analyze operational data, identify improvement opportunities, and support operations strategy.',
    category: 'Operations'
  },
  {
    id: '183',
    title: 'Fleet Manager',
    company: 'UPS',
    level: 'Senior',
    description: 'Manage vehicle fleet, optimize routes, and ensure fleet maintenance and compliance.',
    category: 'Operations'
  },
  {
    id: '184',
    title: 'Production Manager',
    company: 'Manufacturing Corp',
    level: 'Senior',
    description: 'Manage manufacturing operations, optimize production schedules, and ensure output quality.',
    category: 'Operations'
  },
  {
    id: '185',
    title: 'Site Manager',
    company: 'Construction Company',
    level: 'Senior',
    description: 'Manage construction site operations, coordinate contractors, and ensure project compliance.',
    category: 'Operations'
  },
  {
    id: '186',
    title: 'Operations Coordinator',
    company: 'Startup Inc.',
    level: 'Entry-Level',
    description: 'Support operational activities, coordinate logistics, and assist with process improvements.',
    category: 'Operations'
  },

  // Human Resources (12 roles)
  {
    id: '187',
    title: 'Recruiter',
    company: 'Google',
    level: 'Mid-Level',
    description: 'Source and recruit talent, manage hiring process, and build candidate pipelines.',
    category: 'Human Resources'
  },
  {
    id: '188',
    title: 'Technical Recruiter',
    company: 'Meta',
    level: 'Senior',
    description: 'Recruit engineering talent, manage technical hiring, and build relationships with candidates.',
    category: 'Human Resources'
  },
  {
    id: '189',
    title: 'HR Business Partner',
    company: 'Amazon',
    level: 'Senior',
    description: 'Partner with business leaders, provide HR guidance, and drive people initiatives.',
    category: 'Human Resources'
  },
  {
    id: '190',
    title: 'People Operations Manager',
    company: 'Airbnb',
    level: 'Senior',
    description: 'Manage HR operations, optimize people processes, and improve employee experience.',
    category: 'Human Resources'
  },
  {
    id: '191',
    title: 'Talent Acquisition Manager',
    company: 'LinkedIn',
    level: 'Lead',
    description: 'Lead recruiting team, develop hiring strategy, and build talent acquisition programs.',
    category: 'Human Resources'
  },
  {
    id: '192',
    title: 'Compensation Analyst',
    company: 'Microsoft',
    level: 'Mid-Level',
    description: 'Analyze compensation data, design salary structures, and ensure pay equity.',
    category: 'Human Resources'
  },
  {
    id: '193',
    title: 'Learning & Development Manager',
    company: 'Apple',
    level: 'Senior',
    description: 'Design training programs, develop employee skills, and manage learning initiatives.',
    category: 'Human Resources'
  },
  {
    id: '194',
    title: 'Employee Relations Specialist',
    company: 'Fortune 500 Company',
    level: 'Mid-Level',
    description: 'Handle employee relations issues, conduct investigations, and ensure fair workplace practices.',
    category: 'Human Resources'
  },
  {
    id: '195',
    title: 'HR Generalist',
    company: 'Startup Inc.',
    level: 'Mid-Level',
    description: 'Manage various HR functions, support employees, and implement HR policies.',
    category: 'Human Resources'
  },
  {
    id: '196',
    title: 'Diversity & Inclusion Manager',
    company: 'Salesforce',
    level: 'Senior',
    description: 'Lead D&I initiatives, develop inclusive programs, and promote workplace diversity.',
    category: 'Human Resources'
  },
  {
    id: '197',
    title: 'HR Director',
    company: 'Netflix',
    level: 'Director',
    description: 'Lead HR organization, set people strategy, and drive HR transformation.',
    category: 'Human Resources'
  },
  {
    id: '198',
    title: 'Organizational Development Specialist',
    company: 'IBM',
    level: 'Senior',
    description: 'Design organizational structures, facilitate change management, and improve team effectiveness.',
    category: 'Human Resources'
  },

  // Healthcare (16 roles)
  {
    id: '199',
    title: 'Clinical Research Coordinator',
    company: 'Johns Hopkins Hospital',
    level: 'Mid-Level',
    description: 'Coordinate clinical trials, recruit patients, and ensure protocol compliance.',
    category: 'Healthcare'
  },
  {
    id: '200',
    title: 'Medical Science Liaison',
    company: 'Pfizer',
    level: 'Senior',
    description: 'Engage with healthcare professionals, provide scientific information, and support clinical research.',
    category: 'Healthcare'
  },
  {
    id: '201',
    title: 'Healthcare Administrator',
    company: 'Mayo Clinic',
    level: 'Senior',
    description: 'Manage healthcare facility operations, oversee staff, and ensure quality patient care.',
    category: 'Healthcare'
  },
  {
    id: '202',
    title: 'Biotech Research Scientist',
    company: 'Genentech',
    level: 'Senior',
    description: 'Conduct biological research, develop new therapies, and advance drug discovery programs.',
    category: 'Healthcare'
  },
  {
    id: '203',
    title: 'Pharmaceutical Sales Representative',
    company: 'Merck',
    level: 'Mid-Level',
    description: 'Promote pharmaceutical products, build relationships with physicians, and drive sales growth.',
    category: 'Healthcare'
  },
  {
    id: '204',
    title: 'Clinical Trial Manager',
    company: 'Moderna',
    level: 'Senior',
    description: 'Manage clinical trial operations, ensure regulatory compliance, and oversee study execution.',
    category: 'Healthcare'
  },
  {
    id: '205',
    title: 'Medical Writer',
    company: 'Bristol Myers Squibb',
    level: 'Mid-Level',
    description: 'Write regulatory documents, clinical study reports, and medical publications.',
    category: 'Healthcare'
  },
  {
    id: '206',
    title: 'Regulatory Affairs Specialist',
    company: 'Johnson & Johnson',
    level: 'Senior',
    description: 'Ensure regulatory compliance, prepare submissions, and liaise with regulatory agencies.',
    category: 'Healthcare'
  },
  {
    id: '207',
    title: 'Health Informatics Specialist',
    company: 'Epic Systems',
    level: 'Mid-Level',
    description: 'Implement healthcare IT systems, analyze medical data, and optimize clinical workflows.',
    category: 'Healthcare'
  },
  {
    id: '208',
    title: 'Pharmacovigilance Associate',
    company: 'AstraZeneca',
    level: 'Mid-Level',
    description: 'Monitor drug safety, report adverse events, and ensure pharmacovigilance compliance.',
    category: 'Healthcare'
  },
  {
    id: '209',
    title: 'Healthcare Consultant',
    company: 'Advisory Board',
    level: 'Senior',
    description: 'Advise healthcare organizations, improve operations, and implement best practices.',
    category: 'Healthcare'
  },
  {
    id: '210',
    title: 'Laboratory Technician',
    company: 'Quest Diagnostics',
    level: 'Mid-Level',
    description: 'Conduct laboratory tests, analyze samples, and maintain lab equipment.',
    category: 'Healthcare'
  },
  {
    id: '211',
    title: 'Public Health Analyst',
    company: 'CDC',
    level: 'Mid-Level',
    description: 'Analyze health data, track disease outbreaks, and support public health initiatives.',
    category: 'Healthcare'
  },
  {
    id: '212',
    title: 'Hospital Operations Manager',
    company: 'Cleveland Clinic',
    level: 'Senior',
    description: 'Manage hospital operations, optimize patient flow, and improve healthcare delivery.',
    category: 'Healthcare'
  },
  {
    id: '213',
    title: 'Medical Device Sales Specialist',
    company: 'Medtronic',
    level: 'Mid-Level',
    description: 'Sell medical devices, train healthcare professionals, and provide product support.',
    category: 'Healthcare'
  },
  {
    id: '214',
    title: 'Clinical Data Manager',
    company: 'IQVIA',
    level: 'Senior',
    description: 'Manage clinical trial data, ensure data quality, and oversee database operations.',
    category: 'Healthcare'
  },

  // Legal (11 roles)
  {
    id: '215',
    title: 'Corporate Lawyer',
    company: 'Cravath Law Firm',
    level: 'Senior',
    description: 'Advise on corporate transactions, draft legal documents, and provide legal counsel.',
    category: 'Legal'
  },
  {
    id: '216',
    title: 'Compliance Manager',
    company: 'JPMorgan Chase',
    level: 'Senior',
    description: 'Ensure regulatory compliance, develop compliance programs, and manage legal risks.',
    category: 'Legal'
  },
  {
    id: '217',
    title: 'Paralegal',
    company: 'Skadden Law Firm',
    level: 'Mid-Level',
    description: 'Support legal teams, conduct legal research, and prepare legal documents.',
    category: 'Legal'
  },
  {
    id: '218',
    title: 'Contracts Manager',
    company: 'Amazon',
    level: 'Senior',
    description: 'Draft and negotiate contracts, manage contract lifecycle, and ensure compliance.',
    category: 'Legal'
  },
  {
    id: '219',
    title: 'Intellectual Property Attorney',
    company: 'Apple',
    level: 'Senior',
    description: 'Protect intellectual property, file patents, and handle IP litigation.',
    category: 'Legal'
  },
  {
    id: '220',
    title: 'Legal Counsel',
    company: 'Google',
    level: 'Senior',
    description: 'Provide legal advice, manage legal matters, and support business operations.',
    category: 'Legal'
  },
  {
    id: '221',
    title: 'Privacy Attorney',
    company: 'Meta',
    level: 'Senior',
    description: 'Ensure data privacy compliance, advise on privacy laws, and manage privacy programs.',
    category: 'Legal'
  },
  {
    id: '222',
    title: 'Employment Lawyer',
    company: 'Law Firm',
    level: 'Senior',
    description: 'Handle employment law matters, advise on labor issues, and represent clients in disputes.',
    category: 'Legal'
  },
  {
    id: '223',
    title: 'Legal Operations Manager',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Optimize legal operations, manage legal technology, and improve legal team efficiency.',
    category: 'Legal'
  },
  {
    id: '224',
    title: 'Risk & Compliance Analyst',
    company: 'Goldman Sachs',
    level: 'Mid-Level',
    description: 'Assess legal and compliance risks, monitor regulatory changes, and ensure adherence.',
    category: 'Legal'
  },
  {
    id: '225',
    title: 'General Counsel',
    company: 'Tech Unicorn',
    level: 'Director',
    description: 'Lead legal organization, provide strategic legal guidance, and manage all legal matters.',
    category: 'Legal'
  },

  // Creative (16 roles)
  {
    id: '226',
    title: 'Content Writer',
    company: 'HubSpot',
    level: 'Mid-Level',
    description: 'Create blog posts, articles, and marketing content to engage audiences.',
    category: 'Creative'
  },
  {
    id: '227',
    title: 'Copywriter',
    company: 'Ogilvy',
    level: 'Senior',
    description: 'Write compelling ad copy, develop creative concepts, and craft brand messaging.',
    category: 'Creative'
  },
  {
    id: '228',
    title: 'Video Producer',
    company: 'Netflix',
    level: 'Senior',
    description: 'Produce video content, manage production process, and oversee post-production.',
    category: 'Creative'
  },
  {
    id: '229',
    title: 'Social Media Content Creator',
    company: 'TikTok',
    level: 'Mid-Level',
    description: 'Create engaging social content, develop content strategy, and grow social presence.',
    category: 'Creative'
  },
  {
    id: '230',
    title: 'Creative Director',
    company: 'BBDO',
    level: 'Lead',
    description: 'Lead creative teams, develop campaign concepts, and ensure creative excellence.',
    category: 'Creative'
  },
  {
    id: '231',
    title: 'Art Director',
    company: 'Wieden+Kennedy',
    level: 'Senior',
    description: 'Direct visual creative, design ad campaigns, and manage creative projects.',
    category: 'Creative'
  },
  {
    id: '232',
    title: 'Podcast Producer',
    company: 'Spotify Studios',
    level: 'Mid-Level',
    description: 'Produce podcast episodes, manage recording sessions, and edit audio content.',
    category: 'Creative'
  },
  {
    id: '233',
    title: 'Photographer',
    company: 'National Geographic',
    level: 'Senior',
    description: 'Capture compelling photographs, edit images, and tell visual stories.',
    category: 'Creative'
  },
  {
    id: '234',
    title: 'Video Editor',
    company: 'YouTube',
    level: 'Mid-Level',
    description: 'Edit video content, create engaging narratives, and optimize for platform.',
    category: 'Creative'
  },
  {
    id: '235',
    title: 'Content Strategist',
    company: 'Medium',
    level: 'Senior',
    description: 'Develop content strategy, plan content calendars, and optimize content performance.',
    category: 'Creative'
  },
  {
    id: '236',
    title: 'SEO Content Writer',
    company: 'Digital Agency',
    level: 'Mid-Level',
    description: 'Write SEO-optimized content, conduct keyword research, and improve search rankings.',
    category: 'Creative'
  },
  {
    id: '237',
    title: 'Illustrator',
    company: 'Pixar',
    level: 'Senior',
    description: 'Create illustrations, develop visual concepts, and support creative projects.',
    category: 'Creative'
  },
  {
    id: '238',
    title: 'Animator',
    company: 'DreamWorks',
    level: 'Senior',
    description: 'Create animations, design character movements, and bring stories to life.',
    category: 'Creative'
  },
  {
    id: '239',
    title: 'Brand Storyteller',
    company: 'Nike',
    level: 'Senior',
    description: 'Craft brand narratives, develop storytelling strategy, and create emotional connections.',
    category: 'Creative'
  },
  {
    id: '240',
    title: 'Audio Engineer',
    company: 'Recording Studio',
    level: 'Mid-Level',
    description: 'Mix and master audio, manage recording sessions, and ensure sound quality.',
    category: 'Creative'
  },
  {
    id: '241',
    title: 'Content Marketing Lead',
    company: 'Shopify',
    level: 'Lead',
    description: 'Lead content marketing strategy, manage creative team, and drive content ROI.',
    category: 'Creative'
  },

  // Engineering (Non-Software) (16 roles)
  {
    id: '242',
    title: 'Mechanical Engineer',
    company: 'Tesla',
    level: 'Senior',
    description: 'Design mechanical systems, develop product prototypes, and optimize manufacturing processes.',
    category: 'Engineering'
  },
  {
    id: '243',
    title: 'Electrical Engineer',
    company: 'General Electric',
    level: 'Senior',
    description: 'Design electrical systems, develop circuit boards, and ensure electrical safety.',
    category: 'Engineering'
  },
  {
    id: '244',
    title: 'Civil Engineer',
    company: 'Bechtel',
    level: 'Senior',
    description: 'Design infrastructure projects, manage construction, and ensure structural integrity.',
    category: 'Engineering'
  },
  {
    id: '245',
    title: 'Chemical Engineer',
    company: 'DuPont',
    level: 'Senior',
    description: 'Design chemical processes, optimize production, and ensure safety compliance.',
    category: 'Engineering'
  },
  {
    id: '246',
    title: 'Aerospace Engineer',
    company: 'Boeing',
    level: 'Senior',
    description: 'Design aircraft systems, conduct aerodynamic analysis, and ensure flight safety.',
    category: 'Engineering'
  },
  {
    id: '247',
    title: 'Structural Engineer',
    company: 'AECOM',
    level: 'Senior',
    description: 'Design building structures, analyze load requirements, and ensure structural safety.',
    category: 'Engineering'
  },
  {
    id: '248',
    title: 'Manufacturing Engineer',
    company: 'Ford',
    level: 'Mid-Level',
    description: 'Optimize manufacturing processes, improve production efficiency, and reduce costs.',
    category: 'Engineering'
  },
  {
    id: '249',
    title: 'Industrial Engineer',
    company: 'Amazon',
    level: 'Senior',
    description: 'Optimize workflows, improve operational efficiency, and design production systems.',
    category: 'Engineering'
  },
  {
    id: '250',
    title: 'Environmental Engineer',
    company: 'EPA',
    level: 'Senior',
    description: 'Design environmental solutions, conduct impact assessments, and ensure compliance.',
    category: 'Engineering'
  },
  {
    id: '251',
    title: 'Biomedical Engineer',
    company: 'Medtronic',
    level: 'Senior',
    description: 'Design medical devices, develop healthcare technologies, and improve patient care.',
    category: 'Engineering'
  },
  {
    id: '252',
    title: 'Materials Engineer',
    company: '3M',
    level: 'Senior',
    description: 'Develop new materials, test material properties, and optimize material performance.',
    category: 'Engineering'
  },
  {
    id: '253',
    title: 'Quality Engineer',
    company: 'Toyota',
    level: 'Mid-Level',
    description: 'Ensure product quality, implement quality control processes, and conduct inspections.',
    category: 'Engineering'
  },
  {
    id: '254',
    title: 'Process Engineer',
    company: 'Chevron',
    level: 'Senior',
    description: 'Optimize industrial processes, improve efficiency, and ensure safety standards.',
    category: 'Engineering'
  },
  {
    id: '255',
    title: 'Automotive Engineer',
    company: 'GM',
    level: 'Senior',
    description: 'Design vehicle systems, develop automotive technologies, and conduct vehicle testing.',
    category: 'Engineering'
  },
  {
    id: '256',
    title: 'HVAC Engineer',
    company: 'Carrier',
    level: 'Mid-Level',
    description: 'Design HVAC systems, optimize energy efficiency, and ensure climate control.',
    category: 'Engineering'
  },
  {
    id: '257',
    title: 'Petroleum Engineer',
    company: 'ExxonMobil',
    level: 'Senior',
    description: 'Design oil extraction systems, optimize drilling operations, and maximize production.',
    category: 'Engineering'
  },

  // Education (11 roles)
  {
    id: '258',
    title: 'High School Teacher',
    company: 'Public School District',
    level: 'Mid-Level',
    description: 'Teach high school students, develop lesson plans, and assess student performance.',
    category: 'Education'
  },
  {
    id: '259',
    title: 'University Professor',
    company: 'Stanford University',
    level: 'Lead',
    description: 'Conduct research, teach courses, mentor students, and publish academic papers.',
    category: 'Education'
  },
  {
    id: '260',
    title: 'Instructional Designer',
    company: 'Coursera',
    level: 'Senior',
    description: 'Design online courses, develop learning materials, and optimize educational experiences.',
    category: 'Education'
  },
  {
    id: '261',
    title: 'Education Program Manager',
    company: 'Khan Academy',
    level: 'Senior',
    description: 'Manage educational programs, develop curriculum, and measure program effectiveness.',
    category: 'Education'
  },
  {
    id: '262',
    title: 'School Administrator',
    company: 'Private School',
    level: 'Director',
    description: 'Manage school operations, oversee staff, and ensure educational excellence.',
    category: 'Education'
  },
  {
    id: '263',
    title: 'Curriculum Developer',
    company: 'Pearson Education',
    level: 'Senior',
    description: 'Develop educational curriculum, create learning materials, and align with standards.',
    category: 'Education'
  },
  {
    id: '264',
    title: 'Academic Advisor',
    company: 'University',
    level: 'Mid-Level',
    description: 'Advise students on academic programs, help with course selection, and support student success.',
    category: 'Education'
  },
  {
    id: '265',
    title: 'Education Technology Specialist',
    company: 'Google for Education',
    level: 'Mid-Level',
    description: 'Implement educational technology, train teachers, and optimize learning platforms.',
    category: 'Education'
  },
  {
    id: '266',
    title: 'Training Manager',
    company: 'Corporate Training Co.',
    level: 'Senior',
    description: 'Design training programs, develop learning content, and measure training effectiveness.',
    category: 'Education'
  },
  {
    id: '267',
    title: 'Education Consultant',
    company: 'Education Advisory Firm',
    level: 'Senior',
    description: 'Advise educational institutions, improve teaching methods, and implement best practices.',
    category: 'Education'
  },
  {
    id: '268',
    title: 'Student Success Manager',
    company: 'Online University',
    level: 'Mid-Level',
    description: 'Support student retention, provide academic guidance, and improve student outcomes.',
    category: 'Education'
  },

  // Retail (11 roles)
  {
    id: '269',
    title: 'Store Manager',
    company: 'Target',
    level: 'Senior',
    description: 'Manage retail store operations, lead staff, and drive sales performance.',
    category: 'Retail'
  },
  {
    id: '270',
    title: 'Buyer',
    company: 'Nordstrom',
    level: 'Senior',
    description: 'Select merchandise, negotiate with vendors, and manage product assortment.',
    category: 'Retail'
  },
  {
    id: '271',
    title: 'Merchandising Manager',
    company: 'Macy\'s',
    level: 'Senior',
    description: 'Plan product displays, optimize merchandising strategy, and maximize sales.',
    category: 'Retail'
  },
  {
    id: '272',
    title: 'E-commerce Manager',
    company: 'Wayfair',
    level: 'Senior',
    description: 'Manage online retail operations, optimize e-commerce platform, and drive online sales.',
    category: 'Retail'
  },
  {
    id: '273',
    title: 'Visual Merchandiser',
    company: 'Apple Store',
    level: 'Mid-Level',
    description: 'Design store layouts, create product displays, and enhance customer experience.',
    category: 'Retail'
  },
  {
    id: '274',
    title: 'Retail Analyst',
    company: 'Walmart',
    level: 'Mid-Level',
    description: 'Analyze retail data, forecast trends, and provide insights for business decisions.',
    category: 'Retail'
  },
  {
    id: '275',
    title: 'Category Manager',
    company: 'Best Buy',
    level: 'Senior',
    description: 'Manage product categories, optimize assortment, and drive category growth.',
    category: 'Retail'
  },
  {
    id: '276',
    title: 'Inventory Planner',
    company: 'Zara',
    level: 'Mid-Level',
    description: 'Plan inventory levels, forecast demand, and optimize stock allocation.',
    category: 'Retail'
  },
  {
    id: '277',
    title: 'Retail Operations Manager',
    company: 'Costco',
    level: 'Senior',
    description: 'Oversee retail operations, improve processes, and ensure operational excellence.',
    category: 'Retail'
  },
  {
    id: '278',
    title: 'Fashion Buyer',
    company: 'Bloomingdale\'s',
    level: 'Senior',
    description: 'Select fashion merchandise, attend fashion shows, and predict style trends.',
    category: 'Retail'
  },
  {
    id: '279',
    title: 'Retail Marketing Manager',
    company: 'Sephora',
    level: 'Senior',
    description: 'Develop retail marketing campaigns, drive foot traffic, and increase brand awareness.',
    category: 'Retail'
  },

  // Cybersecurity (20 roles)
  {
    id: '280',
    title: 'Security Engineer',
    company: 'CrowdStrike',
    level: 'Senior',
    description: 'Design and implement security solutions, conduct vulnerability assessments, and respond to security incidents.',
    category: 'Cybersecurity'
  },
  {
    id: '281',
    title: 'Penetration Tester (Junior)',
    company: 'Offensive Security',
    level: 'Entry-Level',
    description: 'Assist with penetration tests, learn vulnerability assessment techniques, and document findings.',
    category: 'Cybersecurity'
  },
  {
    id: '281a',
    title: 'Penetration Tester',
    company: 'HackerOne',
    level: 'Mid-Level',
    description: 'Conduct penetration tests, identify security flaws, and provide remediation guidance.',
    category: 'Cybersecurity'
  },
  {
    id: '281b',
    title: 'Senior Penetration Tester',
    company: 'Mandiant',
    level: 'Senior',
    description: 'Lead red team operations, conduct advanced exploitation, and develop custom security tools.',
    category: 'Cybersecurity'
  },
  {
    id: '282',
    title: 'Security Analyst L1',
    company: 'Mandiant',
    level: 'Entry-Level',
    description: 'Monitor security alerts, document incidents, and support vulnerability assessments.',
    category: 'Cybersecurity'
  },
  {
    id: '282a',
    title: 'Security Analyst L2',
    company: 'Cisco',
    level: 'Mid-Level',
    description: 'Investigate security threats, conduct risk assessments, and implement security controls.',
    category: 'Cybersecurity'
  },
  {
    id: '282b',
    title: 'Security Analyst L3',
    company: 'Google Cloud',
    level: 'Senior',
    description: 'Lead security assessments, develop security strategies, and manage incident response.',
    category: 'Cybersecurity'
  },
  {
    id: '283',
    title: 'SOC Analyst L1',
    company: 'Palo Alto Networks',
    level: 'Entry-Level',
    description: 'Monitor security alerts, triage incidents, and escalate threats to senior analysts.',
    category: 'Cybersecurity'
  },
  {
    id: '283a',
    title: 'SOC Analyst L2',
    company: 'CrowdStrike',
    level: 'Mid-Level',
    description: 'Investigate security incidents, perform threat analysis, and lead initial response efforts.',
    category: 'Cybersecurity'
  },
  {
    id: '283b',
    title: 'SOC Analyst L3',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Lead complex security investigations, develop detection rules, and mentor junior analysts.',
    category: 'Cybersecurity'
  },
  {
    id: '284',
    title: 'Incident Response Specialist',
    company: 'FireEye',
    level: 'Senior',
    description: 'Lead incident response efforts, conduct forensic analysis, and mitigate security breaches.',
    category: 'Cybersecurity'
  },
  {
    id: '285',
    title: 'Threat Intelligence Analyst',
    company: 'Recorded Future',
    level: 'Senior',
    description: 'Analyze cyber threats, track threat actors, and provide actionable intelligence.',
    category: 'Cybersecurity'
  },
  {
    id: '286',
    title: 'Application Security Engineer',
    company: 'Netflix',
    level: 'Senior',
    description: 'Secure applications, conduct code reviews, and implement security best practices.',
    category: 'Cybersecurity'
  },
  {
    id: '287',
    title: 'Cloud Security Architect',
    company: 'Amazon Web Services',
    level: 'Lead',
    description: 'Design secure cloud architectures, implement security controls, and ensure cloud compliance.',
    category: 'Cybersecurity'
  },
  {
    id: '288',
    title: 'Identity and Access Management Specialist',
    company: 'Okta',
    level: 'Senior',
    description: 'Manage IAM solutions, implement access controls, and ensure identity security.',
    category: 'Cybersecurity'
  },
  {
    id: '289',
    title: 'Security Compliance Analyst',
    company: 'Deloitte Cyber',
    level: 'Mid-Level',
    description: 'Ensure regulatory compliance, conduct audits, and implement security frameworks.',
    category: 'Cybersecurity'
  },
  {
    id: '290',
    title: 'Malware Analyst',
    company: 'Kaspersky',
    level: 'Senior',
    description: 'Analyze malicious software, reverse engineer malware, and develop detection signatures.',
    category: 'Cybersecurity'
  },
  {
    id: '291',
    title: 'Network Security Engineer',
    company: 'Cisco',
    level: 'Senior',
    description: 'Design secure network architectures, implement firewalls, and monitor network traffic.',
    category: 'Cybersecurity'
  },
  {
    id: '292',
    title: 'Security Operations Manager',
    company: 'Microsoft',
    level: 'Lead',
    description: 'Lead security operations team, manage SOC, and coordinate security initiatives.',
    category: 'Cybersecurity'
  },
  {
    id: '293',
    title: 'Cryptographer',
    company: 'NSA',
    level: 'Senior',
    description: 'Develop encryption algorithms, analyze cryptographic systems, and ensure data security.',
    category: 'Cybersecurity'
  },
  {
    id: '294',
    title: 'Vulnerability Researcher',
    company: 'Google Project Zero',
    level: 'Senior',
    description: 'Discover security vulnerabilities, conduct security research, and develop exploits for testing.',
    category: 'Cybersecurity'
  },
  {
    id: '295',
    title: 'CISO (Chief Information Security Officer)',
    company: 'Fortune 500 Company',
    level: 'Director',
    description: 'Lead enterprise security strategy, manage security organization, and ensure cyber resilience.',
    category: 'Cybersecurity'
  },
  {
    id: '296',
    title: 'Security Architect',
    company: 'IBM Security',
    level: 'Lead',
    description: 'Design enterprise security architectures, define security standards, and guide implementation.',
    category: 'Cybersecurity'
  },
  {
    id: '297',
    title: 'Red Team Operator',
    company: 'Mandiant',
    level: 'Senior',
    description: 'Simulate adversary attacks, conduct security assessments, and test defensive capabilities.',
    category: 'Cybersecurity'
  },
  {
    id: '298',
    title: 'Blue Team Analyst',
    company: 'CrowdStrike',
    level: 'Mid-Level',
    description: 'Defend against attacks, improve security posture, and implement defensive measures.',
    category: 'Cybersecurity'
  },
  {
    id: '299',
    title: 'Security Awareness Training Specialist',
    company: 'KnowBe4',
    level: 'Mid-Level',
    description: 'Develop security training programs, conduct phishing simulations, and improve security culture.',
    category: 'Cybersecurity'
  },

  // Healthcare & Medical (15 roles) - LinkedIn Top Demand
  {
    id: '300',
    title: 'Physical Therapist',
    company: 'Kaiser Permanente',
    level: 'Mid-Level',
    description: 'Provide physical therapy services, develop treatment plans, and help patients recover mobility and manage pain.',
    category: 'Healthcare'
  },
  {
    id: '301',
    title: 'Advanced Practice Provider',
    company: 'Mayo Clinic',
    level: 'Senior',
    description: 'Provide advanced clinical care as a Nurse Practitioner or Physician Assistant, diagnose conditions, and manage patient care.',
    category: 'Healthcare'
  },
  {
    id: '302',
    title: 'Clinical Research Coordinator',
    company: 'Johns Hopkins',
    level: 'Mid-Level',
    description: 'Coordinate clinical trials, manage patient recruitment, ensure regulatory compliance, and collect research data.',
    category: 'Healthcare'
  },
  {
    id: '303',
    title: 'Healthcare Administrator',
    company: 'Cleveland Clinic',
    level: 'Senior',
    description: 'Manage healthcare facility operations, oversee budgets, ensure quality care delivery, and lead administrative teams.',
    category: 'Healthcare'
  },
  {
    id: '304',
    title: 'Medical Device Sales Representative',
    company: 'Medtronic',
    level: 'Mid-Level',
    description: 'Sell medical devices to hospitals and clinics, provide product demonstrations, and support clinical implementations.',
    category: 'Healthcare'
  },

  // AI & Emerging Tech (10 roles) - LinkedIn Top Demand
  {
    id: '305',
    title: 'Artificial Intelligence Consultant',
    company: 'Accenture',
    level: 'Senior',
    description: 'Advise clients on AI strategy, implement AI solutions, and help organizations adopt machine learning technologies.',
    category: 'Technology'
  },
  {
    id: '306',
    title: 'AI Ethics Specialist',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Develop ethical AI frameworks, review AI systems for bias, and ensure responsible AI development practices.',
    category: 'Technology'
  },
  {
    id: '307',
    title: 'Prompt Engineer',
    company: 'Anthropic',
    level: 'Mid-Level',
    description: 'Design and optimize prompts for large language models, test AI outputs, and improve model performance.',
    category: 'Technology'
  },
  {
    id: '308',
    title: 'AI Training Specialist',
    company: 'Scale AI',
    level: 'Entry-Level',
    description: 'Label training data, evaluate AI model outputs, and improve machine learning dataset quality.',
    category: 'Technology'
  },
  {
    id: '309',
    title: 'Generative AI Developer',
    company: 'Stability AI',
    level: 'Senior',
    description: 'Build generative AI applications, work with diffusion models, and develop AI-powered creative tools.',
    category: 'Technology'
  },

  // Hospitality & Events (10 roles) - LinkedIn Top Demand
  {
    id: '310',
    title: 'Travel Advisor',
    company: 'American Express Travel',
    level: 'Mid-Level',
    description: 'Plan custom travel experiences, book flights and accommodations, and provide destination expertise to clients.',
    category: 'Hospitality'
  },
  {
    id: '311',
    title: 'Event Coordinator',
    company: 'Marriott International',
    level: 'Entry-Level',
    description: 'Plan and execute events, coordinate vendors, manage event logistics, and ensure client satisfaction.',
    category: 'Hospitality'
  },
  {
    id: '312',
    title: 'Corporate Event Planner',
    company: 'Hilton',
    level: 'Mid-Level',
    description: 'Design corporate events and conferences, manage budgets, negotiate contracts, and oversee event execution.',
    category: 'Hospitality'
  },
  {
    id: '313',
    title: 'Destination Manager',
    company: 'Expedia Group',
    level: 'Senior',
    description: 'Manage destination portfolios, develop tourism strategies, and build partnerships with local vendors.',
    category: 'Hospitality'
  },
  {
    id: '314',
    title: 'Guest Experience Manager',
    company: 'Four Seasons',
    level: 'Mid-Level',
    description: 'Enhance guest satisfaction, manage service standards, and lead hospitality teams to deliver exceptional experiences.',
    category: 'Hospitality'
  },

  // Public Sector & Non-Profit (15 roles) - LinkedIn Top Demand
  {
    id: '315',
    title: 'Workforce Development Manager',
    company: 'Department of Labor',
    level: 'Senior',
    description: 'Develop workforce training programs, partner with employers, and help job seekers acquire in-demand skills.',
    category: 'Public Sector'
  },
  {
    id: '316',
    title: 'Grants Consultant',
    company: 'United Way',
    level: 'Mid-Level',
    description: 'Write grant proposals, research funding opportunities, manage grant compliance, and track deliverables.',
    category: 'Public Sector'
  },
  {
    id: '317',
    title: 'Community Planner',
    company: 'City Planning Department',
    level: 'Mid-Level',
    description: 'Develop urban development plans, conduct community engagement, and ensure sustainable city growth.',
    category: 'Public Sector'
  },
  {
    id: '318',
    title: 'Director of Employer Relations',
    company: 'State University',
    level: 'Senior',
    description: 'Build employer partnerships, develop internship programs, and connect students with career opportunities.',
    category: 'Education'
  },
  {
    id: '319',
    title: 'Research Librarian',
    company: 'Library of Congress',
    level: 'Mid-Level',
    description: 'Assist researchers, manage digital archives, curate collections, and provide reference services.',
    category: 'Education'
  },
  {
    id: '320',
    title: 'Policy Analyst',
    company: 'Think Tank',
    level: 'Mid-Level',
    description: 'Research policy issues, analyze legislation, write policy briefs, and provide recommendations to stakeholders.',
    category: 'Public Sector'
  },
  {
    id: '321',
    title: 'Program Manager - Non-Profit',
    company: 'Red Cross',
    level: 'Senior',
    description: 'Lead social programs, manage budgets, coordinate volunteers, and measure program impact.',
    category: 'Public Sector'
  },

  // Sustainability & Environment (10 roles) - LinkedIn Top Demand
  {
    id: '322',
    title: 'Sustainability Specialist',
    company: 'Patagonia',
    level: 'Mid-Level',
    description: 'Develop sustainability initiatives, track environmental metrics, and implement green business practices.',
    category: 'Sustainability'
  },
  {
    id: '323',
    title: 'ESG Analyst',
    company: 'BlackRock',
    level: 'Mid-Level',
    description: 'Evaluate environmental, social, and governance factors, assess ESG risks, and support sustainable investing.',
    category: 'Sustainability'
  },
  {
    id: '324',
    title: 'Climate Data Analyst',
    company: 'NOAA',
    level: 'Mid-Level',
    description: 'Analyze climate data, create environmental models, and support climate change research initiatives.',
    category: 'Sustainability'
  },
  {
    id: '325',
    title: 'Renewable Energy Consultant',
    company: 'Tesla Energy',
    level: 'Senior',
    description: 'Advise on solar and renewable energy projects, conduct feasibility studies, and design energy solutions.',
    category: 'Sustainability'
  },
  {
    id: '326',
    title: 'Carbon Accounting Specialist',
    company: 'Deloitte',
    level: 'Mid-Level',
    description: 'Calculate carbon footprints, develop emission reduction strategies, and prepare sustainability reports.',
    category: 'Sustainability'
  },

  // Specialized Engineering (10 roles) - LinkedIn Top Demand
  {
    id: '327',
    title: 'Bridge Engineer',
    company: 'AECOM',
    level: 'Senior',
    description: 'Design bridge structures, perform structural analysis, manage construction projects, and ensure safety standards.',
    category: 'Engineering'
  },
  {
    id: '328',
    title: 'Nuclear Engineer',
    company: 'Westinghouse',
    level: 'Senior',
    description: 'Design nuclear systems, ensure reactor safety, conduct radiation analysis, and manage nuclear projects.',
    category: 'Engineering'
  },
  {
    id: '329',
    title: 'Instrumentation and Control Engineer',
    company: 'Honeywell',
    level: 'Senior',
    description: 'Design control systems, develop instrumentation strategies, and optimize industrial automation processes.',
    category: 'Engineering'
  },
  {
    id: '330',
    title: 'Commissioning Manager',
    company: 'Siemens',
    level: 'Senior',
    description: 'Oversee system commissioning, verify equipment performance, manage startup procedures, and ensure project handover.',
    category: 'Engineering'
  },
  {
    id: '331',
    title: 'Geotechnical Engineer',
    company: 'Bechtel',
    level: 'Mid-Level',
    description: 'Analyze soil and rock mechanics, design foundations, assess geological hazards, and support construction projects.',
    category: 'Engineering'
  },

  // Real Estate & Property (10 roles)
  {
    id: '332',
    title: 'Land Agent',
    company: 'CBRE',
    level: 'Mid-Level',
    description: 'Acquire land for development, negotiate property rights, conduct due diligence, and manage landowner relations.',
    category: 'Real Estate'
  },
  {
    id: '333',
    title: 'Commercial Real Estate Broker',
    company: 'JLL',
    level: 'Senior',
    description: 'Sell and lease commercial properties, analyze market trends, and advise clients on real estate investments.',
    category: 'Real Estate'
  },
  {
    id: '334',
    title: 'Property Manager',
    company: 'Greystar',
    level: 'Mid-Level',
    description: 'Manage residential properties, oversee maintenance, handle tenant relations, and maximize property value.',
    category: 'Real Estate'
  },
  {
    id: '335',
    title: 'Real Estate Analyst',
    company: 'Blackstone',
    level: 'Entry-Level',
    description: 'Analyze property investments, create financial models, conduct market research, and support acquisition decisions.',
    category: 'Real Estate'
  },
  {
    id: '336',
    title: 'Real Estate Developer',
    company: 'Related Companies',
    level: 'Senior',
    description: 'Lead development projects, secure financing, manage construction, and deliver real estate developments.',
    category: 'Real Estate'
  },

  // Finance - Treasury & Investment (5 roles)
  {
    id: '337',
    title: 'Treasury Manager',
    company: 'Apple',
    level: 'Senior',
    description: 'Manage corporate cash flow, optimize liquidity, oversee financial risk, and coordinate banking relationships.',
    category: 'Finance'
  },
  {
    id: '338',
    title: 'Treasury Analyst',
    company: 'Amazon',
    level: 'Mid-Level',
    description: 'Monitor cash positions, prepare cash forecasts, execute foreign exchange transactions, and support treasury operations.',
    category: 'Finance'
  },
  {
    id: '339',
    title: 'Investment Banking Analyst',
    company: 'Morgan Stanley',
    level: 'Entry-Level',
    description: 'Build financial models, prepare pitch books, conduct company valuations, and support M&A transactions.',
    category: 'Finance'
  },
  {
    id: '340',
    title: 'Wealth Management Advisor',
    company: 'Merrill Lynch',
    level: 'Senior',
    description: 'Advise high-net-worth clients, develop investment strategies, manage portfolios, and provide financial planning.',
    category: 'Finance'
  },
  {
    id: '341',
    title: 'Corporate Development Manager',
    company: 'Meta',
    level: 'Senior',
    description: 'Lead M&A strategy, evaluate acquisition targets, negotiate deals, and integrate acquired companies.',
    category: 'Finance'
  },
  // Additional Technology Roles
  {
    id: '342',
    title: 'iOS Engineer',
    company: 'Apple',
    level: 'Mid-Level',
    description: 'Develop native iOS applications using Swift and SwiftUI, implement new features, optimize performance, and collaborate with design teams to create exceptional user experiences.',
    category: 'Technology'
  },
  {
    id: '343',
    title: 'Android Engineer',
    company: 'Google',
    level: 'Mid-Level',
    description: 'Build Android applications using Kotlin and Jetpack Compose, implement Material Design principles, and ensure compatibility across diverse devices and Android versions.',
    category: 'Technology'
  },
  {
    id: '344',
    title: 'QA Engineer',
    company: 'Netflix',
    level: 'Entry-Level',
    description: 'Create automated test suites, perform manual testing, identify bugs, write detailed test cases, and ensure quality standards across web and mobile applications.',
    category: 'Technology'
  },
  {
    id: '345',
    title: 'Engineering Manager',
    company: 'Stripe',
    level: 'Lead',
    description: 'Lead a team of 8-12 engineers, drive technical strategy, conduct performance reviews, remove blockers, and ensure timely delivery of critical payment infrastructure features.',
    category: 'Technology'
  },
  {
    id: '346',
    title: 'Chief Technology Officer',
    company: 'SpaceX',
    level: 'Executive',
    description: 'Define technology vision and strategy, oversee engineering operations, lead innovation in aerospace software systems, and build world-class engineering teams.',
    category: 'Technology'
  },
  {
    id: '347',
    title: 'Technical Writer',
    company: 'Microsoft',
    level: 'Mid-Level',
    description: 'Create comprehensive technical documentation, API references, developer guides, tutorials, and ensure documentation quality for enterprise software products.',
    category: 'Technology'
  },
  {
    id: '348',
    title: 'Solutions Architect',
    company: 'Amazon Web Services',
    level: 'Senior',
    description: 'Design cloud architecture solutions for enterprise clients, provide technical guidance, conduct workshops, and help customers optimize their AWS infrastructure.',
    category: 'Technology'
  },
  {
    id: '349',
    title: 'Data Engineer',
    company: 'Airbnb',
    level: 'Mid-Level',
    description: 'Build and maintain data pipelines, optimize data warehouse performance, implement ETL processes, and ensure data quality for analytics and machine learning teams.',
    category: 'Technology'
  },
  {
    id: '350',
    title: 'Site Reliability Engineer',
    company: 'Google',
    level: 'Senior',
    description: 'Maintain system reliability and uptime, automate infrastructure operations, implement monitoring and alerting, and lead incident response for critical production systems.',
    category: 'Technology'
  },
  {
    id: '351',
    title: 'DevOps Engineer',
    company: 'GitLab',
    level: 'Mid-Level',
    description: 'Build CI/CD pipelines, manage Kubernetes clusters, automate deployment processes, implement infrastructure as code, and improve developer productivity.',
    category: 'Technology'
  },
  // Data Science Roles
  {
    id: '352',
    title: 'ML Ops Engineer',
    company: 'Meta',
    level: 'Senior',
    description: 'Deploy machine learning models to production, build ML infrastructure, implement model monitoring and retraining pipelines, and ensure scalability of ML systems.',
    category: 'Data Science'
  },
  {
    id: '353',
    title: 'Research Scientist',
    company: 'OpenAI',
    level: 'Senior',
    description: 'Conduct cutting-edge AI research, publish papers, develop novel algorithms, collaborate with engineering teams to productionize research, and advance the field of artificial intelligence.',
    category: 'Data Science'
  },
  {
    id: '354',
    title: 'Analytics Manager',
    company: 'Spotify',
    level: 'Lead',
    description: 'Lead analytics team, define KPIs and metrics strategy, provide data-driven insights to leadership, mentor analysts, and drive data culture across the organization.',
    category: 'Data Science'
  },
  {
    id: '355',
    title: 'Business Intelligence Analyst',
    company: 'Salesforce',
    level: 'Mid-Level',
    description: 'Create dashboards and reports, analyze business metrics, identify trends and insights, work with stakeholders to define reporting requirements, and present findings to leadership.',
    category: 'Data Science'
  },
  {
    id: '356',
    title: 'Data Scientist',
    company: 'Uber',
    level: 'Entry-Level',
    description: 'Analyze user behavior data, build predictive models, conduct A/B tests, create visualizations, and support data-driven decision making for product and business teams.',
    category: 'Data Science'
  },
  {
    id: '357',
    title: 'Computer Vision Engineer',
    company: 'Tesla',
    level: 'Senior',
    description: 'Develop computer vision algorithms for autonomous driving, train neural networks for object detection and segmentation, optimize model performance, and work with sensor fusion teams.',
    category: 'Data Science'
  },
  {
    id: '358',
    title: 'NLP Engineer',
    company: 'Amazon',
    level: 'Mid-Level',
    description: 'Build natural language processing models, implement text classification and entity recognition systems, improve Alexa conversation understanding, and optimize model accuracy.',
    category: 'Data Science'
  },
  // Product Roles
  {
    id: '359',
    title: 'Product Designer',
    company: 'Figma',
    level: 'Mid-Level',
    description: 'Design end-to-end user experiences, create high-fidelity mockups and prototypes, conduct user research, collaborate with engineers and PMs, and maintain design systems.',
    category: 'Product'
  },
  {
    id: '360',
    title: 'Growth Product Manager',
    company: 'Dropbox',
    level: 'Senior',
    description: 'Drive user acquisition and retention, run growth experiments, analyze funnel metrics, optimize conversion rates, and develop viral growth features.',
    category: 'Product'
  },
  {
    id: '361',
    title: 'Platform Product Manager',
    company: 'Stripe',
    level: 'Senior',
    description: 'Define API strategy and roadmap, work with developer ecosystem, gather feedback from external developers, prioritize platform features, and drive API adoption.',
    category: 'Product'
  },
  {
    id: '362',
    title: 'VP of Product',
    company: 'Notion',
    level: 'Executive',
    description: 'Lead product organization, define product vision and strategy, manage product leadership team, align roadmaps with business goals, and drive execution across multiple product lines.',
    category: 'Product'
  },
  {
    id: '363',
    title: 'Chief Product Officer',
    company: 'LinkedIn',
    level: 'Executive',
    description: 'Own overall product strategy, lead product and design organizations, collaborate with CEO and board, drive innovation, and ensure products meet user needs and business objectives.',
    category: 'Product'
  },
  {
    id: '364',
    title: 'Associate Product Manager',
    company: 'Google',
    level: 'Entry-Level',
    description: 'Support product initiatives, conduct market research, gather user feedback, write product requirements, coordinate with engineering teams, and learn product management fundamentals.',
    category: 'Product'
  },
  {
    id: '365',
    title: 'Technical Product Manager',
    company: 'Atlassian',
    level: 'Senior',
    description: 'Manage technical products, work closely with engineering on architecture decisions, define API specifications, balance technical debt with new features, and drive technical roadmap.',
    category: 'Product'
  },
  // Design Roles
  {
    id: '366',
    title: 'UX Researcher',
    company: 'Airbnb',
    level: 'Mid-Level',
    description: 'Conduct user interviews and usability studies, analyze research findings, create user personas and journey maps, present insights to product teams, and inform design decisions.',
    category: 'Design'
  },
  {
    id: '367',
    title: 'Design Systems Lead',
    company: 'Adobe',
    level: 'Lead',
    description: 'Build and maintain design system, create component libraries, establish design standards, collaborate with designers and engineers, and ensure consistency across products.',
    category: 'Design'
  },
  {
    id: '368',
    title: 'Brand Designer',
    company: 'Nike',
    level: 'Senior',
    description: 'Develop brand identity and visual language, create marketing materials, design brand guidelines, collaborate with marketing teams, and ensure brand consistency across channels.',
    category: 'Design'
  },
  {
    id: '369',
    title: 'Interaction Designer',
    company: 'Meta',
    level: 'Mid-Level',
    description: 'Design user interactions and micro-animations, create prototypes, conduct usability testing, collaborate with engineers on implementation, and refine interaction patterns.',
    category: 'Design'
  },
  {
    id: '370',
    title: 'Senior Product Designer',
    company: 'Shopify',
    level: 'Senior',
    description: 'Lead design projects end-to-end, mentor junior designers, conduct user research, create high-fidelity designs, collaborate with cross-functional teams, and drive design quality.',
    category: 'Design'
  },
  {
    id: '371',
    title: 'Motion Designer',
    company: 'Netflix',
    level: 'Mid-Level',
    description: 'Create animations and motion graphics for product interfaces, design loading states and transitions, collaborate with product designers, and enhance user experience through motion.',
    category: 'Design'
  },
  // Marketing Roles
  {
    id: '372',
    title: 'Growth Marketer',
    company: 'Uber',
    level: 'Mid-Level',
    description: 'Run growth experiments, optimize marketing funnels, analyze campaign performance, implement referral programs, and drive user acquisition through data-driven strategies.',
    category: 'Marketing'
  },
  {
    id: '373',
    title: 'Content Marketing Manager',
    company: 'HubSpot',
    level: 'Senior',
    description: 'Develop content strategy, manage editorial calendar, create blog posts and whitepapers, optimize content for SEO, measure content performance, and build thought leadership.',
    category: 'Marketing'
  },
  {
    id: '374',
    title: 'SEO Specialist',
    company: 'Zillow',
    level: 'Mid-Level',
    description: 'Optimize website for search engines, conduct keyword research, implement technical SEO improvements, track rankings and organic traffic, and collaborate with content teams.',
    category: 'Marketing'
  },
  {
    id: '375',
    title: 'Demand Generation Manager',
    company: 'Salesforce',
    level: 'Senior',
    description: 'Create demand gen campaigns, manage marketing automation, generate qualified leads, analyze campaign ROI, collaborate with sales teams, and optimize lead nurturing programs.',
    category: 'Marketing'
  },
  {
    id: '376',
    title: 'Chief Marketing Officer',
    company: 'Airbnb',
    level: 'Executive',
    description: 'Lead marketing organization, define brand strategy, oversee all marketing channels, manage marketing budget, drive customer acquisition and retention, and report to executive team.',
    category: 'Marketing'
  },
  {
    id: '377',
    title: 'Product Marketing Manager',
    company: 'Atlassian',
    level: 'Senior',
    description: 'Develop go-to-market strategies, create product positioning and messaging, enable sales teams, conduct competitive analysis, launch new products, and drive product adoption.',
    category: 'Marketing'
  },
  {
    id: '378',
    title: 'Social Media Manager',
    company: 'Twitter',
    level: 'Mid-Level',
    description: 'Manage social media presence, create engaging content, develop social strategy, monitor brand mentions, analyze social metrics, and build community engagement.',
    category: 'Marketing'
  },
  {
    id: '379',
    title: 'Email Marketing Specialist',
    company: 'Mailchimp',
    level: 'Entry-Level',
    description: 'Create email campaigns, segment audiences, write compelling copy, A/B test subject lines and content, analyze email metrics, and optimize email performance.',
    category: 'Marketing'
  },
  // Sales Roles
  {
    id: '380',
    title: 'Account Executive',
    company: 'Salesforce',
    level: 'Mid-Level',
    description: 'Manage sales pipeline, conduct product demos, negotiate contracts, close enterprise deals, build client relationships, and achieve quarterly revenue targets.',
    category: 'Sales'
  },
  {
    id: '381',
    title: 'Sales Development Representative',
    company: 'Zoom',
    level: 'Entry-Level',
    description: 'Generate qualified leads, conduct cold outreach, schedule meetings for account executives, research prospects, meet activity targets, and learn sales fundamentals.',
    category: 'Sales'
  },
  {
    id: '382',
    title: 'VP of Sales',
    company: 'Snowflake',
    level: 'Executive',
    description: 'Lead sales organization, develop sales strategy, manage sales leadership team, set revenue targets, optimize sales processes, and drive growth across regions.',
    category: 'Sales'
  },
  {
    id: '383',
    title: 'Customer Success Manager',
    company: 'Stripe',
    level: 'Senior',
    description: 'Manage enterprise client relationships, drive product adoption, identify expansion opportunities, resolve customer issues, conduct business reviews, and ensure customer retention.',
    category: 'Sales'
  },
  {
    id: '384',
    title: 'Enterprise Account Executive',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Sell enterprise software solutions to Fortune 500 companies, manage complex sales cycles, coordinate with technical teams, negotiate multi-million dollar contracts, and exceed quotas.',
    category: 'Sales'
  },
  {
    id: '385',
    title: 'Sales Engineer',
    company: 'AWS',
    level: 'Senior',
    description: 'Provide technical expertise in sales process, conduct product demonstrations, design solution architectures, support proof-of-concepts, and help close technical deals.',
    category: 'Sales'
  },
  {
    id: '386',
    title: 'Business Development Manager',
    company: 'LinkedIn',
    level: 'Senior',
    description: 'Identify partnership opportunities, negotiate strategic deals, build relationships with partners, create business cases, and drive revenue through channel partnerships.',
    category: 'Sales'
  },
  // Finance Roles
  {
    id: '387',
    title: 'Financial Analyst',
    company: 'Goldman Sachs',
    level: 'Entry-Level',
    description: 'Build financial models, prepare earnings reports, conduct variance analysis, support budgeting process, analyze financial performance, and present findings to leadership.',
    category: 'Finance'
  },
  {
    id: '388',
    title: 'Investment Banker',
    company: 'JP Morgan',
    level: 'Mid-Level',
    description: 'Execute M&A transactions, prepare pitch books, conduct due diligence, negotiate deal terms, manage client relationships, and support IPO processes.',
    category: 'Finance'
  },
  {
    id: '389',
    title: 'Chief Financial Officer',
    company: 'Tesla',
    level: 'Executive',
    description: 'Lead finance organization, oversee financial planning and analysis, manage investor relations, ensure regulatory compliance, present to board of directors, and drive financial strategy.',
    category: 'Finance'
  },
  {
    id: '390',
    title: 'Controller',
    company: 'Uber',
    level: 'Senior',
    description: 'Manage accounting operations, oversee financial reporting, ensure GAAP compliance, lead month-end close process, supervise accounting team, and support external audits.',
    category: 'Finance'
  },
  {
    id: '391',
    title: 'FP&A Manager',
    company: 'Airbnb',
    level: 'Senior',
    description: 'Lead financial planning and analysis, manage budgeting process, create financial forecasts, provide business insights, support strategic initiatives, and present to executives.',
    category: 'Finance'
  },
  {
    id: '392',
    title: 'Treasury Analyst',
    company: 'Apple',
    level: 'Mid-Level',
    description: 'Manage cash flow, optimize liquidity, execute foreign exchange transactions, monitor investment portfolios, assess financial risks, and ensure efficient capital management.',
    category: 'Finance'
  },
  {
    id: '393',
    title: 'Corporate Finance Manager',
    company: 'Amazon',
    level: 'Senior',
    description: 'Evaluate investment opportunities, conduct financial modeling for new initiatives, support M&A activities, analyze business cases, and provide strategic financial guidance.',
    category: 'Finance'
  },
  {
    id: '394',
    title: 'Risk Manager',
    company: 'PayPal',
    level: 'Senior',
    description: 'Identify and assess financial risks, develop risk mitigation strategies, implement risk frameworks, monitor risk metrics, and ensure compliance with risk policies.',
    category: 'Finance'
  },
  // Consulting Roles
  {
    id: '395',
    title: 'Strategy Consultant',
    company: 'McKinsey & Company',
    level: 'Mid-Level',
    description: 'Develop corporate strategies, conduct market analysis, solve complex business problems, create presentations for C-suite clients, and provide strategic recommendations.',
    category: 'Consulting'
  },
  {
    id: '396',
    title: 'Management Consultant',
    company: 'Boston Consulting Group',
    level: 'Senior',
    description: 'Lead consulting engagements, manage client relationships, design organizational transformations, analyze business operations, and deliver actionable insights to executives.',
    category: 'Consulting'
  },
  {
    id: '397',
    title: 'Technology Consultant',
    company: 'Deloitte',
    level: 'Mid-Level',
    description: 'Advise clients on technology strategy, implement enterprise systems, manage digital transformation projects, assess IT infrastructure, and recommend technology solutions.',
    category: 'Consulting'
  },
  {
    id: '398',
    title: 'Partner',
    company: 'Bain & Company',
    level: 'Executive',
    description: 'Lead consulting practice, develop client relationships, oversee multiple engagements, drive firm growth, mentor consultants, and provide senior counsel to CEO-level clients.',
    category: 'Consulting'
  },
  {
    id: '399',
    title: 'Business Analyst',
    company: 'Accenture',
    level: 'Entry-Level',
    description: 'Support consulting projects, gather requirements, analyze data, create presentations, conduct research, assist in client workshops, and learn consulting methodologies.',
    category: 'Consulting'
  },
  {
    id: '400',
    title: 'Change Management Consultant',
    company: 'KPMG',
    level: 'Senior',
    description: 'Lead organizational change initiatives, design change strategies, conduct stakeholder analysis, develop communication plans, and ensure successful adoption of business transformations.',
    category: 'Consulting'
  },
  // Operations Roles
  {
    id: '401',
    title: 'Supply Chain Manager',
    company: 'Apple',
    level: 'Senior',
    description: 'Optimize supply chain operations, manage vendor relationships, forecast demand, reduce costs, ensure product availability, and coordinate logistics across global operations.',
    category: 'Operations'
  },
  {
    id: '402',
    title: 'Logistics Coordinator',
    company: 'Amazon',
    level: 'Entry-Level',
    description: 'Coordinate shipments, track inventory, manage warehouse operations, optimize delivery routes, resolve logistics issues, and ensure timely fulfillment of customer orders.',
    category: 'Operations'
  },
  {
    id: '403',
    title: 'Operations Director',
    company: 'Tesla',
    level: 'Lead',
    description: 'Lead manufacturing operations, drive operational excellence, manage production teams, optimize processes, ensure quality standards, and achieve production targets.',
    category: 'Operations'
  },
  {
    id: '404',
    title: 'Chief Operating Officer',
    company: 'Airbnb',
    level: 'Executive',
    description: 'Oversee all operational functions, drive operational strategy, manage cross-functional teams, optimize business processes, ensure scalability, and partner with CEO on execution.',
    category: 'Operations'
  },
  {
    id: '405',
    title: 'Process Improvement Manager',
    company: 'Toyota',
    level: 'Senior',
    description: 'Lead continuous improvement initiatives, implement lean methodologies, analyze process inefficiencies, drive cost reduction, train teams on best practices, and measure improvement impact.',
    category: 'Operations'
  },
  {
    id: '406',
    title: 'Operations Analyst',
    company: 'Uber',
    level: 'Mid-Level',
    description: 'Analyze operational metrics, identify efficiency opportunities, create dashboards, support decision-making with data insights, and optimize city-level operations.',
    category: 'Operations'
  },
  {
    id: '407',
    title: 'Warehouse Manager',
    company: 'Walmart',
    level: 'Mid-Level',
    description: 'Manage warehouse staff, optimize inventory management, ensure safety compliance, coordinate receiving and shipping, implement warehouse management systems, and meet productivity targets.',
    category: 'Operations'
  },
  // Human Resources Roles
  {
    id: '408',
    title: 'Recruiter',
    company: 'Google',
    level: 'Mid-Level',
    description: 'Source and screen candidates, conduct interviews, manage hiring pipeline, partner with hiring managers, improve candidate experience, and achieve hiring goals.',
    category: 'Human Resources'
  },
  {
    id: '409',
    title: 'Talent Acquisition Manager',
    company: 'Meta',
    level: 'Senior',
    description: 'Lead recruiting team, develop talent strategies, manage university recruiting, build employer brand, optimize hiring processes, and attract top talent.',
    category: 'Human Resources'
  },
  {
    id: '410',
    title: 'HR Business Partner',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Partner with business leaders, provide HR guidance, manage employee relations, support organizational design, drive talent development, and ensure HR policy compliance.',
    category: 'Human Resources'
  },
  {
    id: '411',
    title: 'Chief People Officer',
    company: 'Netflix',
    level: 'Executive',
    description: 'Lead people organization, define culture and values, develop talent strategy, oversee compensation and benefits, drive diversity initiatives, and report to executive team.',
    category: 'Human Resources'
  },
  {
    id: '412',
    title: 'Compensation Analyst',
    company: 'Salesforce',
    level: 'Mid-Level',
    description: 'Analyze compensation data, conduct market research, design salary structures, manage equity programs, ensure pay equity, and support annual compensation planning.',
    category: 'Human Resources'
  },
  {
    id: '413',
    title: 'Learning and Development Manager',
    company: 'LinkedIn',
    level: 'Senior',
    description: 'Design training programs, develop leadership curriculum, manage learning platforms, assess training effectiveness, build internal capabilities, and drive employee development.',
    category: 'Human Resources'
  },
  {
    id: '414',
    title: 'People Operations Specialist',
    company: 'Stripe',
    level: 'Entry-Level',
    description: 'Support HR operations, manage HRIS systems, process employee data, coordinate onboarding, assist with benefits administration, and ensure HR process efficiency.',
    category: 'Human Resources'
  },
  // Healthcare Roles
  {
    id: '415',
    title: 'Nurse Practitioner',
    company: 'Mayo Clinic',
    level: 'Senior',
    description: 'Provide primary care, diagnose and treat illnesses, prescribe medications, order diagnostic tests, educate patients on health management, and collaborate with physicians.',
    category: 'Healthcare'
  },
  {
    id: '416',
    title: 'Healthcare Administrator',
    company: 'Kaiser Permanente',
    level: 'Senior',
    description: 'Manage hospital operations, oversee department budgets, ensure regulatory compliance, improve patient care quality, lead staff, and optimize healthcare delivery processes.',
    category: 'Healthcare'
  },
  {
    id: '417',
    title: 'Clinical Research Coordinator',
    company: 'Johns Hopkins Hospital',
    level: 'Mid-Level',
    description: 'Coordinate clinical trials, recruit study participants, collect research data, ensure protocol compliance, manage regulatory documentation, and support research investigators.',
    category: 'Healthcare'
  },
  {
    id: '418',
    title: 'Medical Director',
    company: 'Cleveland Clinic',
    level: 'Executive',
    description: 'Lead medical staff, ensure quality of care, develop clinical protocols, oversee patient safety programs, collaborate with administration, and maintain medical standards.',
    category: 'Healthcare'
  },
  {
    id: '419',
    title: 'Health Informatics Specialist',
    company: 'Epic Systems',
    level: 'Mid-Level',
    description: 'Implement electronic health records, analyze healthcare data, optimize clinical workflows, train medical staff on systems, ensure data security, and improve health IT systems.',
    category: 'Healthcare'
  },
  {
    id: '420',
    title: 'Pharmacist',
    company: 'CVS Health',
    level: 'Senior',
    description: 'Dispense medications, provide patient counseling, review prescriptions, manage pharmacy operations, ensure medication safety, and collaborate with healthcare providers.',
    category: 'Healthcare'
  },
  {
    id: '421',
    title: 'Healthcare Consultant',
    company: 'McKinsey & Company',
    level: 'Senior',
    description: 'Advise healthcare organizations on strategy, analyze healthcare systems, improve operational efficiency, support mergers and acquisitions, and drive healthcare transformation.',
    category: 'Healthcare'
  },
  // Legal Roles
  {
    id: '422',
    title: 'Corporate Counsel',
    company: 'Meta',
    level: 'Senior',
    description: 'Advise on corporate matters, draft and negotiate contracts, manage legal risks, support M&A transactions, ensure regulatory compliance, and provide legal guidance to business teams.',
    category: 'Legal'
  },
  {
    id: '423',
    title: 'Intellectual Property Attorney',
    company: 'Apple',
    level: 'Senior',
    description: 'Manage patent portfolio, file trademark applications, conduct IP due diligence, negotiate licensing agreements, defend against infringement claims, and protect company IP assets.',
    category: 'Legal'
  },
  {
    id: '424',
    title: 'Compliance Manager',
    company: 'Goldman Sachs',
    level: 'Senior',
    description: 'Develop compliance programs, ensure regulatory adherence, conduct risk assessments, manage compliance audits, train employees on policies, and report to regulators.',
    category: 'Legal'
  },
  {
    id: '425',
    title: 'General Counsel',
    company: 'Tesla',
    level: 'Executive',
    description: 'Lead legal department, provide strategic legal counsel to CEO and board, oversee litigation, manage outside counsel, ensure corporate governance, and mitigate legal risks.',
    category: 'Legal'
  },
  {
    id: '426',
    title: 'Privacy Attorney',
    company: 'Google',
    level: 'Senior',
    description: 'Advise on privacy laws and regulations, ensure GDPR and CCPA compliance, review data practices, draft privacy policies, handle data breach responses, and manage privacy programs.',
    category: 'Legal'
  },
  {
    id: '427',
    title: 'Employment Attorney',
    company: 'Amazon',
    level: 'Senior',
    description: 'Handle employment law matters, defend against employee claims, advise on HR policies, manage investigations, ensure labor law compliance, and support employee relations.',
    category: 'Legal'
  },
  {
    id: '428',
    title: 'Contract Manager',
    company: 'Microsoft',
    level: 'Mid-Level',
    description: 'Negotiate commercial contracts, review vendor agreements, manage contract lifecycle, ensure contract compliance, mitigate contractual risks, and support procurement teams.',
    category: 'Legal'
  },
  // Creative Roles
  {
    id: '429',
    title: 'Art Director',
    company: 'Pixar',
    level: 'Lead',
    description: 'Lead visual design direction, manage creative team, develop artistic concepts, oversee production design, collaborate with directors, and ensure visual consistency across projects.',
    category: 'Creative'
  },
  {
    id: '430',
    title: 'Copywriter',
    company: 'Nike',
    level: 'Mid-Level',
    description: 'Write compelling marketing copy, create brand messaging, develop campaign concepts, collaborate with design teams, write for various channels, and maintain brand voice.',
    category: 'Creative'
  },
  {
    id: '431',
    title: 'Creative Director',
    company: 'Apple',
    level: 'Executive',
    description: 'Lead creative vision, oversee design and copy teams, develop brand campaigns, present to executives, manage creative budgets, and ensure creative excellence across all touchpoints.',
    category: 'Creative'
  },
  {
    id: '432',
    title: 'Content Creator',
    company: 'YouTube',
    level: 'Mid-Level',
    description: 'Produce video content, write scripts, edit footage, manage social media presence, engage with audience, analyze content performance, and create engaging multimedia experiences.',
    category: 'Creative'
  },
  {
    id: '433',
    title: 'Brand Manager',
    company: 'Coca-Cola',
    level: 'Senior',
    description: 'Develop brand strategy, manage brand portfolio, launch new products, conduct market research, oversee marketing campaigns, protect brand equity, and drive brand growth.',
    category: 'Creative'
  },
  {
    id: '434',
    title: 'Video Producer',
    company: 'Netflix',
    level: 'Senior',
    description: 'Produce video content, manage production schedules, coordinate with creative teams, oversee budgets, handle post-production, and ensure quality delivery of video projects.',
    category: 'Creative'
  },
  {
    id: '435',
    title: 'Graphic Designer',
    company: 'Adobe',
    level: 'Mid-Level',
    description: 'Create visual designs for marketing materials, design digital assets, develop brand identities, collaborate with marketing teams, maintain design standards, and produce creative deliverables.',
    category: 'Creative'
  },
  // Engineering (Non-Software) Roles
  {
    id: '436',
    title: 'Mechanical Engineer',
    company: 'Tesla',
    level: 'Mid-Level',
    description: 'Design mechanical systems, create CAD models, conduct stress analysis, prototype components, test designs, collaborate with manufacturing teams, and optimize vehicle performance.',
    category: 'Engineering'
  },
  {
    id: '437',
    title: 'Electrical Engineer',
    company: 'SpaceX',
    level: 'Senior',
    description: 'Design electrical systems, develop circuit boards, test electrical components, ensure safety standards, troubleshoot electrical issues, and support rocket propulsion systems.',
    category: 'Engineering'
  },
  {
    id: '438',
    title: 'Manufacturing Engineer',
    company: 'Boeing',
    level: 'Senior',
    description: 'Optimize manufacturing processes, implement automation, improve production efficiency, reduce costs, ensure quality standards, and support new product introductions.',
    category: 'Engineering'
  },
  {
    id: '439',
    title: 'Quality Engineer',
    company: 'Toyota',
    level: 'Mid-Level',
    description: 'Develop quality control processes, conduct inspections, analyze defects, implement quality improvements, manage quality metrics, and ensure manufacturing standards.',
    category: 'Engineering'
  },
  {
    id: '440',
    title: 'Aerospace Engineer',
    company: 'Lockheed Martin',
    level: 'Senior',
    description: 'Design aircraft and spacecraft systems, conduct aerodynamic analysis, run simulations, test prototypes, ensure safety compliance, and innovate aerospace technologies.',
    category: 'Engineering'
  },
  {
    id: '441',
    title: 'Civil Engineer',
    company: 'Bechtel',
    level: 'Senior',
    description: 'Design infrastructure projects, conduct structural analysis, manage construction projects, ensure code compliance, coordinate with contractors, and oversee project execution.',
    category: 'Engineering'
  },
  {
    id: '442',
    title: 'Chemical Engineer',
    company: 'DuPont',
    level: 'Mid-Level',
    description: 'Design chemical processes, optimize production methods, ensure safety protocols, conduct experiments, scale lab processes to production, and improve product formulations.',
    category: 'Engineering'
  },
  {
    id: '443',
    title: 'Biomedical Engineer',
    company: 'Medtronic',
    level: 'Senior',
    description: 'Design medical devices, conduct clinical testing, ensure FDA compliance, collaborate with medical professionals, develop innovative healthcare solutions, and improve patient outcomes.',
    category: 'Engineering'
  },
  // Cybersecurity Roles
  {
    id: '444',
    title: 'Security Analyst',
    company: 'Palo Alto Networks',
    level: 'Mid-Level',
    description: 'Monitor security threats, analyze security logs, respond to incidents, conduct vulnerability assessments, implement security controls, and protect organizational assets.',
    category: 'Cybersecurity'
  },
  {
    id: '445',
    title: 'Penetration Tester',
    company: 'CrowdStrike',
    level: 'Senior',
    description: 'Conduct ethical hacking, identify security vulnerabilities, perform security assessments, write penetration test reports, recommend remediation, and improve security posture.',
    category: 'Cybersecurity'
  },
  {
    id: '446',
    title: 'Security Architect',
    company: 'Microsoft',
    level: 'Lead',
    description: 'Design security architectures, establish security standards, evaluate security technologies, lead security initiatives, ensure compliance, and protect enterprise infrastructure.',
    category: 'Cybersecurity'
  },
  {
    id: '447',
    title: 'Chief Information Security Officer',
    company: 'Meta',
    level: 'Executive',
    description: 'Lead cybersecurity strategy, manage security organization, oversee incident response, ensure regulatory compliance, report to board, and protect company from cyber threats.',
    category: 'Cybersecurity'
  },
  {
    id: '448',
    title: 'Threat Intelligence Analyst',
    company: 'Google',
    level: 'Senior',
    description: 'Research cyber threats, analyze attack patterns, track threat actors, produce intelligence reports, share threat data, and inform security strategies.',
    category: 'Cybersecurity'
  },
  {
    id: '449',
    title: 'Security Operations Center Analyst',
    company: 'Amazon',
    level: 'Entry-Level',
    description: 'Monitor security events, triage alerts, investigate incidents, document security issues, escalate threats, and maintain security monitoring tools.',
    category: 'Cybersecurity'
  },
  {
    id: '450',
    title: 'Application Security Engineer',
    company: 'Netflix',
    level: 'Senior',
    description: 'Review code for security flaws, conduct security testing, implement secure coding practices, build security tools, remediate vulnerabilities, and train developers on security.',
    category: 'Cybersecurity'
  },
  // Hospitality Roles
  {
    id: '451',
    title: 'Event Planner',
    company: 'Marriott International',
    level: 'Mid-Level',
    description: 'Plan and coordinate events, manage budgets, coordinate vendors, oversee event logistics, ensure client satisfaction, and execute successful conferences and weddings.',
    category: 'Hospitality'
  },
  {
    id: '452',
    title: 'Hotel Manager',
    company: 'Hilton',
    level: 'Senior',
    description: 'Manage hotel operations, oversee staff, ensure guest satisfaction, manage budgets, implement service standards, handle escalations, and drive revenue growth.',
    category: 'Hospitality'
  },
  {
    id: '453',
    title: 'Concierge',
    company: 'Four Seasons',
    level: 'Mid-Level',
    description: 'Assist guests with reservations and recommendations, arrange transportation, handle special requests, provide local expertise, ensure exceptional service, and create memorable experiences.',
    category: 'Hospitality'
  },
  {
    id: '454',
    title: 'Catering Manager',
    company: 'Hyatt',
    level: 'Senior',
    description: 'Manage catering operations, coordinate events, design menus, oversee kitchen and service staff, ensure food quality, manage budgets, and exceed client expectations.',
    category: 'Hospitality'
  },
  {
    id: '455',
    title: 'Revenue Manager',
    company: 'Airbnb',
    level: 'Senior',
    description: 'Optimize pricing strategies, forecast demand, analyze market trends, manage inventory, maximize revenue, implement yield management, and report on revenue performance.',
    category: 'Hospitality'
  },
  {
    id: '456',
    title: 'Restaurant Manager',
    company: 'Shake Shack',
    level: 'Mid-Level',
    description: 'Manage restaurant operations, supervise staff, ensure food quality, maintain health standards, handle customer complaints, control costs, and drive sales growth.',
    category: 'Hospitality'
  },
  // Public Sector Roles
  {
    id: '457',
    title: 'Policy Analyst',
    company: 'RAND Corporation',
    level: 'Mid-Level',
    description: 'Analyze public policies, conduct research, write policy briefs, present findings to policymakers, evaluate policy impact, and provide evidence-based recommendations.',
    category: 'Public Sector'
  },
  {
    id: '458',
    title: 'Program Manager',
    company: 'United Nations',
    level: 'Senior',
    description: 'Manage international programs, coordinate with stakeholders, oversee budgets, monitor program outcomes, ensure compliance, report to donors, and achieve development goals.',
    category: 'Public Sector'
  },
  {
    id: '459',
    title: 'Grant Writer',
    company: 'American Red Cross',
    level: 'Mid-Level',
    description: 'Write grant proposals, research funding opportunities, manage grant reporting, coordinate with program teams, track deadlines, and secure funding for nonprofit programs.',
    category: 'Public Sector'
  },
  {
    id: '460',
    title: 'City Planner',
    company: 'City of San Francisco',
    level: 'Senior',
    description: 'Develop urban plans, review development proposals, conduct community engagement, ensure zoning compliance, manage planning projects, and shape sustainable urban development.',
    category: 'Public Sector'
  },
  {
    id: '461',
    title: 'Economic Development Specialist',
    company: 'World Bank',
    level: 'Senior',
    description: 'Analyze economic development, design development programs, conduct economic research, advise governments, manage projects, and promote sustainable economic growth.',
    category: 'Public Sector'
  },
  {
    id: '462',
    title: 'Public Affairs Manager',
    company: 'Bill & Melinda Gates Foundation',
    level: 'Senior',
    description: 'Manage external communications, develop advocacy strategies, engage with policymakers, coordinate media relations, build coalitions, and advance public policy goals.',
    category: 'Public Sector'
  },
  // Sustainability Roles
  {
    id: '463',
    title: 'Sustainability Manager',
    company: 'Patagonia',
    level: 'Senior',
    description: 'Develop sustainability strategies, manage environmental programs, track sustainability metrics, engage stakeholders, reduce environmental impact, and drive corporate responsibility.',
    category: 'Sustainability'
  },
  {
    id: '464',
    title: 'ESG Analyst',
    company: 'BlackRock',
    level: 'Mid-Level',
    description: 'Analyze ESG performance, conduct company research, evaluate sustainability risks, create ESG reports, support investment decisions, and assess environmental and social impacts.',
    category: 'Sustainability'
  },
  {
    id: '465',
    title: 'Environmental Consultant',
    company: 'ERM',
    level: 'Senior',
    description: 'Conduct environmental assessments, ensure regulatory compliance, develop remediation plans, advise clients on environmental risks, manage consulting projects, and support sustainability initiatives.',
    category: 'Sustainability'
  },
  {
    id: '466',
    title: 'Chief Sustainability Officer',
    company: 'Unilever',
    level: 'Executive',
    description: 'Lead sustainability strategy, oversee ESG programs, set carbon reduction goals, engage with stakeholders, ensure corporate accountability, and drive sustainable business practices.',
    category: 'Sustainability'
  },
  {
    id: '467',
    title: 'Climate Analyst',
    company: 'Environmental Defense Fund',
    level: 'Mid-Level',
    description: 'Analyze climate data, model climate scenarios, research mitigation strategies, produce climate reports, support policy advocacy, and contribute to climate solutions.',
    category: 'Sustainability'
  },
  {
    id: '468',
    title: 'Renewable Energy Project Manager',
    company: 'Tesla Energy',
    level: 'Senior',
    description: 'Manage solar and battery projects, coordinate installations, oversee budgets and timelines, ensure safety compliance, work with utilities, and drive clean energy adoption.',
    category: 'Sustainability'
  },
  // Real Estate Roles
  {
    id: '469',
    title: 'Real Estate Agent',
    company: 'Coldwell Banker',
    level: 'Mid-Level',
    description: 'List and sell properties, conduct property showings, negotiate contracts, advise clients on market conditions, manage transactions, and build client relationships.',
    category: 'Real Estate'
  },
  {
    id: '470',
    title: 'Property Manager',
    company: 'CBRE',
    level: 'Senior',
    description: 'Manage commercial properties, oversee building operations, coordinate maintenance, handle tenant relations, manage budgets, ensure compliance, and maximize property value.',
    category: 'Real Estate'
  },
  {
    id: '471',
    title: 'Real Estate Developer',
    company: 'Related Companies',
    level: 'Executive',
    description: 'Identify development opportunities, secure financing, manage construction projects, coordinate with architects and contractors, navigate zoning, and deliver real estate projects.',
    category: 'Real Estate'
  },
  {
    id: '472',
    title: 'Asset Manager',
    company: 'Blackstone',
    level: 'Senior',
    description: 'Manage real estate portfolios, optimize asset performance, develop business plans, monitor financial performance, execute value-add strategies, and maximize investment returns.',
    category: 'Real Estate'
  },
  {
    id: '473',
    title: 'Commercial Leasing Manager',
    company: 'JLL',
    level: 'Senior',
    description: 'Negotiate commercial leases, attract tenants, conduct property tours, analyze market trends, manage lease administration, and achieve occupancy targets.',
    category: 'Real Estate'
  },
  {
    id: '474',
    title: 'Real Estate Analyst',
    company: 'Goldman Sachs',
    level: 'Entry-Level',
    description: 'Analyze real estate investments, build financial models, conduct market research, prepare investment memos, support acquisitions, and evaluate property performance.',
    category: 'Real Estate'
  },
  // Additional Technology Roles
  {
    id: '475',
    title: 'Frontend Architect',
    company: 'Shopify',
    level: 'Lead',
    description: 'Define frontend architecture standards, evaluate frameworks and libraries, lead technical design reviews, mentor senior engineers, and ensure scalability of frontend systems.',
    category: 'Technology'
  },
  {
    id: '476',
    title: 'Backend Engineer',
    company: 'Twitter',
    level: 'Senior',
    description: 'Design and build scalable backend services, optimize database performance, implement APIs, ensure system reliability, and support high-traffic distributed systems.',
    category: 'Technology'
  },
  {
    id: '477',
    title: 'Cloud Engineer',
    company: 'Snowflake',
    level: 'Mid-Level',
    description: 'Design cloud infrastructure, automate cloud deployments, optimize cloud costs, implement security best practices, manage multi-cloud environments, and ensure high availability.',
    category: 'Technology'
  },
  {
    id: '478',
    title: 'Database Administrator',
    company: 'Oracle',
    level: 'Senior',
    description: 'Manage database systems, optimize query performance, ensure data integrity, implement backup and recovery, monitor database health, and support application teams.',
    category: 'Technology'
  },
  {
    id: '479',
    title: 'Security Engineer',
    company: 'Cloudflare',
    level: 'Senior',
    description: 'Build security tools, implement authentication systems, conduct security reviews, respond to security incidents, harden infrastructure, and protect customer data.',
    category: 'Technology'
  },
  {
    id: '480',
    title: 'Embedded Systems Engineer',
    company: 'Apple',
    level: 'Senior',
    description: 'Develop embedded software for hardware products, optimize firmware performance, work with hardware teams, implement device drivers, and ensure system stability.',
    category: 'Technology'
  },
  {
    id: '481',
    title: 'Full Stack Engineer',
    company: 'Dropbox',
    level: 'Mid-Level',
    description: 'Build end-to-end features, develop frontend and backend components, design APIs, optimize application performance, and collaborate across the full technology stack.',
    category: 'Technology'
  },
  {
    id: '482',
    title: 'Staff Software Engineer',
    company: 'Uber',
    level: 'Lead',
    description: 'Lead large-scale technical projects, mentor engineers across teams, drive architectural decisions, solve complex technical challenges, and influence engineering culture.',
    category: 'Technology'
  },
  // Additional Data Science Roles
  {
    id: '483',
    title: 'Quantitative Researcher',
    company: 'Two Sigma',
    level: 'Senior',
    description: 'Develop trading algorithms, conduct statistical analysis, research market patterns, build predictive models, backtest strategies, and contribute to quantitative investment strategies.',
    category: 'Data Science'
  },
  {
    id: '484',
    title: 'Data Architect',
    company: 'Databricks',
    level: 'Lead',
    description: 'Design data architectures, establish data governance, define data standards, evaluate data technologies, ensure data quality, and enable analytics at scale.',
    category: 'Data Science'
  },
  {
    id: '485',
    title: 'Applied Scientist',
    company: 'Amazon',
    level: 'Senior',
    description: 'Apply machine learning to business problems, conduct research, build recommendation systems, develop forecasting models, and translate research into production systems.',
    category: 'Data Science'
  },
  {
    id: '486',
    title: 'Analytics Engineer',
    company: 'dbt Labs',
    level: 'Mid-Level',
    description: 'Build data models, create dbt pipelines, develop analytics infrastructure, ensure data quality, collaborate with analysts, and enable self-service analytics.',
    category: 'Data Science'
  },
  {
    id: '487',
    title: 'Experimentation Scientist',
    company: 'Netflix',
    level: 'Senior',
    description: 'Design A/B tests, analyze experiment results, develop experimentation frameworks, provide statistical guidance, measure product impact, and drive data-driven decision making.',
    category: 'Data Science'
  },
  // Additional Product Roles
  {
    id: '488',
    title: 'Principal Product Manager',
    company: 'Amazon',
    level: 'Lead',
    description: 'Drive product strategy for major initiatives, influence company direction, lead cross-functional teams, mentor PMs, define long-term vision, and deliver business impact.',
    category: 'Product'
  },
  {
    id: '489',
    title: 'AI Product Manager',
    company: 'OpenAI',
    level: 'Senior',
    description: 'Define AI product roadmap, work with ML researchers, translate research into products, evaluate AI capabilities, manage ethical considerations, and drive AI product adoption.',
    category: 'Product'
  },
  {
    id: '490',
    title: 'Hardware Product Manager',
    company: 'Apple',
    level: 'Senior',
    description: 'Manage hardware product lifecycle, work with industrial design and engineering, define product specifications, coordinate manufacturing, and launch consumer electronics.',
    category: 'Product'
  },
  {
    id: '491',
    title: 'Product Operations Manager',
    company: 'Meta',
    level: 'Senior',
    description: 'Optimize product development processes, implement product tools, manage product analytics, coordinate launches, improve PM effectiveness, and scale product operations.',
    category: 'Product'
  },
  // Additional Design Roles
  {
    id: '492',
    title: 'Head of Design',
    company: 'Spotify',
    level: 'Executive',
    description: 'Lead design organization, define design vision, manage design leaders, build design culture, partner with product and engineering, and ensure design excellence.',
    category: 'Design'
  },
  {
    id: '493',
    title: 'Visual Designer',
    company: 'Instagram',
    level: 'Mid-Level',
    description: 'Create visual designs for marketing and product, design social media assets, develop brand visuals, maintain visual consistency, and collaborate with creative teams.',
    category: 'Design'
  },
  {
    id: '494',
    title: 'Design Manager',
    company: 'Adobe',
    level: 'Lead',
    description: 'Manage design team, guide design projects, conduct design reviews, mentor designers, collaborate with product and engineering, and ensure quality of design work.',
    category: 'Design'
  },
  {
    id: '495',
    title: 'Accessibility Designer',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Design accessible experiences, ensure WCAG compliance, conduct accessibility audits, advocate for inclusive design, train teams on accessibility, and improve product accessibility.',
    category: 'Design'
  },
  // Additional Marketing Roles
  {
    id: '496',
    title: 'Performance Marketing Manager',
    company: 'Meta',
    level: 'Senior',
    description: 'Manage paid advertising campaigns, optimize ad performance, analyze ROI, test creative variations, manage marketing budgets, and drive customer acquisition.',
    category: 'Marketing'
  },
  {
    id: '497',
    title: 'Brand Strategist',
    company: 'Disney',
    level: 'Senior',
    description: 'Develop brand positioning, conduct brand research, create brand guidelines, define brand architecture, guide creative development, and strengthen brand equity.',
    category: 'Marketing'
  },
  {
    id: '498',
    title: 'Marketing Analytics Manager',
    company: 'Google',
    level: 'Senior',
    description: 'Analyze marketing performance, build attribution models, measure campaign effectiveness, provide insights to marketing teams, optimize marketing spend, and drive data-driven marketing.',
    category: 'Marketing'
  },
  {
    id: '499',
    title: 'Lifecycle Marketing Manager',
    company: 'Spotify',
    level: 'Mid-Level',
    description: 'Develop retention strategies, create email nurture campaigns, optimize user journeys, reduce churn, increase engagement, and maximize customer lifetime value.',
    category: 'Marketing'
  },
  {
    id: '500',
    title: 'Influencer Marketing Manager',
    company: 'TikTok',
    level: 'Mid-Level',
    description: 'Manage influencer partnerships, develop creator programs, negotiate contracts, track campaign performance, build influencer network, and drive brand awareness.',
    category: 'Marketing'
  },
  // Additional Sales Roles
  {
    id: '501',
    title: 'Solutions Consultant',
    company: 'Salesforce',
    level: 'Senior',
    description: 'Support enterprise sales, deliver product demos, design solutions, conduct discovery, address technical objections, and help close complex deals.',
    category: 'Sales'
  },
  {
    id: '502',
    title: 'Channel Sales Manager',
    company: 'Cisco',
    level: 'Senior',
    description: 'Manage partner ecosystem, recruit resellers, enable channel partners, drive indirect sales, develop partner programs, and achieve channel revenue targets.',
    category: 'Sales'
  },
  {
    id: '503',
    title: 'Inside Sales Representative',
    company: 'HubSpot',
    level: 'Entry-Level',
    description: 'Sell software via phone and video, qualify inbound leads, conduct product demos, manage sales pipeline, close deals, and exceed monthly quotas.',
    category: 'Sales'
  },
  {
    id: '504',
    title: 'Strategic Account Manager',
    company: 'Oracle',
    level: 'Senior',
    description: 'Manage Fortune 500 accounts, develop account strategies, identify expansion opportunities, coordinate with executive stakeholders, and drive multi-year contracts.',
    category: 'Sales'
  },
  {
    id: '505',
    title: 'Revenue Operations Manager',
    company: 'Zoom',
    level: 'Senior',
    description: 'Optimize sales processes, manage sales tools, analyze revenue metrics, forecast revenue, implement sales automation, and improve sales efficiency.',
    category: 'Sales'
  },
  // Additional Finance Roles
  {
    id: '506',
    title: 'Private Equity Analyst',
    company: 'KKR',
    level: 'Mid-Level',
    description: 'Evaluate investment opportunities, conduct due diligence, build financial models, support deal execution, monitor portfolio companies, and analyze market trends.',
    category: 'Finance'
  },
  {
    id: '507',
    title: 'Venture Capital Associate',
    company: 'Sequoia Capital',
    level: 'Mid-Level',
    description: 'Source investment opportunities, conduct company diligence, analyze markets, support portfolio companies, attend board meetings, and help make investment decisions.',
    category: 'Finance'
  },
  {
    id: '508',
    title: 'Corporate Treasurer',
    company: 'Netflix',
    level: 'Executive',
    description: 'Manage corporate treasury, oversee cash management, execute debt financing, manage foreign exchange risk, ensure liquidity, and optimize capital structure.',
    category: 'Finance'
  },
  {
    id: '509',
    title: 'Tax Manager',
    company: 'Amazon',
    level: 'Senior',
    description: 'Manage tax compliance, develop tax strategies, prepare tax returns, conduct tax planning, support audits, ensure regulatory compliance, and minimize tax liability.',
    category: 'Finance'
  },
  {
    id: '510',
    title: 'Investor Relations Manager',
    company: 'Tesla',
    level: 'Senior',
    description: 'Manage investor communications, prepare earnings materials, coordinate investor meetings, analyze shareholder base, maintain investor website, and support financial disclosures.',
    category: 'Finance'
  },
  // Additional Consulting Roles
  {
    id: '511',
    title: 'Operations Consultant',
    company: 'McKinsey & Company',
    level: 'Senior',
    description: 'Improve client operations, optimize supply chains, implement lean methodologies, reduce costs, conduct process analysis, and drive operational excellence.',
    category: 'Consulting'
  },
  {
    id: '512',
    title: 'Digital Transformation Consultant',
    company: 'BCG',
    level: 'Senior',
    description: 'Lead digital transformation initiatives, assess digital maturity, design digital strategies, implement technology solutions, and help clients modernize their businesses.',
    category: 'Consulting'
  },
  {
    id: '513',
    title: 'Healthcare Consultant',
    company: 'Deloitte',
    level: 'Senior',
    description: 'Advise healthcare organizations, optimize clinical operations, improve patient outcomes, support mergers, implement health IT systems, and navigate healthcare regulations.',
    category: 'Consulting'
  },
  {
    id: '514',
    title: 'Supply Chain Consultant',
    company: 'Bain & Company',
    level: 'Mid-Level',
    description: 'Optimize supply chain networks, reduce logistics costs, improve procurement, implement supply chain technology, and enhance supply chain resilience.',
    category: 'Consulting'
  },
  // Additional Operations Roles
  {
    id: '515',
    title: 'Procurement Manager',
    company: 'Microsoft',
    level: 'Senior',
    description: 'Manage vendor relationships, negotiate contracts, optimize procurement processes, reduce costs, ensure supplier compliance, and drive procurement strategy.',
    category: 'Operations'
  },
  {
    id: '516',
    title: 'Quality Assurance Manager',
    company: 'Ford',
    level: 'Senior',
    description: 'Lead quality assurance programs, implement quality standards, conduct audits, drive continuous improvement, manage quality teams, and ensure product quality.',
    category: 'Operations'
  },
  {
    id: '517',
    title: 'Inventory Manager',
    company: 'Target',
    level: 'Mid-Level',
    description: 'Manage inventory levels, optimize stock replenishment, reduce inventory costs, implement inventory systems, forecast demand, and ensure product availability.',
    category: 'Operations'
  },
  {
    id: '518',
    title: 'Facilities Manager',
    company: 'Google',
    level: 'Senior',
    description: 'Manage office facilities, coordinate maintenance, ensure workplace safety, manage vendors, optimize space utilization, and create positive work environments.',
    category: 'Operations'
  },
  // Additional HR Roles
  {
    id: '519',
    title: 'Diversity and Inclusion Manager',
    company: 'Salesforce',
    level: 'Senior',
    description: 'Develop D&I strategies, implement inclusion programs, track diversity metrics, conduct bias training, build inclusive culture, and drive equitable hiring practices.',
    category: 'Human Resources'
  },
  {
    id: '520',
    title: 'Benefits Manager',
    company: 'Apple',
    level: 'Senior',
    description: 'Manage employee benefits programs, negotiate with vendors, ensure compliance, communicate benefits, analyze benefits utilization, and optimize benefits offerings.',
    category: 'Human Resources'
  },
  {
    id: '521',
    title: 'Employee Relations Specialist',
    company: 'Amazon',
    level: 'Mid-Level',
    description: 'Handle employee relations issues, conduct investigations, mediate conflicts, ensure policy compliance, provide coaching to managers, and maintain positive workplace culture.',
    category: 'Human Resources'
  },
  {
    id: '522',
    title: 'Organizational Development Consultant',
    company: 'McKinsey & Company',
    level: 'Senior',
    description: 'Design organizational structures, lead change management, develop leadership programs, assess organizational culture, facilitate team effectiveness, and drive organizational transformation.',
    category: 'Human Resources'
  },
  // Additional Healthcare Roles
  {
    id: '523',
    title: 'Physician Assistant',
    company: 'Stanford Health Care',
    level: 'Mid-Level',
    description: 'Provide patient care, diagnose illnesses, prescribe treatments, assist in surgeries, order tests, educate patients, and collaborate with physicians.',
    category: 'Healthcare'
  },
  {
    id: '524',
    title: 'Public Health Analyst',
    company: 'Centers for Disease Control',
    level: 'Mid-Level',
    description: 'Analyze health data, track disease outbreaks, conduct epidemiological research, develop public health programs, create health reports, and support policy development.',
    category: 'Healthcare'
  },
  {
    id: '525',
    title: 'Medical Science Liaison',
    company: 'Pfizer',
    level: 'Senior',
    description: 'Engage with healthcare professionals, provide scientific information, support clinical research, present medical data, build relationships with key opinion leaders, and educate on products.',
    category: 'Healthcare'
  },
  {
    id: '526',
    title: 'Healthcare Data Analyst',
    company: 'UnitedHealth Group',
    level: 'Mid-Level',
    description: 'Analyze healthcare data, identify trends, improve patient outcomes, reduce costs, create dashboards, support value-based care, and inform healthcare decisions.',
    category: 'Healthcare'
  },
  // Additional Legal Roles
  {
    id: '527',
    title: 'Litigation Attorney',
    company: 'Skadden Arps',
    level: 'Senior',
    description: 'Handle complex litigation, conduct depositions, draft legal briefs, argue in court, manage discovery, advise clients on legal strategy, and represent clients in trials.',
    category: 'Legal'
  },
  {
    id: '528',
    title: 'Regulatory Counsel',
    company: 'Johnson & Johnson',
    level: 'Senior',
    description: 'Ensure regulatory compliance, advise on FDA regulations, support product approvals, manage regulatory filings, interpret healthcare laws, and mitigate regulatory risks.',
    category: 'Legal'
  },
  {
    id: '529',
    title: 'Commercial Lawyer',
    company: 'Baker McKenzie',
    level: 'Senior',
    description: 'Negotiate commercial agreements, advise on transactions, draft contracts, manage legal risks, support business development, and provide strategic legal counsel.',
    category: 'Legal'
  },
  {
    id: '530',
    title: 'Paralegal',
    company: 'Latham & Watkins',
    level: 'Mid-Level',
    description: 'Support attorneys, conduct legal research, draft documents, manage case files, coordinate with clients, organize evidence, and assist with trial preparation.',
    category: 'Legal'
  },
  // Additional Creative Roles
  {
    id: '531',
    title: 'Social Media Content Creator',
    company: 'TikTok',
    level: 'Mid-Level',
    description: 'Create engaging social content, produce videos, write captions, manage content calendar, analyze engagement metrics, stay current on trends, and build online community.',
    category: 'Creative'
  },
  {
    id: '532',
    title: 'User Experience Writer',
    company: 'Google',
    level: 'Mid-Level',
    description: 'Write product copy, create microcopy, develop voice and tone, collaborate with designers, conduct content testing, ensure clarity, and improve user experience through words.',
    category: 'Creative'
  },
  {
    id: '533',
    title: 'Podcast Producer',
    company: 'Spotify',
    level: 'Mid-Level',
    description: 'Produce podcast episodes, coordinate guests, edit audio, manage production schedules, develop content strategy, grow audience, and ensure high production quality.',
    category: 'Creative'
  },
  {
    id: '534',
    title: 'Illustrator',
    company: 'Pixar',
    level: 'Senior',
    description: 'Create illustrations for films and marketing, develop character designs, produce storyboards, collaborate with directors, maintain artistic style, and bring stories to visual life.',
    category: 'Creative'
  },
  // Additional Engineering Roles
  {
    id: '535',
    title: 'Systems Engineer',
    company: 'Raytheon',
    level: 'Senior',
    description: 'Design complex systems, integrate subsystems, conduct systems analysis, manage technical requirements, coordinate across engineering disciplines, and ensure system performance.',
    category: 'Engineering'
  },
  {
    id: '536',
    title: 'Reliability Engineer',
    company: 'General Electric',
    level: 'Senior',
    description: 'Improve equipment reliability, conduct failure analysis, implement preventive maintenance, analyze reliability data, reduce downtime, and optimize asset performance.',
    category: 'Engineering'
  },
  {
    id: '537',
    title: 'Process Engineer',
    company: 'Intel',
    level: 'Mid-Level',
    description: 'Optimize manufacturing processes, improve yield, reduce costs, implement process controls, troubleshoot production issues, and drive continuous improvement.',
    category: 'Engineering'
  },
  {
    id: '538',
    title: 'Robotics Engineer',
    company: 'Boston Dynamics',
    level: 'Senior',
    description: 'Design robotic systems, develop control algorithms, integrate sensors, program robot behaviors, test prototypes, and advance robotics technology.',
    category: 'Engineering'
  },
  {
    id: '539',
    title: 'Materials Engineer',
    company: '3M',
    level: 'Senior',
    description: 'Develop new materials, test material properties, optimize material performance, support product development, conduct research, and innovate material solutions.',
    category: 'Engineering'
  },
  // Additional Cybersecurity Roles
  {
    id: '540',
    title: 'Incident Response Manager',
    company: 'Mandiant',
    level: 'Lead',
    description: 'Lead incident response team, manage security breaches, coordinate forensic investigations, develop response playbooks, communicate with stakeholders, and improve security posture.',
    category: 'Cybersecurity'
  },
  {
    id: '541',
    title: 'Cloud Security Engineer',
    company: 'AWS',
    level: 'Senior',
    description: 'Secure cloud infrastructure, implement security controls, conduct cloud audits, automate security processes, ensure compliance, and protect cloud workloads.',
    category: 'Cybersecurity'
  },
  {
    id: '542',
    title: 'Identity and Access Management Engineer',
    company: 'Okta',
    level: 'Mid-Level',
    description: 'Manage IAM systems, implement access controls, configure SSO, ensure least privilege, conduct access reviews, and protect identity infrastructure.',
    category: 'Cybersecurity'
  },
  {
    id: '543',
    title: 'Security Compliance Analyst',
    company: 'IBM',
    level: 'Mid-Level',
    description: 'Ensure security compliance, conduct audits, manage certifications, assess controls, document policies, support SOC 2 and ISO audits, and maintain compliance frameworks.',
    category: 'Cybersecurity'
  },
  // Additional Sustainability Roles
  {
    id: '544',
    title: 'Carbon Accounting Specialist',
    company: 'Microsoft',
    level: 'Mid-Level',
    description: 'Measure carbon emissions, calculate carbon footprint, track sustainability metrics, support carbon reduction goals, ensure accurate reporting, and implement carbon accounting systems.',
    category: 'Sustainability'
  },
  {
    id: '545',
    title: 'Circular Economy Manager',
    company: 'IKEA',
    level: 'Senior',
    description: 'Develop circular business models, reduce waste, implement recycling programs, design for sustainability, promote product reuse, and drive circular economy initiatives.',
    category: 'Sustainability'
  },
  {
    id: '546',
    title: 'Sustainability Consultant',
    company: 'Accenture',
    level: 'Senior',
    description: 'Advise clients on sustainability, develop ESG strategies, conduct sustainability assessments, support net-zero goals, implement sustainable practices, and drive corporate responsibility.',
    category: 'Sustainability'
  },
  {
    id: '547',
    title: 'Green Building Consultant',
    company: 'Gensler',
    level: 'Senior',
    description: 'Design sustainable buildings, ensure LEED certification, optimize energy efficiency, specify green materials, conduct sustainability assessments, and promote sustainable architecture.',
    category: 'Sustainability'
  },
  // Additional Real Estate Roles
  {
    id: '548',
    title: 'Real Estate Investment Analyst',
    company: 'Brookfield Asset Management',
    level: 'Mid-Level',
    description: 'Analyze real estate deals, build investment models, conduct market research, evaluate risk-return profiles, support acquisitions, and make investment recommendations.',
    category: 'Real Estate'
  },
  {
    id: '549',
    title: 'Construction Project Manager',
    company: 'Turner Construction',
    level: 'Senior',
    description: 'Manage construction projects, coordinate subcontractors, oversee budgets and schedules, ensure safety compliance, manage quality control, and deliver projects on time.',
    category: 'Real Estate'
  },
  {
    id: '550',
    title: 'Real Estate Portfolio Manager',
    company: 'Prologis',
    level: 'Senior',
    description: 'Manage property portfolios, develop investment strategies, optimize asset performance, coordinate with property managers, analyze market trends, and maximize portfolio returns.',
    category: 'Real Estate'
  },
  {
    id: '551',
    title: 'Acquisitions Manager',
    company: 'Hines',
    level: 'Senior',
    description: 'Source acquisition opportunities, conduct due diligence, negotiate purchase agreements, coordinate financing, evaluate development sites, and execute real estate investments.',
    category: 'Real Estate'
  }
];

export const categories = [
  'All',
  'Technology',
  'Data Science',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Consulting',
  'Operations',
  'Human Resources',
  'Healthcare',
  'Legal',
  'Creative',
  'Engineering',
  'Education',
  'Retail',
  'Cybersecurity',
  'Hospitality',
  'Public Sector',
  'Sustainability',
  'Real Estate'
];

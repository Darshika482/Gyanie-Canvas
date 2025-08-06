import { ResumeContent, PersonalInfo, ResumeSection, DesignSettings, ExperienceItem } from '../types';
import { generateId } from '../utils/helpers';

export const createDefaultPersonalInfo = (): PersonalInfo => ({
  fullName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  summary: '',
  photo: '',
});

export const createDefaultDesignSettings = (): DesignSettings => ({
  templateId: 'enhanced',
  primaryColor: '#2c3e50',
  secondaryColor: '#34495e',
  fontFamily: 'Inter',
  fontSize: 'medium',
  spacing: 4,
  margins: 2,
  pageSize: 'A4',
});

export const createDefaultExperienceItems = (): ExperienceItem[] => [
  {
    id: generateId(),
    company: 'Gutmann',
    position: 'UI/UX Designer',
    location: 'New York, NYC',
    startDate: '2017',
    endDate: 'Present',
    current: true,
    description: [
      'Created and maintained UI standards for 20+ websites, which included over 100 pages',
      'Worked cross-functionally with developers to implement new features and maintain site usability',
      'Re-designed the website and decreased the bounce rate by 40%',
      'Did some front end programming (HTML 5, CSS, JavaScript) to build actual web based prototype',
      'Improved load speed on mobile, from 14 to 6 seconds, by applying recommendations by Google Lighthouse',
      'App successfully connected a user base of over 150 babysitters and parents',
    ],
  },
  {
    id: generateId(),
    company: 'Padberg',
    position: 'Junior UX Designer',
    location: 'New York, NYC',
    startDate: '2007',
    endDate: '2009',
    current: false,
    description: [
      'Achieved 85%+ student completion rate on lectures, videos & assignments',
      'Established a team of 3 covering every key role on an early stage',
      'Reached 400% in user retention on Padberg website, by introducing public interest articles and video',
    ],
  },
];

export const createDefaultEducationItems = () => [
  {
    id: generateId(),
    institution: 'University of New York',
    degree: 'MBA Study Seminar, International Business',
    field: 'Business Administration',
    location: 'New York, NYC',
    startDate: '2005',
    endDate: '2009',
    gpa: '3.8',
    honors: ['Dean\'s List', 'Graduated with Distinction'],
  },
  {
    id: generateId(),
    institution: 'Virgin Business Start-up',
    degree: 'Mentoring Training Course',
    field: 'Business Development',
    location: 'New York, NYC',
    startDate: '2019',
    endDate: '2021',
    gpa: '',
    honors: ['Top Performer Award'],
  },
];

export const createDefaultSkillsItems = () => [
  {
    id: generateId(),
    category: 'Design Tools',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Axure'],
  },
  {
    id: generateId(),
    category: 'Programming',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'],
  },
  {
    id: generateId(),
    category: 'Design Software',
    skills: ['Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro'],
  },
  {
    id: generateId(),
    category: 'Project Management',
    skills: ['Jira', 'Trello', 'Asana', 'Slack', 'Notion'],
  },
];

export const createDefaultProjectsItems = () => [
  {
    id: generateId(),
    name: 'E-commerce Mobile App Redesign',
    description: 'Redesigned the entire user experience for a major retail client, resulting in 40% increase in conversion rates',
    technologies: ['Figma', 'React Native', 'Node.js'],
    url: 'https://behance.net/project1',
    github: 'https://github.com/project1',
    startDate: '2023',
    endDate: '2023',
  },
  {
    id: generateId(),
    name: 'Healthcare Dashboard',
    description: 'Created an intuitive dashboard for healthcare professionals to manage patient data and appointments',
    technologies: ['Adobe XD', 'React', 'TypeScript'],
    url: 'https://behance.net/project2',
    github: 'https://github.com/project2',
    startDate: '2022',
    endDate: '2022',
  },
];

export const createDefaultCertificationsItems = () => [
  {
    id: generateId(),
    name: 'Google UX Design Professional Certificate',
    issuer: 'Google',
    date: '2023',
    url: 'https://coursera.org/verify/cert1',
  },
  {
    id: generateId(),
    name: 'Adobe Certified Expert - Photoshop',
    issuer: 'Adobe',
    date: '2022',
    url: 'https://adobe.com/certification',
  },
];

export const createDefaultLanguagesItems = () => [
  {
    id: generateId(),
    language: 'English',
    proficiency: 'Native',
    level: 5,
  },
  {
    id: generateId(),
    language: 'Spanish',
    proficiency: 'Fluent',
    level: 4,
  },
  {
    id: generateId(),
    language: 'French',
    proficiency: 'Intermediate',
    level: 3,
  },
];

export const createDefaultAwardsItems = () => [
  {
    id: generateId(),
    title: 'Best UX Design Award',
    organization: 'Design Week Conference',
    date: '2023',
    description: 'Recognized for outstanding user experience design in mobile applications',
  },
  {
    id: generateId(),
    title: 'Employee of the Year',
    organization: 'Gutmann',
    date: '2022',
    description: 'Awarded for exceptional performance and innovative design solutions',
  },
];

export const createDefaultPublicationsItems = () => [
  {
    id: generateId(),
    title: 'The Future of Mobile UX Design',
    publication: 'UX Design Magazine',
    date: '2023',
    url: 'https://uxdesignmag.com/article1',
  },
  {
    id: generateId(),
    title: 'Accessibility in Modern Web Design',
    publication: 'Web Design Weekly',
    date: '2022',
    url: 'https://webdesignweekly.com/article2',
  },
];

export const createDefaultVolunteerItems = () => [
  {
    id: generateId(),
    organization: 'Design for Good',
    role: 'UX Design Mentor',
    location: 'New York, NYC',
    startDate: '2021',
    endDate: 'Present',
    description: 'Mentoring aspiring designers and helping non-profits improve their digital presence',
  },
  {
    id: generateId(),
    organization: 'Local Community Center',
    role: 'Digital Literacy Instructor',
    location: 'New York, NYC',
    startDate: '2020',
    endDate: '2022',
    description: 'Teaching basic computer skills and digital tools to community members',
  },
];

export const createDefaultInterestsItems = () => [
  {
    id: generateId(),
    category: 'Creative',
    interests: ['Photography', 'Digital Art', 'Typography', 'Color Theory'],
  },
  {
    id: generateId(),
    category: 'Technology',
    interests: ['AI/ML', 'AR/VR', 'Blockchain', 'IoT'],
  },
  {
    id: generateId(),
    category: 'Personal',
    interests: ['Travel', 'Cooking', 'Hiking', 'Reading'],
  },
];

export const createDefaultReferencesItems = () => [
  {
    id: generateId(),
    name: 'Sarah Johnson',
    title: 'Senior UX Designer',
    company: 'Gutmann',
    email: 'sarah.johnson@gutmann.com',
    phone: '+1-555-0123',
  },
  {
    id: generateId(),
    name: 'Michael Chen',
    title: 'Design Director',
    company: 'Creative Agency',
    email: 'michael.chen@creative.com',
    phone: '+1-555-0456',
  },
];

export const createDefaultCoursesItems = () => [
  {
    id: generateId(),
    course: 'Advanced UI/UX Design',
    provider: 'Coursera',
    duration: '6 months',
    period: 'Jan 2023 - Jun 2023',
    description: 'Comprehensive course covering advanced design principles and user research methodologies',
  },
  {
    id: generateId(),
    course: 'Frontend Development Bootcamp',
    provider: 'Udemy',
    duration: '3 months',
    period: 'Mar 2022 - May 2022',
    description: 'Intensive course on modern frontend technologies and responsive design',
  },
];

export const createDefaultOrganizationsItems = () => [
  {
    id: generateId(),
    name: 'UX Designers Association',
    role: 'Member',
    startDate: '2021',
    endDate: 'Present',
    description: 'Active member contributing to design community discussions and events',
  },
  {
    id: generateId(),
    name: 'Women in Tech',
    role: 'Volunteer',
    startDate: '2020',
    endDate: 'Present',
    description: 'Supporting initiatives to increase women representation in technology',
  },
];

export const createDefaultPatentsItems = () => [
  {
    id: generateId(),
    title: 'Adaptive User Interface System',
    patentNumber: 'US20230012345A1',
    date: '2023',
    description: 'Innovative system for automatically adjusting UI elements based on user behavior patterns',
  },
];

export const createDefaultSections = (): ResumeSection[] => [
  {
    id: generateId(),
    type: 'experience',
    title: 'Experience',
    visible: true,
    order: 1,
    content: createDefaultExperienceItems(),
  },
  {
    id: generateId(),
    type: 'education',
    title: 'Education',
    visible: true,
    order: 2,
    content: createDefaultEducationItems(),
  },
  {
    id: generateId(),
    type: 'skills',
    title: 'Skills',
    visible: true,
    order: 3,
    content: createDefaultSkillsItems(),
  },
  {
    id: generateId(),
    type: 'projects',
    title: 'Projects',
    visible: true,
    order: 4,
    content: createDefaultProjectsItems(),
  },
  {
    id: generateId(),
    type: 'certifications',
    title: 'Certifications',
    visible: true,
    order: 5,
    content: createDefaultCertificationsItems(),
  },
  {
    id: generateId(),
    type: 'languages',
    title: 'Languages',
    visible: true,
    order: 6,
    content: createDefaultLanguagesItems(),
  },
  {
    id: generateId(),
    type: 'awards',
    title: 'Awards',
    visible: true,
    order: 7,
    content: createDefaultAwardsItems(),
  },
  {
    id: generateId(),
    type: 'publications',
    title: 'Publications',
    visible: false,
    order: 8,
    content: createDefaultPublicationsItems(),
  },
  {
    id: generateId(),
    type: 'volunteer',
    title: 'Volunteer',
    visible: true,
    order: 9,
    content: createDefaultVolunteerItems(),
  },
  {
    id: generateId(),
    type: 'interests',
    title: 'Interests',
    visible: false,
    order: 10,
    content: createDefaultInterestsItems(),
  },
  {
    id: generateId(),
    type: 'references',
    title: 'References',
    visible: false,
    order: 11,
    content: createDefaultReferencesItems(),
  },
  {
    id: generateId(),
    type: 'courses',
    title: 'Courses',
    visible: true,
    order: 12,
    content: createDefaultCoursesItems(),
  },
  {
    id: generateId(),
    type: 'organizations',
    title: 'Organizations',
    visible: true,
    order: 13,
    content: createDefaultOrganizationsItems(),
  },
  {
    id: generateId(),
    type: 'patents',
    title: 'Patents',
    visible: false,
    order: 14,
    content: createDefaultPatentsItems(),
  },
];

export const createDefaultResumeContent = (): ResumeContent => ({
  personalInfo: createDefaultPersonalInfo(),
  sections: createDefaultSections(),
  design: createDefaultDesignSettings(),
});

export const sampleResumeData = {
  personalInfo: {
    fullName: 'Isabelle Todd',
    email: 'anitacooks@gmail.com',
    phone: '+1-124-161-8172',
    location: 'New York, NYC',
    website: 'behance.com/__NAME__',
    linkedin: '',
    summary: 'Experienced UI/UX Designer with 5+ years in creating user-centered digital experiences',
    photo: '',
  },
  experience: [
    {
      id: generateId(),
      company: 'Gutmann',
      position: 'UI/UX Designer',
      location: 'New York, NYC',
      startDate: '2017',
      endDate: 'Present',
      current: true,
      description: [
        'Created and maintained UI standards for 20+ websites, which included over 100 pages',
        'Worked cross-functionally with developers to implement new features and maintain site usability',
        'Re-designed the website and decreased the bounce rate by 40%',
        'Did some front end programming (HTML 5, CSS, JavaScript) to build actual web based prototype',
        'Improved load speed on mobile, from 14 to 6 seconds, by applying recommendations by Google Lighthouse',
        'App successfully connected a user base of over 150 babysitters and parents',
      ],
    },
    {
      id: generateId(),
      company: 'Padberg',
      position: 'Junior UX Designer',
      location: 'New York, NYC',
      startDate: '2007',
      endDate: '2009',
      current: false,
      description: [
        'Achieved 85%+ student completion rate on lectures, videos & assignments',
        'Established a team of 3 covering every key role on an early stage',
        'Reached 400% in user retention on Padberg website, by introducing public interest articles and video',
      ],
    },
  ],
  skills: [
    {
      id: generateId(),
      category: 'Softwares',
      skills: ['Axure', 'Photoshop', 'Visual Studio', 'Office'],
    },
    {
      id: generateId(),
      category: 'Hardware',
      skills: ['Troubleshooting', 'PC-Building', 'Over Clocking'],
    },
  ],
  training: [
    {
      id: generateId(),
      course: 'UI/UX Designing',
      provider: 'INSTA DIGITAL',
      duration: '3 months',
      period: 'Sep 2015 to Nov 2015',
      description: 'Worked as UI designer for 3 months in INSTA DIGITAL (Virar)',
    },
    {
      id: generateId(),
      course: 'Jr. Web Developer',
      provider: 'INSTA DIGITAL',
      duration: '4 months',
      period: 'Jan 2016 to Apr 2016',
      description: 'Worked as Jr. web developer for 4 months in INSTA DIGITAL (Virar)',
    },
  ],
  languages: [
    {
      id: generateId(),
      language: 'HTML and CSS',
      proficiency: 'Proficient',
      level: 4,
    },
    {
      id: generateId(),
      language: 'Javascript',
      proficiency: 'Intermediate',
      level: 2,
    },
  ],
};
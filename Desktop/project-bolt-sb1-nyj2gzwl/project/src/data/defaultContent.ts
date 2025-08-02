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
  templateId: 'double-column',
  primaryColor: '#00bcd4',
  secondaryColor: '#1b1e27',
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
    content: [],
  },
  {
    id: generateId(),
    type: 'skills',
    title: 'Skills',
    visible: true,
    order: 3,
    content: [],
  },
  {
    id: generateId(),
    type: 'projects',
    title: 'Projects',
    visible: false,
    order: 4,
    content: [],
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
export interface Resume {
  id: string;
  title: string;
  lastModified: Date;
  templateId: string;
  thumbnail: string;
  content: ResumeContent;
  createdAt: Date;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  design: DesignSettings;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary?: string;
  photo?: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
  content: any;
}

export type SectionType = 
  | 'experience' 
  | 'education' 
  | 'skills' 
  | 'projects' 
  | 'certifications' 
  | 'languages' 
  | 'awards' 
  | 'publications' 
  | 'volunteer' 
  | 'interests' 
  | 'references' 
  | 'courses' 
  | 'organizations' 
  | 'patents' 
  | 'custom';

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate: string;
}

export interface DesignSettings {
  templateId: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: number;
  margins: number;
  pageSize: 'A4' | 'US Letter' | 'Legal';
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  isPremium: boolean;
  features: string[];
  description: string;
}

export interface CreateResumeMethod {
  id: 'upload' | 'linkedin' | 'ai';
  title: string;
  description: string;
  icon: string;
}

export interface AIResumeData {
  fullName: string;
  jobTitle: string;
  yearsExperience: number;
  skills: string[];
  location: string;
  industry: string;
}
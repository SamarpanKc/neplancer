// Comprehensive type definitions for profile creation

export interface FreelancerProfileData {
  // Step 1 - Basic Information
  firstName: string;
  lastName: string;
  professionalTitle: string;
  profilePhoto?: File | string;
  country: string;
  city: string;
  timezone: string;
  phoneNumber: string;
  countryCode: string;
  bio: string;

  // Step 2 - Professional Details
  hourlyRate: number;
  currency: string;
  yearsOfExperience: number;
  availability: 'full-time' | 'part-time' | 'hourly';
  workPreference: 'remote' | 'on-site' | 'hybrid';
  skills: string[];
  category: string;

  // Step 3 - Languages
  languages: Language[];

  // Step 4 - Education
  education: Education[];

  // Step 5 - Work Experience
  workExperience: WorkExperience[];

  // Step 6 - Portfolio & Certifications
  portfolio: PortfolioProject[];
  certifications: Certification[];
}

export interface ClientProfileData {
  // Step 1 - Personal Information
  firstName: string;
  lastName: string;
  profilePhoto?: File | string;
  country: string;
  city: string;
  phoneNumber: string;
  countryCode: string;
  bio: string;

  // Step 2 - Company Information
  companyName: string;
  companySize: 'solo' | '2-10' | '11-50' | '51-200' | '201+';
  industry: string;
  companyWebsite: string;
  companyLogo?: File | string;
  companyDescription: string;

  // Step 3 - Preferences
  projectTypes: string[];
  communicationMethods: string[];
  hiringPreferences: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  url?: string;
  images: (File | string)[];
  completionDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  isOptional?: boolean;
}

export const FREELANCER_STEPS: FormStep[] = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Let\'s start with your personal details',
  },
  {
    id: 2,
    title: 'Professional Details',
    description: 'Tell us about your professional background',
  },
  {
    id: 3,
    title: 'Languages',
    description: 'What languages do you speak?',
  },
  {
    id: 4,
    title: 'Education',
    description: 'Share your educational background',
    isOptional: true,
  },
  {
    id: 5,
    title: 'Work Experience',
    description: 'Your professional work history',
    isOptional: true,
  },
  {
    id: 6,
    title: 'Portfolio & Certifications',
    description: 'Showcase your work and credentials',
    isOptional: true,
  },
  {
    id: 7,
    title: 'Review & Submit',
    description: 'Review your profile before submitting',
  },
];

export const CLIENT_STEPS: FormStep[] = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Tell us about yourself',
  },
  {
    id: 2,
    title: 'Company Information',
    description: 'Share your company details',
  },
  {
    id: 3,
    title: 'Preferences',
    description: 'Set your hiring preferences',
  },
  {
    id: 4,
    title: 'Review & Submit',
    description: 'Review your profile before submitting',
  },
];

export const POPULAR_SKILLS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
  'UI/UX Design', 'Figma', 'Photoshop', 'Illustrator',
  'Content Writing', 'SEO', 'Copywriting',
  'Digital Marketing', 'Social Media', 'Google Ads',
  'Video Editing', 'After Effects', 'Premiere Pro',
  'WordPress', 'Shopify', 'WooCommerce',
  'Java', 'C++', 'C#', 'PHP', 'Ruby',
  'Angular', 'Vue.js', 'Next.js', 'Django', 'Flask',
];

export const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'Video Production',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Blockchain',
  'Game Development',
  'Other',
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NPR', symbol: 'रू', name: 'Nepali Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export const COUNTRY_CODES = [
  { code: '+1', country: 'US/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+977', country: 'Nepal' },
  { code: '+86', country: 'China' },
];

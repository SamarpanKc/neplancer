import { Url } from "next/dist/shared/lib/router/router";

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role: 'client' | 'freelancer';
  profile_completed?: boolean;
  avatar?: string;
  avatarUrl?: string;
  createdAt?: Date;
  stats?: {
    // Freelancer stats
    completedJobs?: number;
    totalEarnings?: number;
    rating?: number;
    // Client stats
    jobsPosted?: number;
    totalSpent?: number;
  };
}

export interface Client extends User {
  role: 'client';
  company?: string;
  jobsPosted: number;
}

export interface Freelancer extends User {
  role: 'freelancer';
  skills: string[];
  hourlyRate?: number;
  portfolio?: string;
  rating?: number;
  completedJobs: number;
  title?: string;
  badges?: string[];
  totalEarned?: number;
  // Extended properties for profile page
  location?: string;
  category?: string;
  bio?: string;
  experienceLevel?: string;
  reviews?: number;
  jobsCompleted?: number;
  totalEarnings?: number;
  responseTime?: string;
  successRate?: number;
  availability?: string;
  isOnline?: boolean;
  languages?: { language: string; proficiency: string; }[];
  education?: string;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  skills: string[];
  clientId: string;
  client?: Client;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  deadline?: Date;
  proposalsCount?: number;
}

// Proposal Types
export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancer?: Freelancer;
  coverLetter: string;
  proposedBudget: number;
  estimatedDuration: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

// Contract Types
export interface Contract {
  id: string;
  jobId: string;
  jobTitle: string;
  job?: Job;
  clientId: string;
  freelancerId: string;
  budget: number;
  totalAmount: number;
  terms: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}

// Portfolio Types
export interface PortfolioItem {
  id: string;
  freelancerId: string;
  title: string;
  description: string;
  image?: string;
  url?: string;
  technologies: string[];
  createdAt: Date;
}

// Review Types
export interface Review {
  id: string;
  freelancerId: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment: string;
  projectTitle?: string;
  date: string;
  createdAt: Date;
}

export type FreelancerProfileFormData = {
  username: string;
  title: string;
  bio: string;
  hourlyRate: number;
  skills: string[];
  portfolioUrl?: string | null;
};

export type ClientProfileFormData = {
  
  company_name: string | null;
  company_description: string | null;
  website:string | null;
  location: string | null;
};

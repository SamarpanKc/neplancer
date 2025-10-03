// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'freelancer';
  avatar?: string;
  createdAt: Date;
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
  job?: Job;
  clientId: string;
  freelancerId: string;
  budget: number;
  terms: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}

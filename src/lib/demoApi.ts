// Demo API Layer - Handles all data operations in demo mode
import { 
  Job, 
  Proposal, 
  Contract, 
  Message, 
  Conversation,
  Freelancer,
  Client,
  User,
  PortfolioItem,
  Review
} from '@/types';
import {
  mockJobs,
  mockProposals,
  mockContracts,
  mockMessages,
  mockConversations,
  mockFreelancers,
  mockClients,
  getUserById,
  getFreelancerById,
  getClientById,
  getJobsByClient,
  getProposalsByFreelancer,
  getProposalsByJob,
  getContractsByUser,
  getMessagesByConversation,
  getConversationsByUser,
  getFreelancerPortfolio,
  getFreelancerReviews,
} from '@/data/mockData';

// ============= Jobs API =============
export async function getAllJobs(): Promise<Job[]> {
  // Simulate network delay
  await delay(300);
  return [...mockJobs];
}

export async function getJobById(id: string): Promise<Job | null> {
  await delay(200);
  return mockJobs.find(job => job.id === id) || null;
}

export async function getJobsByClientId(clientId: string): Promise<Job[]> {
  await delay(250);
  return getJobsByClient(clientId);
}

export async function getJobsByStatus(status: Job['status']): Promise<Job[]> {
  await delay(250);
  return mockJobs.filter(job => job.status === status);
}

export async function createJob(jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
  await delay(400);
  const newJob: Job = {
    ...jobData,
    id: `job-${Date.now()}`,
    createdAt: new Date(),
  };
  mockJobs.push(newJob);
  return newJob;
}

export async function updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
  await delay(300);
  const jobIndex = mockJobs.findIndex(job => job.id === id);
  if (jobIndex === -1) return null;
  
  mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...updates };
  return mockJobs[jobIndex];
}

// ============= Proposals API =============
export async function getAllProposals(): Promise<Proposal[]> {
  await delay(300);
  return [...mockProposals];
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  await delay(200);
  return mockProposals.find(proposal => proposal.id === id) || null;
}

export async function getProposalsByFreelancerId(freelancerId: string): Promise<Proposal[]> {
  await delay(250);
  return getProposalsByFreelancer(freelancerId);
}

export async function getProposalsByJobId(jobId: string): Promise<Proposal[]> {
  await delay(250);
  return getProposalsByJob(jobId);
}

export async function createProposal(proposalData: Omit<Proposal, 'id' | 'createdAt'>): Promise<Proposal> {
  await delay(400);
  const newProposal: Proposal = {
    ...proposalData,
    id: `proposal-${Date.now()}`,
    createdAt: new Date(),
  };
  mockProposals.push(newProposal);
  return newProposal;
}

export async function updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | null> {
  await delay(300);
  const proposalIndex = mockProposals.findIndex(proposal => proposal.id === id);
  if (proposalIndex === -1) return null;
  
  mockProposals[proposalIndex] = { ...mockProposals[proposalIndex], ...updates };
  return mockProposals[proposalIndex];
}

// ============= Contracts API =============
export async function getAllContracts(): Promise<Contract[]> {
  await delay(300);
  return [...mockContracts];
}

export async function getContractById(id: string): Promise<Contract | null> {
  await delay(200);
  return mockContracts.find(contract => contract.id === id) || null;
}

export async function getContractsByUserId(userId: string): Promise<Contract[]> {
  await delay(250);
  return getContractsByUser(userId);
}

export async function createContract(contractData: Omit<Contract, 'id' | 'createdAt'>): Promise<Contract> {
  await delay(400);
  const newContract: Contract = {
    ...contractData,
    id: `contract-${Date.now()}`,
    createdAt: new Date(),
  };
  mockContracts.push(newContract);
  return newContract;
}

export async function updateContract(id: string, updates: Partial<Contract>): Promise<Contract | null> {
  await delay(300);
  const contractIndex = mockContracts.findIndex(contract => contract.id === id);
  if (contractIndex === -1) return null;
  
  mockContracts[contractIndex] = { ...mockContracts[contractIndex], ...updates };
  return mockContracts[contractIndex];
}

// ============= Freelancers API =============
export async function getAllFreelancers(): Promise<Freelancer[]> {
  await delay(300);
  return [...mockFreelancers];
}

export async function getFreelancerByIdApi(id: string): Promise<Freelancer | null> {
  await delay(200);
  return getFreelancerById(id) || null;
}

export async function searchFreelancers(query: {
  skills?: string[];
  category?: string;
  minRating?: number;
  maxHourlyRate?: number;
}): Promise<Freelancer[]> {
  await delay(400);
  
  let results = [...mockFreelancers];
  
  if (query.skills && query.skills.length > 0) {
    results = results.filter(freelancer =>
      query.skills!.some(skill =>
        freelancer.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      )
    );
  }
  
  if (query.minRating) {
    results = results.filter(freelancer => 
      (freelancer.rating || 0) >= query.minRating!
    );
  }
  
  if (query.maxHourlyRate) {
    results = results.filter(freelancer =>
      (freelancer.hourlyRate || Infinity) <= query.maxHourlyRate!
    );
  }
  
  return results;
}

// ============= Clients API =============
export async function getAllClients(): Promise<Client[]> {
  await delay(300);
  return [...mockClients];
}

export async function getClientByIdApi(id: string): Promise<Client | null> {
  await delay(200);
  return getClientById(id) || null;
}

// ============= Messages & Conversations API =============
export async function getConversationsByUserId(userId: string): Promise<Conversation[]> {
  await delay(300);
  return getConversationsByUser(userId);
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  await delay(200);
  return mockConversations.find(conv => conv.id === id) || null;
}

export async function getMessagesByConversationId(conversationId: string): Promise<Message[]> {
  await delay(250);
  return getMessagesByConversation(conversationId);
}

export async function createMessage(messageData: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
  await delay(300);
  const newMessage: Message = {
    ...messageData,
    id: `msg-${Date.now()}`,
    createdAt: new Date(),
  };
  mockMessages.push(newMessage);
  
  // Update conversation's last message
  const conversation = mockConversations.find(c => c.id === messageData.conversationId);
  if (conversation) {
    conversation.lastMessage = newMessage;
    conversation.updatedAt = new Date();
  }
  
  return newMessage;
}

export async function createConversation(participants: string[]): Promise<Conversation> {
  await delay(300);
  const newConversation: Conversation = {
    id: `conv-${Date.now()}`,
    participants,
    updatedAt: new Date(),
  };
  mockConversations.push(newConversation);
  return newConversation;
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  await delay(150);
  const message = mockMessages.find(m => m.id === messageId);
  if (message) {
    message.read = true;
  }
}

// ============= Users API =============
export async function getUserByIdApi(id: string): Promise<User | null> {
  await delay(200);
  return getUserById(id) || null;
}

// Helper function to simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============= Portfolio API =============
export async function getFreelancerPortfolioApi(freelancerId: string): Promise<PortfolioItem[]> {
  await delay(250);
  return getFreelancerPortfolio(freelancerId);
}

// ============= Reviews API =============
export async function getFreelancerReviewsApi(freelancerId: string): Promise<Review[]> {
  await delay(250);
  return getFreelancerReviews(freelancerId);
}

// Export for use in API routes
export const demoApi = {
  // Jobs
  getAllJobs,
  getJobById,
  getJobsByClientId,
  getJobsByStatus,
  createJob,
  updateJob,
  
  // Proposals
  getAllProposals,
  getProposalById,
  getProposalsByFreelancerId,
  getProposalsByJobId,
  createProposal,
  updateProposal,
  
  // Contracts
  getAllContracts,
  getContractById,
  getContractsByUserId,
  createContract,
  updateContract,
  
  // Freelancers
  getAllFreelancers,
  getFreelancerById: getFreelancerByIdApi,
  searchFreelancers,
  
  // Clients
  getAllClients,
  getClientById: getClientByIdApi,
  
  // Messages & Conversations
  getConversationsByUserId,
  getConversationById,
  getMessagesByConversationId,
  createMessage,
  createConversation,
  markMessageAsRead,
  
  // Users
  getUserById: getUserByIdApi,
  
  // Portfolio & Reviews
  getFreelancerPortfolio: getFreelancerPortfolioApi,
  getFreelancerReviews: getFreelancerReviewsApi,
};

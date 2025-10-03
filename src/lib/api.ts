// API utility functions for making requests
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

interface CreateJobData {
  title: string;
  description: string;
  budget?: number;
  [key: string]: unknown;
}

interface CreateProposalData {
  jobId: string;
  coverLetter: string;
  budget: number;
  [key: string]: unknown;
}

interface CreateContractData {
  proposalId: string;
  terms: string;
  [key: string]: unknown;
}

export const api = {
  // Auth
  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  register: (data: { email: string; password: string; name: string; role: string }) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Jobs
  getJobs: () => apiRequest('/jobs', { method: 'GET' }),
  
  getJob: (id: string) => apiRequest(`/jobs/${id}`, { method: 'GET' }),
  
  createJob: (data: CreateJobData) =>
    apiRequest('/jobs', { method: 'POST', body: JSON.stringify(data) }),

  // Proposals
  createProposal: (data: CreateProposalData) =>
    apiRequest('/proposals', { method: 'POST', body: JSON.stringify(data) }),

  // Contracts
  getContracts: () => apiRequest('/contracts', { method: 'GET' }),
  
  createContract: (data: CreateContractData) =>
    apiRequest('/contracts', { method: 'POST', body: JSON.stringify(data) }),
};

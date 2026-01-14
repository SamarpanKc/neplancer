'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import {
  Clock,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  MessageSquare,
  Briefcase,
  Star,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProposalWithDetails {
  id: string;
  job_id: string;
  freelancer_id: string;
  cover_letter: string;
  proposed_budget: number;
  estimated_duration: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  rejection_reason?: string;
  jobs: {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    skills: string[];
    status: string;
    client_id: string;
  };
  freelancers: {
    id: string;
    title: string;
    skills: string[];
    hourly_rate: number;
    rating: number;
    bio: string;
    profile_id: string;
    profiles: {
      full_name: string;
      avatar_url: string;
    };
  };
}

export default function ClientProposalsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const [proposals, setProposals] = useState<ProposalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob] = useState<string | null>(
    searchParams.get('job')
  );
  const [processingProposal, setProcessingProposal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<{[key: string]: string}>({});
  const [showRejectionModal, setShowRejectionModal] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'client') {
      toast.error('Access denied. Clients only.');
      router.push('/dashboard');
      return;
    }

    if (user) {
      fetchProposals();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/proposals');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch proposals');
      }

      // Filter proposals for this client's jobs
      const clientProposals = data.proposals.filter(
        (p: ProposalWithDetails) => p.jobs.client_id === user?.id
      );

      setProposals(clientProposals);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load proposals';
      console.error('Error fetching proposals:', error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (proposalId: string) => {
    if (!confirm('Are you sure you want to accept this proposal? This will notify the freelancer.')) {
      return;
    }

    try {
      setProcessingProposal(proposalId);
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept proposal');
      }

      toast.success('Proposal accepted! The freelancer has been notified.');
      fetchProposals();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept proposal';
      toast.error(errorMessage);
    } finally {
      setProcessingProposal(null);
    }
  };

  const handleReject = async (proposalId: string) => {
    const reason = rejectionReason[proposalId] || '';
    
    try {
      setProcessingProposal(proposalId);
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          rejection_reason: reason 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject proposal');
      }

      toast.success('Proposal rejected.');
      setShowRejectionModal(null);
      setRejectionReason(prev => {
        const updated = {...prev};
        delete updated[proposalId];
        return updated;
      });
      fetchProposals();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject proposal';
      toast.error(errorMessage);
    } finally {
      setProcessingProposal(null);
    }
  };

  const handleChat = async (proposal: ProposalWithDetails) => {
    router.push(`/communication?userId=${proposal.freelancer_id}`);
  };

  const filteredProposals = selectedJob
    ? proposals.filter((p) => p.job_id === selectedJob)
    : proposals;

  const groupedByJob = filteredProposals.reduce((acc, proposal) => {
    const jobId = proposal.job_id;
    if (!acc[jobId]) {
      acc[jobId] = {
        job: proposal.jobs,
        proposals: [],
      };
    }
    acc[jobId].proposals.push(proposal);
    return acc;
  }, {} as Record<string, { job: ProposalWithDetails['jobs']; proposals: ProposalWithDetails[] }>);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Proposals Received</h1>
          <p className="mt-2 text-gray-600">
            Review and manage proposals from freelancers for your job postings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Proposals</p>
                <p className="text-2xl font-bold text-gray-900">{proposals.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {proposals.filter((p) => p.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {proposals.filter((p) => p.status === 'accepted').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {proposals.filter((p) => p.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Proposals by Job */}
        {Object.keys(groupedByJob).length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Proposals Yet
            </h3>
            <p className="text-gray-600">
              You haven&apos;t received any proposals for your jobs yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByJob).map(([jobId, { job, proposals: jobProposals }]) => (
              <div key={jobId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Job Header */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Budget: ₹{job.budget.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {jobProposals.length} proposal{jobProposals.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Proposals List */}
                <div className="divide-y divide-gray-200">
                  {jobProposals.map((proposal) => (
                    <div key={proposal.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        {/* Freelancer Info */}
                        <div className="flex gap-4 flex-1">
                          <div className="flex-shrink-0">
                            {proposal.freelancers.profiles.avatar_url ? (
                              <Image
                                src={proposal.freelancers.profiles.avatar_url}
                                alt={proposal.freelancers.profiles.full_name}
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-8 w-8 text-primary" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {proposal.freelancers.profiles.full_name}
                              </h3>
                              {proposal.freelancers.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {proposal.freelancers.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {proposal.freelancers.title || 'Freelancer'}
                            </p>

                            {/* Proposal Details */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-semibold text-gray-900">
                                  ₹{proposal.proposed_budget.toLocaleString()}
                                </span>
                                <span className="text-gray-500">proposed</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="text-gray-700">{proposal.estimated_duration}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-gray-600" />
                                <span className="text-gray-500">
                                  {new Date(proposal.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Award className="h-4 w-4 text-purple-600" />
                                <span className="text-gray-700">
                                  ₹{proposal.freelancers.hourly_rate}/hr
                                </span>
                              </div>
                            </div>

                            {/* Cover Letter */}
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Cover Letter:</h4>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {proposal.cover_letter}
                              </p>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2">
                              {proposal.freelancers.skills.slice(0, 5).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="ml-4">
                          {proposal.status === 'pending' && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                              Pending
                            </span>
                          )}
                          {proposal.status === 'accepted' && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              Accepted
                            </span>
                          )}
                          {proposal.status === 'rejected' && (
                            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {proposal.status === 'pending' && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleApprove(proposal.id)}
                            disabled={processingProposal === proposal.id}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingProposal === proposal.id ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5" />
                                Accept Proposal
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowRejectionModal(proposal.id)}
                            disabled={processingProposal === proposal.id}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="h-5 w-5" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleChat(proposal)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                          >
                            <MessageSquare className="h-5 w-5" />
                            Message
                          </button>
                        </div>
                      )}

                      {proposal.status === 'accepted' && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleChat(proposal)}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="h-5 w-5" />
                            Start Chat
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reject Proposal
              </h3>
              <p className="text-gray-600 mb-4">
                Would you like to provide a reason for rejecting this proposal? (Optional)
              </p>
              <textarea
                value={rejectionReason[showRejectionModal] || ''}
                onChange={(e) => setRejectionReason(prev => ({
                  ...prev,
                  [showRejectionModal]: e.target.value
                }))}
                placeholder="Optional: Provide feedback to the freelancer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectionModal(null);
                    setRejectionReason(prev => {
                      const updated = {...prev};
                      delete updated[showRejectionModal];
                      return updated;
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(showRejectionModal)}
                  disabled={processingProposal === showRejectionModal}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {processingProposal === showRejectionModal ? 'Rejecting...' : 'Reject Proposal'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

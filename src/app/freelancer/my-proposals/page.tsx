'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Send, Clock, CheckCircle, XCircle, DollarSign, Calendar, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Proposal {
  id: string;
  job_id: string;
  freelancer_id: string;
  cover_letter: string;
  proposed_budget: number;
  estimated_duration: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  jobs: {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    status: string;
    created_at: string;
  };
}

export default function MyProposalsPage() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFreelancerAndProposals();
    }
  }, [user]);

  const loadFreelancerAndProposals = async () => {
    if (!user) return;

    try {
      // Get freelancer ID
      const freelancerRes = await fetch(`/api/freelancers?profileId=${user.id}`);
      if (!freelancerRes.ok) throw new Error('Failed to fetch freelancer');
      
      const freelancerData = await freelancerRes.json();
      const fId = freelancerData.freelancer?.id;
      
      if (!fId) {
        throw new Error('Freelancer profile not found');
      }

      setFreelancerId(fId);

      // Fetch proposals
      const proposalsRes = await fetch(`/api/proposals?freelancerId=${fId}`);
      if (!proposalsRes.ok) throw new Error('Failed to fetch proposals');
      
      const proposalsData = await proposalsRes.json();
      setProposals(proposalsData.proposals || []);
    } catch (error) {
      console.error('Error loading proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0CF574] mx-auto mb-4" />
          <p className="text-gray-600">Loading your proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Proposals</h1>
          <p className="text-gray-600">Track all your submitted job proposals and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Proposals</p>
                <p className="text-3xl font-bold text-gray-900">{proposals.length}</p>
              </div>
              <Send className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {proposals.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Accepted</p>
                <p className="text-3xl font-bold text-green-600">
                  {proposals.filter(p => p.status === 'accepted').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Proposals List */}
        {proposals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Proposals Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any proposals yet. Start applying to jobs to see them here!
            </p>
            <a
              href="/freelancer/browse-jobs"
              className="inline-block px-6 py-3 bg-[#0CF574] text-white rounded-lg hover:bg-[#0CF574]/90 transition font-medium"
            >
              Browse Jobs
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {proposal.jobs?.title || 'Job Title'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {proposal.jobs?.category || 'General'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Submitted {new Date(proposal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(proposal.status)}
                    {getStatusBadge(proposal.status)}
                  </div>
                </div>

                {/* Proposal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Bid</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ₹{proposal.proposed_budget?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {proposal.estimated_duration}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Client's Budget</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ₹{proposal.jobs?.budget?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</p>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">
                    {proposal.cover_letter}
                  </p>
                </div>

                {/* Job Description Preview */}
                {proposal.jobs?.description && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Job Description:</p>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {proposal.jobs.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  AlertCircle,
  Briefcase,
  Search,
  Filter
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { demoApi } from '@/lib/demoApi';
import type { Proposal, Job } from '@/types';

export default function MyProposalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<(Proposal & { job?: Job })[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<(Proposal & { job?: Job })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'freelancer') {
        router.push('/dashboard');
        return;
      }
      await loadProposals(user.id);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProposals = async (freelancerId: string) => {
    try {
      const [allProposals, allJobs] = await Promise.all([
        demoApi.getAllProposals(),
        demoApi.getAllJobs()
      ]);
      
      const userProposals = allProposals
        .filter(proposal => proposal.freelancerId === freelancerId)
        .map(proposal => ({
          ...proposal,
          job: allJobs.find(job => job.id === proposal.jobId)
        }));
      
      setProposals(userProposals);
      setFilteredProposals(userProposals);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = proposals;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(proposal => 
        proposal.job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.coverLetter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.job?.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProposals(filtered);
  }, [searchQuery, statusFilter, proposals]);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      accepted: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200'
    };
    
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      accepted: <CheckCircle2 className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const stats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CF574]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Proposals</h1>
              <p className="text-gray-600">Track all your job proposals and their status</p>
            </div>
            <button
              onClick={() => router.push('/freelancer/browse-jobs')}
              className="px-6 py-3 bg-[#0CF574] text-white rounded-xl hover:bg-[#0CF574]/90 transition font-semibold flex items-center gap-2"
            >
              <Briefcase className="w-5 h-5 text-white" />
              Browse Jobs
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Proposals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search proposals by job title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'accepted' | 'rejected')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent transition appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Proposals List */}
        {filteredProposals.length > 0 ? (
          <div className="space-y-4">
            {filteredProposals.map(proposal => (
              <div
                key={proposal.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-[#0CF574]/10 rounded-lg">
                      <FileText className="w-6 h-6 text-[#0CF574]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {proposal.job?.title || 'Job Title Not Available'}
                        </h3>
                        {getStatusBadge(proposal.status)}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {proposal.job?.category || 'Category'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Proposal Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Your Cover Letter</h4>
                  <p className="text-gray-700 text-sm line-clamp-3">{proposal.coverLetter}</p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">
                      NPR {proposal.proposedBudget.toLocaleString()}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {proposal.estimatedDuration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Submitted {formatDate(proposal.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    Budget: NPR {proposal.job?.budget.toLocaleString() || 'N/A'}
                  </span>
                </div>

                {/* Status Messages */}
                {proposal.status === 'pending' && (
                  <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Waiting for client response</span>
                  </div>
                )}
                
                {proposal.status === 'accepted' && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Congratulations! Your proposal has been accepted</span>
                  </div>
                )}
                
                {proposal.status === 'rejected' && (
                  <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">This proposal was not selected</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/jobs/${proposal.jobId}`)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Job
                  </button>
                  {proposal.status === 'accepted' && (
                    <button
                      onClick={() => router.push(`/communication?job=${proposal.jobId}`)}
                      className="flex-1 px-4 py-2 bg-[#0CF574] text-white rounded-lg hover:bg-[#0CF574]/90 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-white" />
                      Message Client
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start applying to jobs to see your proposals here'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => router.push('/freelancer/browse-jobs')}
                className="px-6 py-3 bg-[#0CF574] text-white rounded-xl hover:bg-[#0CF574]/90 transition font-semibold inline-flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5 text-white" />
                Browse Available Jobs
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

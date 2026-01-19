'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  Users,
  DollarSign,
  FileText,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  UserCheck,
  BarChart3,
  Shield,
  Clock,
  Search,
  Download,
  Settings,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminStats {
  users: {
    total: number;
    active: number;
    suspended: number;
    newThisMonth: number;
    freelancers: number;
    clients: number;
  };
  contracts: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    atRisk: number;
  };
  payments: {
    totalVolume: number;
    pendingPayments: number;
    completedThisMonth: number;
    averageContractValue: number;
    escrowBalance: number;
  };
  disputes: {
    total: number;
    open: number;
    resolved: number;
    pending: number;
  };
  activity: {
    activeUsersToday: number;
    contractsCreatedToday: number;
    paymentsProcessedToday: number;
    messagesExchangedToday: number;
  };
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'client' | 'freelancer';
  created_at: string;
  account_status: string;
  trust_score: number;
  is_admin: boolean;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  contract_title: string;
  client_name: string;
  freelancer_name: string;
}

interface Contract {
  id: string;
  title: string;
  status: string;
  total_amount: number;
  client_name: string;
  freelancer_name: string;
  created_at: string;
  health_status: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedSection, setSelectedSection] = useState<'overview' | 'users' | 'contracts' | 'payments' | 'activity'>('overview');
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!user.is_admin) {
      toast.error('Admin access required');
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/admin/contracts');
      if (response.ok) {
        const data = await response.json();
        setContracts(data.contracts);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/activities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    if (selectedSection === 'users') fetchUsers();
    else if (selectedSection === 'payments') fetchPayments();
    else if (selectedSection === 'contracts') fetchContracts();
    else if (selectedSection === 'activity') fetchActivities();
  }, [selectedSection]);

  // User Management Actions
  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin suspension' })
      });
      
      if (response.ok) {
        toast.success('User suspended successfully');
        fetchUsers();
      } else {
        toast.error('Failed to suspend user');
      }
    } catch (error) {
      toast.error('Error suspending user');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('User activated successfully');
        fetchUsers();
      } else {
        toast.error('Failed to activate user');
      }
    } catch (error) {
      toast.error('Error activating user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure? This action cannot be undone!')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  // Payment Actions
  const handleApprovePayment = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/approve`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Payment approved');
        fetchPayments();
      } else {
        toast.error('Failed to approve payment');
      }
    } catch (error) {
      toast.error('Error approving payment');
    }
  };

  const handleRefundPayment = async (paymentId: string) => {
    if (!confirm('Confirm refund? This will return funds to the client.')) return;
    
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Payment refunded');
        fetchPayments();
      } else {
        toast.error('Failed to refund payment');
      }
    } catch (error) {
      toast.error('Error refunding payment');
    }
  };

  // Contract Actions
  const handleCancelContract = async (contractId: string) => {
    if (!confirm('Cancel this contract? This will refund any escrowed funds.')) return;
    
    try {
      const response = await fetch(`/api/admin/contracts/${contractId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin cancellation' })
      });
      
      if (response.ok) {
        toast.success('Contract cancelled');
        fetchContracts();
      } else {
        toast.error('Failed to cancel contract');
      }
    } catch (error) {
      toast.error('Error cancelling contract');
    }
  };

  const handleExportData = (type: string) => {
    toast.success(`Exporting ${type} data...`);
    // Implement CSV export
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CF574] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Contract Monitoring & Dispute Management</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total At Risk</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAtRisk}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Issues</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.criticalIssues}</p>
                </div>
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Risk</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.highRiskIssues}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Payment Delays</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.paymentDelays}</p>
                </div>
                <DollarSign className="h-10 w-10 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Disputes</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeDisputes}</p>
                </div>
                <FileText className="h-10 w-10 text-blue-500" />
              </div>
            </div>
          </div>
        )}

        {/* Issue Breakdown */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Issue Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{stats.issueBreakdown.abandonedWork}</p>
                <p className="text-sm text-gray-600">Abandoned Work</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{stats.issueBreakdown.paymentDelay}</p>
                <p className="text-sm text-gray-600">Payment Delays</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{stats.issueBreakdown.noActivity}</p>
                <p className="text-sm text-gray-600">No Activity</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.issueBreakdown.disputes}</p>
                <p className="text-sm text-gray-600">Disputes</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setSelectedTab('contracts')}
                className={`py-4 px-6 font-medium text-sm ${
                  selectedTab === 'contracts'
                    ? 'border-b-2 border-[#0CF574] text-[#0CF574]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                At-Risk Contracts ({atRiskContracts.length})
              </button>
              <button
                onClick={() => setSelectedTab('payments')}
                className={`py-4 px-6 font-medium text-sm ${
                  selectedTab === 'payments'
                    ? 'border-b-2 border-[#0CF574] text-[#0CF574]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Payment Issues ({paymentIssues.length})
              </button>
              <button
                onClick={() => setSelectedTab('disputes')}
                className={`py-4 px-6 font-medium text-sm ${
                  selectedTab === 'disputes'
                    ? 'border-b-2 border-[#0CF574] text-[#0CF574]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Active Disputes ({activeDisputes.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'contracts' && (
              <div className="space-y-4">
                {atRiskContracts.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No at-risk contracts found. Great job!</p>
                  </div>
                ) : (
                  atRiskContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getRiskIcon(contract.risk_level)}
                            <h3 className="font-semibold text-lg text-gray-900">{contract.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(contract.risk_level)}`}>
                              {contract.risk_level}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Client:</span> {contract.client_name}
                            </div>
                            <div>
                              <span className="font-medium">Freelancer:</span> {contract.freelancer_name}
                            </div>
                            <div>
                              <span className="font-medium">Issue:</span> {contract.issue_type.replace('_', ' ')}
                            </div>
                            <div>
                              <span className="font-medium">Inactive:</span> {contract.days_inactive} days
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => handleViewContract(contract.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleTakeAction(contract.id, '')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0CF574] text-gray-900 rounded-lg hover:bg-[#0CF574]/90 transition-colors text-sm font-medium"
                          >
                            Take Action
                          </button>
                        </div>
                      </div>
                      {contract.flags && contract.flags.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Flags:</p>
                          <div className="flex flex-wrap gap-2">
                            {contract.flags.map((flag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full text-xs border border-yellow-200"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedTab === 'payments' && (
              <div className="space-y-4">
                {paymentIssues.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No payment issues found!</p>
                  </div>
                ) : (
                  paymentIssues.map((issue) => (
                    <div
                      key={issue.milestone_id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">{issue.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">Milestone: {issue.milestone_title}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Amount:</span> ${issue.amount}
                            </div>
                            <div>
                              <span className="font-medium">Pending:</span> {issue.days_pending} days
                            </div>
                            <div>
                              <span className="font-medium">Client:</span> {issue.client_name}
                            </div>
                            <div>
                              <span className="font-medium">Freelancer:</span> {issue.freelancer_name}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewContract(issue.contract_id)}
                          className="ml-4 px-4 py-2 bg-[#0CF574] text-gray-900 rounded-lg hover:bg-[#0CF574]/90 transition-colors text-sm font-medium"
                        >
                          Investigate
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedTab === 'disputes' && (
              <div className="space-y-4">
                {activeDisputes.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No active disputes!</p>
                  </div>
                ) : (
                  activeDisputes.map((dispute) => (
                    <div
                      key={dispute.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-lg text-gray-900">{dispute.contract.title}</h3>
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              {dispute.dispute_type.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{dispute.reason}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Opened by:</span> {dispute.opener.full_name}
                            </div>
                            <div>
                              <span className="font-medium">Amount:</span> ${dispute.amount_disputed}
                            </div>
                            <div>
                              <span className="font-medium">Status:</span> {dispute.status}
                            </div>
                            <div>
                              <span className="font-medium">Created:</span> {new Date(dispute.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/admin/disputes/${dispute.id}`)}
                          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

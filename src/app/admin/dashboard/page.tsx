'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  Users,
  DollarSign,
  FileText,
  Activity,
  Eye,
  Ban,
  UserCheck,
  BarChart3,
  Shield,
  Clock,
  Search,
  Download,
  Trash2,
  RefreshCw,
  XCircle
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
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Prevent re-initialization on re-renders
  const initialized = useRef(false);
  const accessChecked = useRef(false);

  interface Activity {
    id: string;
    timestamp: string;
    created_at: string;
    action_taken?: string;
    description?: string;
    type: string;
  }

  useEffect(() => {
    // Only run access check once
    if (accessChecked.current) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (!user.is_admin) {
      toast.error('Admin access required');
      router.push('/dashboard');
      return;
    }

    accessChecked.current = true;
    
    // Fetch data only once after access is verified
    if (!initialized.current) {
      fetchDashboardData();
      initialized.current = true;
    }
  }, [user]);

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
    // Implement CSV export logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Super Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">Platform Control Center</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'contracts', label: 'Contracts', icon: FileText },
              { id: 'payments', label: 'Payments', icon: DollarSign },
              { id: 'activity', label: 'Activity Logs', icon: Activity }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedSection(id as 'overview' | 'users' | 'contracts' | 'payments' | 'activity')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap ${
                  selectedSection === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedSection === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* User Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.users.total || 0}</p>
                    <p className="text-xs text-green-600 mt-1">+{stats?.users.newThisMonth || 0} this month</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <div className="mt-4 flex gap-4 text-xs">
                  <span className="text-gray-600">Active: {stats?.users.active || 0}</span>
                  <span className="text-gray-600">Suspended: {stats?.users.suspended || 0}</span>
                </div>
              </div>

              {/* Contract Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Contracts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.contracts.active || 0}</p>
                    <p className="text-xs text-red-600 mt-1">{stats?.contracts.atRisk || 0} at risk</p>
                  </div>
                  <FileText className="h-10 w-10 text-green-600" />
                </div>
                <div className="mt-4 flex gap-4 text-xs">
                  <span className="text-gray-600">Total: {stats?.contracts.total || 0}</span>
                  <span className="text-gray-600">Completed: {stats?.contracts.completed || 0}</span>
                </div>
              </div>

              {/* Payment Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Volume</p>
                    <p className="text-2xl font-bold text-gray-900">${(stats?.payments.totalVolume || 0).toLocaleString()}</p>
                    <p className="text-xs text-orange-600 mt-1">${stats?.payments.pendingPayments || 0} pending</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-600" />
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  Avg: ${stats?.payments.averageContractValue || 0}
                </div>
              </div>

              {/* Activity Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Today</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.activity.activeUsersToday || 0}</p>
                    <p className="text-xs text-blue-600 mt-1">{stats?.activity.contractsCreatedToday || 0} contracts created</p>
                  </div>
                  <Activity className="h-10 w-10 text-purple-600" />
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  {stats?.activity.paymentsProcessedToday || 0} payments
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setSelectedSection('users')}
                  className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center"
                >
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">Manage Users</p>
                </button>
                <button
                  onClick={() => setSelectedSection('contracts')}
                  className="p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-center"
                >
                  <FileText className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">View Contracts</p>
                </button>
                <button
                  onClick={() => setSelectedSection('payments')}
                  className="p-4 border border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 text-center"
                >
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                  <p className="text-sm font-medium">Manage Payments</p>
                </button>
                <button
                  onClick={() => setSelectedSection('activity')}
                  className="p-4 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-center"
                >
                  <Activity className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium">Activity Logs</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <button
                  onClick={() => handleExportData('users')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>

              {/* Search */}
              <div className="mb-4 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trust Score</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.filter(u => 
                      (filterStatus === 'all' || u.account_status === filterStatus) &&
                      (searchTerm === '' || u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'freelancer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.account_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.account_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{user.trust_score || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {user.account_status === 'active' ? (
                              <button
                                onClick={() => handleSuspendUser(user.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Suspend"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(user.id)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Activate"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'contracts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Contract Management</h2>
                <button
                  onClick={() => handleExportData('contracts')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Freelancer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contracts.map((contract) => (
                      <tr key={contract.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium">{contract.title}</p>
                          <p className="text-xs text-gray-500">{new Date(contract.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">{contract.client_name}</td>
                        <td className="px-4 py-3 text-sm">{contract.freelancer_name}</td>
                        <td className="px-4 py-3 font-medium">${contract.total_amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            contract.status === 'active' ? 'bg-green-100 text-green-800' :
                            contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {contract.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            contract.health_status === 'healthy' ? 'bg-green-100 text-green-800' :
                            contract.health_status === 'at_risk' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {contract.health_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/contracts/${contract.id}`)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {contract.status === 'active' && (
                              <button
                                onClick={() => handleCancelContract(contract.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Cancel"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Payment Management</h2>
                <button
                  onClick={() => handleExportData('payments')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From → To</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 text-sm">{payment.contract_title}</td>
                        <td className="px-4 py-3 text-sm">
                          {payment.client_name} → {payment.freelancer_name}
                        </td>
                        <td className="px-4 py-3 font-medium">${payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {payment.status === 'pending' && (
                              <button
                                onClick={() => handleApprovePayment(payment.id)}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Approve
                              </button>
                            )}
                            {payment.status === 'completed' && (
                              <button
                                onClick={() => handleRefundPayment(payment.id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'activity' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Activity Logs</h2>
                <button
                  onClick={() => handleExportData('activity')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>

              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description || activity.action_taken}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp || activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

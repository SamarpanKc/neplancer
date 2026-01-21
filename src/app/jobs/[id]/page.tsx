'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Clock, DollarSign, Briefcase, Star,
  CheckCircle2, Users, Search,
  MessageSquare, Eye, Download, Shield, Award
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface Job {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  duration: string;
  experience_level: string;
  skills_required: string[];
  posted_date: string;
  status: 'active' | 'filled' | 'closed';
  applications_count: number;
  client: {
    id: string;
    username: string;
    company_name: string;
    company_logo: string;
    overall_rating: number;
    total_reviews: number;
    jobs_posted: number;
    hire_rate: number;
    member_since: string;
    payment_verified: boolean;
  };
}

interface Applicant {
  id: string;
  proposal_id: string;
  freelancer_id: string;
  freelancer_name: string;
  freelancer_username: string;
  freelancer_photo: string;
  professional_title: string;
  overall_rating: number;
  total_reviews: number;
  jobs_completed: number;
  success_rate: number;
  proposed_amount: number;
  estimated_delivery: string;
  cover_letter: string;
  application_date: string;
  status: 'pending' | 'accepted' | 'rejected';
  verification: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    payment: boolean;
  };
  skills: string[];
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high' | 'delivery' | 'date'>('date');
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterRating, setFilterRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(null);

  const isJobOwner = user?.id === job?.client.id;

  useEffect(() => {
    fetchJobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) throw new Error('Job not found');
      const data = await response.json();
      setJob(data.job);
      
      // Only fetch applicants if user is the job owner
      if (data.job.client.id === user?.id) {
        const applicantsResponse = await fetch(`/api/jobs/${jobId}/applicants`);
        if (applicantsResponse.ok) {
          const applicantsData = await applicantsResponse.json();
          setApplicants(applicantsData.applicants);
        }
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplicant = async (applicantId: string) => {
    if (!confirm('Are you sure you want to accept this applicant? This will close the job to other applicants.')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}/applicants/${applicantId}/accept`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Applicant accepted successfully!');
        fetchJobDetails();
      } else {
        throw new Error('Failed to accept applicant');
      }
    } catch (error) {
      console.error('Error accepting applicant:', error);
      alert('Failed to accept applicant. Please try again.');
    }
  };

  const handleRejectApplicant = async (applicantId: string) => {
    if (!confirm('Are you sure you want to reject this applicant?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}/applicants/${applicantId}/reject`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Applicant rejected');
        fetchJobDetails();
      } else {
        throw new Error('Failed to reject applicant');
      }
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      alert('Failed to reject applicant. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Filter and sort applicants
  const filteredAndSortedApplicants = applicants
    .filter(applicant => {
      // Search filter
      if (searchQuery && !applicant.freelancer_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !applicant.professional_title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Verified filter
      if (filterVerified && (!applicant.verification.email || !applicant.verification.payment)) {
        return false;
      }

      // Rating filter
      if (filterRating > 0 && applicant.overall_rating < filterRating) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.overall_rating - a.overall_rating;
        case 'price_low':
          return a.proposed_amount - b.proposed_amount;
        case 'price_high':
          return b.proposed_amount - a.proposed_amount;
        case 'delivery':
          return parseInt(a.estimated_delivery) - parseInt(b.estimated_delivery);
        case 'date':
        default:
          return new Date(b.application_date).getTime() - new Date(a.application_date).getTime();
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push('/freelancer/browse-jobs')}>
            Browse Jobs
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Details Section */}
        <Card className="mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{job.applications_count} applications</span>
                  </div>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'active' ? 'bg-green-50 text-green-700' :
                    job.status === 'filled' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
              </div>

              {!isJobOwner && job.status === 'active' && (
                <Button
                  onClick={() => router.push(`/freelancer/apply/${jobId}`)}
                  className="flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Apply Now
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Budget</div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="text-lg font-semibold text-gray-900">{job.duration}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Experience Level</div>
                  <div className="text-lg font-semibold text-gray-900">{job.experience_level}</div>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Posted By Section */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Posted By</h2>
            <div className="flex items-start gap-4">
              <Image
                src={job.client.company_logo || '/default-company.png'}
                alt={job.client.company_name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-lg object-cover"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <button
                      onClick={() => router.push(`/client/${job.client.username}`)}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {job.client.company_name}
                    </button>
                    <p className="text-gray-600">@{job.client.username}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {renderStars(job.client.overall_rating)}
                        <span className="text-sm font-semibold text-gray-900">
                          {job.client.overall_rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({job.client.total_reviews} reviews)
                        </span>
                      </div>
                      {job.client.payment_verified && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Payment Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => router.push(`/client/${job.client.username}`)}
                  >
                    View Profile
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <div className="text-gray-600">Jobs Posted</div>
                    <div className="font-semibold text-gray-900">{job.client.jobs_posted}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Hire Rate</div>
                    <div className="font-semibold text-gray-900">{job.client.hire_rate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Member Since</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(job.client.member_since).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Applicants Section (only visible to job owner) */}
        {isJobOwner && (
          <>
            <Card className="mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Applicants ({applicants.length})
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Export applicants to CSV
                      const csv = applicants.map(a => 
                        `${a.freelancer_name},${a.overall_rating},${a.proposed_amount},${a.application_date}`
                      ).join('\n');
                      const blob = new Blob([`Name,Rating,Amount,Date\n${csv}`], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `applicants-${jobId}.csv`;
                      a.click();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>

                {/* Filters and Sort */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applicants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Sort by: Date</option>
                    <option value="rating">Sort by: Rating</option>
                    <option value="price_low">Sort by: Price (Low to High)</option>
                    <option value="price_high">Sort by: Price (High to Low)</option>
                    <option value="delivery">Sort by: Delivery Time</option>
                  </select>

                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0">All Ratings</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>

                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={filterVerified}
                      onChange={(e) => setFilterVerified(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Verified Only</span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Applicants List */}
            <div className="space-y-4">
              {filteredAndSortedApplicants.length === 0 ? (
                <Card className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applicants Yet</h3>
                  <p className="text-gray-600">
                    {applicants.length === 0
                      ? 'No one has applied to this job yet.'
                      : 'No applicants match your filters.'}
                  </p>
                </Card>
              ) : (
                filteredAndSortedApplicants.map((applicant) => (
                  <Card key={applicant.id} className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Applicant Photo */}
                      <Image
                        src={applicant.freelancer_photo || '/default-avatar.png'}
                        alt={applicant.freelancer_name}
                        width={64}
                        height={64}
                        className="w-20 h-20 rounded-full object-cover"
                      />

                      {/* Applicant Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <button
                              onClick={() => router.push(`/freelancer/${applicant.freelancer_username}`)}
                              className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                            >
                              {applicant.freelancer_name}
                            </button>
                            <p className="text-gray-600">{applicant.professional_title}</p>

                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                {renderStars(applicant.overall_rating)}
                                <span className="text-sm font-semibold text-gray-900">
                                  {applicant.overall_rating.toFixed(1)}
                                </span>
                                <span className="text-sm text-gray-600">
                                  ({applicant.total_reviews})
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Briefcase className="w-4 h-4" />
                                <span>{applicant.jobs_completed} jobs</span>
                              </div>

                              <div className="text-sm font-semibold text-green-600">
                                {applicant.success_rate}% success
                              </div>
                            </div>

                            {/* Verification Badges */}
                            <div className="flex items-center gap-2 mt-2">
                              {applicant.verification.email && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Email</span>
                                </div>
                              )}
                              {applicant.verification.phone && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Phone</span>
                                </div>
                              )}
                              {applicant.verification.identity && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  <Shield className="w-3 h-3" />
                                  <span>ID</span>
                                </div>
                              )}
                              {applicant.verification.payment && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Payment</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Proposal Details */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              ${applicant.proposed_amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              Delivery: {applicant.estimated_delivery}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Applied {new Date(applicant.application_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {applicant.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {applicant.skills.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{applicant.skills.length - 5} more
                            </span>
                          )}
                        </div>

                        {/* Cover Letter Preview */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900">Cover Letter</span>
                            <button
                              onClick={() => setExpandedApplicant(
                                expandedApplicant === applicant.id ? null : applicant.id
                              )}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              {expandedApplicant === applicant.id ? 'Show less' : 'Read more'}
                            </button>
                          </div>
                          <p className={`text-sm text-gray-700 ${
                            expandedApplicant === applicant.id ? '' : 'line-clamp-2'
                          }`}>
                            {applicant.cover_letter}
                          </p>
                        </div>

                        {/* Actions */}
                        {applicant.status === 'pending' && (
                          <div className="flex gap-3">
                            <Button
                              onClick={() => router.push(`/freelancer/${applicant.freelancer_username}`)}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Profile
                            </Button>
                            <Button
                              onClick={() => router.push(`/communication/messages?user=${applicant.freelancer_username}`)}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Message
                            </Button>
                            <Button
                              onClick={() => handleAcceptApplicant(applicant.id)}
                              className="flex-1"
                            >
                              Accept Application
                            </Button>
                            <Button
                              onClick={() => handleRejectApplicant(applicant.id)}
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </div>
                        )}

                        {applicant.status === 'accepted' && (
                          <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Accepted</span>
                          </div>
                        )}

                        {applicant.status === 'rejected' && (
                          <div className="text-gray-500 font-semibold">
                            Rejected
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Star, MapPin, Calendar, Clock, CheckCircle2, Briefcase,
  DollarSign, TrendingUp, MessageSquare, ExternalLink,
  Building2, Users, Globe, Search
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Types
interface ClientProfile {
  id: string;
  username: string;
  company_name: string;
  company_logo: string;
  industry: string;
  location: string;
  member_since: string;
  last_active: string;
  company_description: string;
  company_size: string;
  website: string;
  social_links: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  verification: {
    email: boolean;
    phone: boolean;
    payment: boolean;
  };
  stats: {
    overall_rating: number;
    total_reviews: number;
    jobs_posted: number;
    total_spent: number;
    active_jobs: number;
    hire_rate: number;
    average_payment_time: string;
    successful_completion_rate: number;
    repeat_hire_rate: number;
  };
  ratings_breakdown: {
    communication: number;
    payment_promptness: number;
    clarity: number;
    professionalism: number;
  };
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  applications_count: number;
  posted_date: string;
  status: 'active' | 'filled' | 'closed';
  skills_required: string[];
}

interface Review {
  id: string;
  freelancer_name: string;
  freelancer_username: string;
  freelancer_photo: string;
  job_title: string;
  job_id: string;
  date: string;
  overall_rating: number;
  communication_rating: number;
  payment_promptness_rating: number;
  clarity_rating: number;
  professionalism_rating: number;
  testimonial: string;
  client_response?: string;
  helpful_count: number;
  not_helpful_count: number;
}

export default function ClientPublicProfile() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'reviews'>('overview');
  const [reviewFilter, setReviewFilter] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [reviewSearch, setReviewSearch] = useState('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`/api/client/${username}/profile`);
      if (!response.ok) throw new Error('Profile not found');
      const data = await response.json();
      setProfile(data.profile);
      setJobs(data.jobs);
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'filled':
        return 'text-blue-600 bg-blue-50';
      case 'closed':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredReviews = reviews
    .filter(review =>
      reviewSearch === '' ||
      review.testimonial.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      review.freelancer_name.toLowerCase().includes(reviewSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (reviewFilter === 'highest') return b.overall_rating - a.overall_rating;
      if (reviewFilter === 'lowest') return a.overall_rating - b.overall_rating;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The client profile you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/client/post-job')}>
            Back to Jobs
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <Card className="mb-6">
          <div className="p-8">
            <div className="flex items-start gap-6">
              {/* Company Logo */}
              <Image
                src={profile.company_logo || '/default-company.png'}
                alt={profile.company_name}
                width={128}
                height={128}
                className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-lg"
              />

              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.company_name}</h1>
                    <p className="text-gray-600">@{profile.username}</p>
                    <p className="text-xl text-gray-700 mt-2">{profile.industry}</p>
                  </div>

                  <Button
                    onClick={() => router.push(`/communication/messages?user=${username}`)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contact
                  </Button>
                </div>

                {/* Location and Status */}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{profile.company_size} employees</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(profile.member_since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{profile.last_active}</span>
                  </div>
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    {renderStars(profile.stats.overall_rating, 'lg')}
                    <span className="text-2xl font-bold text-gray-900">
                      {profile.stats.overall_rating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({profile.stats.total_reviews} reviews)
                    </span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    {profile.stats.hire_rate}% Hire Rate
                  </div>
                  <div className="text-gray-700">
                    Avg. payment: {profile.stats.average_payment_time}
                  </div>
                </div>

                {/* Verification Badges */}
                <div className="flex items-center gap-2 mt-4">
                  {profile.verification.email && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Email Verified</span>
                    </div>
                  )}
                  {profile.verification.phone && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Phone Verified</span>
                    </div>
                  )}
                  {profile.verification.payment && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Payment Verified</span>
                    </div>
                  )}
                </div>

                {/* Website and Social Links */}
                {(profile.website || Object.keys(profile.social_links).length > 0) && (
                  <div className="flex items-center gap-4 mt-4">
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {profile.social_links.linkedin && (
                      <a
                        href={profile.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        LinkedIn
                      </a>
                    )}
                    {profile.social_links.twitter && (
                      <a
                        href={profile.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile.stats.jobs_posted}
                </div>
                <div className="text-sm text-gray-600">Jobs Posted</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${profile.stats.total_spent.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile.stats.repeat_hire_rate}%
                </div>
                <div className="text-sm text-gray-600">Repeat Hire Rate</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile.stats.successful_completion_rate}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'jobs', label: `Jobs (${jobs.length})` },
            { id: 'reviews', label: `Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* About Company */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About Company</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.company_description}</p>
              </Card>

              {/* Active Jobs */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Active Jobs</h2>
                  <span className="text-sm text-gray-600">
                    {profile.stats.active_jobs} active
                  </span>
                </div>
                <div className="space-y-4">
                  {jobs.filter(job => job.status === 'active').slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-green-600 font-semibold">
                              ${job.budget_min} - ${job.budget_max}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">
                              {job.applications_count} applications
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-500">
                              Posted {new Date(job.posted_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills_required.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Hiring History */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hiring History</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {profile.stats.jobs_posted}
                    </div>
                    <div className="text-sm text-gray-600">Total Freelancers Hired</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {profile.stats.successful_completion_rate}%
                    </div>
                    <div className="text-sm text-gray-600">Successful Completion</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {profile.stats.repeat_hire_rate}%
                    </div>
                    <div className="text-sm text-gray-600">Repeat Hire Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      ${Math.round(profile.stats.total_spent / profile.stats.jobs_posted).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Project Budget</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Ratings Breakdown */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ratings Breakdown</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Communication', value: profile.ratings_breakdown.communication },
                    { label: 'Payment Promptness', value: profile.ratings_breakdown.payment_promptness },
                    { label: 'Clarity of Requirements', value: profile.ratings_breakdown.clarity },
                    { label: 'Professionalism', value: profile.ratings_breakdown.professionalism },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.value.toFixed(1)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(item.value / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Rating Distribution</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = profile.rating_distribution[stars as keyof typeof profile.rating_distribution];
                      const percentage = (count / profile.stats.total_reviews) * 100;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm text-gray-700 w-8">{stars}★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <Card className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobStatusColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{job.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${job.budget_min} - ${job.budget_max}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{job.applications_count} applications</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value as typeof reviewFilter)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </Card>

            {/* Reviews List */}
            {filteredReviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src={review.freelancer_photo || '/default-avatar.png'}
                    alt={review.freelancer_name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <button
                          onClick={() => router.push(`/freelancer/${review.freelancer_username}`)}
                          className="font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {review.freelancer_name}
                        </button>
                        <button
                          onClick={() => router.push(`/jobs/${review.job_id}`)}
                          className="text-sm text-blue-600 hover:text-blue-700 block"
                        >
                          {review.job_title}
                        </button>
                        <p className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.overall_rating)}
                        <span className="font-semibold text-gray-900">
                          {review.overall_rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-3">
                      {[
                        { label: 'Communication', value: review.communication_rating },
                        { label: 'Payment', value: review.payment_promptness_rating },
                        { label: 'Clarity', value: review.clarity_rating },
                        { label: 'Professionalism', value: review.professionalism_rating },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <div className="text-xs text-gray-600 mb-1">{item.label}</div>
                          <div className="flex justify-center">{renderStars(item.value, 'sm')}</div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-gray-700">{review.testimonial}</p>

                    {review.client_response && (
                      <div className="mt-4 pl-4 border-l-2 border-blue-200 bg-blue-50 p-3 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-blue-900">
                            Response from {profile.company_name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{review.client_response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

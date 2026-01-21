'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, Reply, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_username: string;
  reviewer_photo: string;
  reviewee_name: string;
  reviewee_username: string;
  job_title: string;
  job_id: string;
  date: string;
  overall_rating: number;
  category_ratings: {
    [key: string]: number;
  };
  testimonial: string;
  response?: string;
  helpful_count: number;
  not_helpful_count: number;
  is_verified: boolean;
  can_respond: boolean;
  can_edit: boolean;
  user_voted?: 'helpful' | 'not_helpful' | null;
}

interface ReviewDisplayProps {
  reviews: Review[];
  categoryLabels: { [key: string]: string };
  onVoteHelpful: (reviewId: string) => Promise<void>;
  onVoteNotHelpful: (reviewId: string) => Promise<void>;
  onReport: (reviewId: string, reason: string) => Promise<void>;
  onRespond: (reviewId: string, response: string) => Promise<void>;
  showJobLink?: boolean;
  showReviewerLink?: boolean;
  showRevieweeLink?: boolean;
}

export default function ReviewDisplay({
  reviews,
  categoryLabels,
  onVoteHelpful,
  onVoteNotHelpful,
  onReport,
  onRespond,
  showJobLink = true,
  showReviewerLink = true,
  showRevieweeLink = false,
}: ReviewDisplayProps) {
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [reportingReview, setReportingReview] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
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

  const handleRespond = async (reviewId: string) => {
    if (responseText.trim().length < 20) {
      alert('Response must be at least 20 characters');
      return;
    }

    try {
      await onRespond(reviewId, responseText);
      setRespondingTo(null);
      setResponseText('');
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    }
  };

  const handleReport = async (reviewId: string) => {
    if (!reportReason.trim()) {
      alert('Please provide a reason for reporting');
      return;
    }

    try {
      await onReport(reviewId, reportReason);
      setReportingReview(null);
      setReportReason('');
      alert('Report submitted. We\'ll review it shortly.');
    } catch (error) {
      console.error('Error reporting review:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  if (reviews.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600">Be the first to leave a review!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="p-6">
          <div className="flex items-start gap-4">
            {/* Reviewer Photo */}
            <img
              src={review.reviewer_photo || '/default-avatar.png'}
              alt={review.reviewer_name}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  {showReviewerLink ? (
                    <a
                      href={`/profile/${review.reviewer_username}`}
                      className="font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {review.reviewer_name}
                    </a>
                  ) : (
                    <span className="font-semibold text-gray-900">{review.reviewer_name}</span>
                  )}

                  {showRevieweeLink && (
                    <span className="text-gray-600 text-sm">
                      {' reviewed '}
                      <a
                        href={`/profile/${review.reviewee_username}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {review.reviewee_name}
                      </a>
                    </span>
                  )}

                  {showJobLink && (
                    <a
                      href={`/jobs/${review.job_id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 block"
                    >
                      {review.job_title}
                    </a>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    {review.is_verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="flex items-center gap-2">
                  {renderStars(review.overall_rating)}
                  <span className="font-semibold text-gray-900">
                    {review.overall_rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Category Ratings */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 mb-4">
                {Object.entries(review.category_ratings).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs text-gray-600 mb-1">
                      {categoryLabels[key] || key}
                    </div>
                    <div className="flex justify-center">{renderStars(value, 'sm')}</div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <p className="text-gray-700 leading-relaxed">{review.testimonial}</p>

              {/* Response */}
              {review.response && (
                <div className="mt-4 pl-4 border-l-2 border-blue-200 bg-blue-50 p-4 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                      Response from {review.reviewee_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{review.response}</p>
                </div>
              )}

              {/* Response Form */}
              {respondingTo === review.id && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    placeholder="Write your response... (minimum 20 characters)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">
                      {responseText.length}/20 characters minimum
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setRespondingTo(null);
                          setResponseText('');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleRespond(review.id)}
                        size="sm"
                        disabled={responseText.trim().length < 20}
                      >
                        Submit Response
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mt-4 text-sm">
                <button
                  onClick={() => onVoteHelpful(review.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    review.user_voted === 'helpful'
                      ? 'text-green-600'
                      : 'text-gray-500 hover:text-green-600'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful_count})</span>
                </button>

                <button
                  onClick={() => onVoteNotHelpful(review.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    review.user_voted === 'not_helpful'
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Not Helpful ({review.not_helpful_count})</span>
                </button>

                {review.can_respond && !review.response && (
                  <button
                    onClick={() => setRespondingTo(review.id)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Respond</span>
                  </button>
                )}

                <button
                  onClick={() => setReportingReview(review.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-orange-600"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Report Modal */}
          {reportingReview === review.id && (
            <div className="mt-4 p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-gray-900">Report Review</span>
              </div>

              <label className="block text-sm text-gray-700 mb-2">
                Why are you reporting this review?
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
              >
                <option value="">Select a reason...</option>
                <option value="spam">Spam or irrelevant content</option>
                <option value="offensive">Offensive or inappropriate language</option>
                <option value="false">False or misleading information</option>
                <option value="personal">Contains personal information</option>
                <option value="conflict">Conflict of interest</option>
                <option value="other">Other</option>
              </select>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setReportingReview(null);
                    setReportReason('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReport(review.id)}
                  size="sm"
                  disabled={!reportReason}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Submit Report
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

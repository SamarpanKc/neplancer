'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewFormProps {
  jobId: string;
  jobTitle: string;
  revieweeType: 'freelancer' | 'client';
  revieweeName: string;
  onClose: () => void;
  onSubmit: (review: ReviewData) => Promise<void>;
}

interface ReviewData {
  overall_rating: number;
  category_ratings: {
    [key: string]: number;
  };
  testimonial: string;
  would_work_again: boolean;
  is_public: boolean;
}

export default function ReviewForm({
  jobTitle,
  revieweeType,
  revieweeName,
  onClose,
  onSubmit,
}: ReviewFormProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<{ [key: string]: number }>({
    quality: 0,
    communication: 0,
    deadlines: 0,
    professionalism: 0,
  });
  const [testimonial, setTestimonial] = useState('');
  const [wouldWorkAgain, setWouldWorkAgain] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [hoveredStar, setHoveredStar] = useState<{ category: string; star: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category labels based on reviewee type
  const categoryLabels = revieweeType === 'freelancer'
    ? {
        quality: 'Quality of Work',
        communication: 'Communication',
        deadlines: 'Adherence to Deadlines',
        professionalism: 'Professionalism',
      }
    : {
        communication: 'Communication Clarity',
        payment: 'Payment Promptness',
        clarity: 'Requirement Clarity',
        professionalism: 'Professionalism',
      };

  const handleSubmit = async () => {
    if (overallRating === 0) {
      alert('Please provide an overall rating');
      return;
    }

    if (Object.values(categoryRatings).some(rating => rating === 0)) {
      alert('Please rate all categories');
      return;
    }

    if (testimonial.length < 50) {
      alert('Please write a testimonial of at least 50 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        overall_rating: overallRating,
        category_ratings: categoryRatings,
        testimonial,
        would_work_again: wouldWorkAgain,
        is_public: isPublic,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (
    category: string,
    currentRating: number,
    onRate: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isHovered = hoveredStar?.category === category && star <= hoveredStar.star;
          const isFilled = star <= currentRating;
          
          return (
            <button
              key={star}
              type="button"
              onClick={() => onRate(star)}
              onMouseEnter={() => setHoveredStar({ category, star })}
              onMouseLeave={() => setHoveredStar(null)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  isHovered || isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Leave a Review</h2>
              <p className="text-gray-600 mt-1">
                How was your experience with {revieweeName} on &quot;{jobTitle}&quot;?
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Overall Rating */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {renderStars('overall', overallRating, setOverallRating)}
              {overallRating > 0 && (
                <span className="text-lg font-semibold text-gray-900 ml-2">
                  {overallRating}.0
                </span>
              )}
            </div>
          </div>

          {/* Category Ratings */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Rate by Category *
            </label>
            <div className="space-y-4">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{label}</span>
                  <div className="flex items-center gap-2">
                    {renderStars(key, categoryRatings[key] || 0, (rating) =>
                      setCategoryRatings(prev => ({ ...prev, [key]: rating }))
                    )}
                    {categoryRatings[key] > 0 && (
                      <span className="text-sm font-semibold text-gray-900 ml-2 w-8">
                        {categoryRatings[key]}.0
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Written Testimonial */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Written Testimonial *
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Minimum 50 characters)
              </span>
            </label>
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              rows={6}
              placeholder={`Share your experience working with ${revieweeName}. What went well? What could have been better?`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">
                {testimonial.length}/50 characters minimum
              </span>
              {testimonial.length >= 50 && (
                <span className="text-sm text-green-600">✓ Meets minimum</span>
              )}
            </div>
          </div>

          {/* Would Work Again */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={wouldWorkAgain}
                onChange={(e) => setWouldWorkAgain(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">
                I would {revieweeType === 'freelancer' ? 'hire' : 'work with'} {revieweeName} again
              </span>
            </label>
          </div>

          {/* Public/Private Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">
                Make this review public
              </span>
            </label>
            <p className="text-sm text-gray-500 ml-8">
              Public reviews are visible on {revieweeName}&apos;s profile. Private reviews are only visible to you and the platform.
            </p>
          </div>

          {/* Verified Badge Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              ✓ This review will be marked as &quot;Verified&quot; since it&apos;s from a completed job on our platform.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting || overallRating === 0 || testimonial.length < 50}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>

          {/* Edit Window Info */}
          <p className="text-xs text-gray-500 text-center mt-4">
            You can edit this review within 48 hours of posting
          </p>
        </div>
      </Card>
    </div>
  );
}

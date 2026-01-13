'use client';

import { useState } from 'react';
import { X, DollarSign, Clock, Send } from 'lucide-react';
import { Job } from '@/types';

interface ApplyJobModalProps {
  job: Job;
  freelancerId: string;
  onClose: () => void;
  onSubmit: (data: {
    job_id: string;
    freelancer_id: string;
    cover_letter: string;
    proposed_budget: number;
    estimated_duration: string;
  }) => Promise<void>;
}

export default function ApplyJobModal({
  job,
  freelancerId,
  onClose,
  onSubmit,
}: ApplyJobModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedBudget, setProposedBudget] = useState(job.budget.toString());
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!coverLetter.trim()) {
      setError('Please write a cover letter');
      return;
    }

    if (!proposedBudget || parseFloat(proposedBudget) <= 0) {
      setError('Please enter a valid budget');
      return;
    }

    if (!estimatedDuration.trim()) {
      setError('Please enter estimated duration');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        job_id: job.id,
        freelancer_id: freelancerId,
        cover_letter: coverLetter,
        proposed_budget: parseFloat(proposedBudget),
        estimated_duration: estimatedDuration,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply for Job</h2>
            <p className="text-gray-600 mt-1">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Job Details Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Client Budget:</span>
              <span>₹{job.budget.toLocaleString()}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none resize-none"
              rows={8}
              placeholder="Explain why you're the best fit for this project. Highlight your relevant experience and skills..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {coverLetter.length}/2000 characters
            </p>
          </div>

          {/* Proposed Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Your Proposed Budget (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={proposedBudget}
              onChange={(e) => setProposedBudget(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="Enter your proposed budget"
              min="1"
              step="0.01"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              You can propose a different budget than the client's
            </p>
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Estimated Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="e.g., 2 weeks, 1 month, 3 days"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              How long will it take you to complete this project?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#0CF574] text-gray-900 rounded-lg hover:bg-[#0CF574]/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

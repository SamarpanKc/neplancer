'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Manrope } from 'next/font/google';
import { useAuth } from '@/hooks/useAuth';
import { Briefcase, DollarSign, Calendar, Tag, CheckCircle2 } from 'lucide-react';

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const JOB_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'Video Production',
  'Data Science',
  'Other'
];

const POPULAR_SKILLS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
  'UI/UX Design', 'Figma', 'Photoshop', 'Illustrator',
  'Content Writing', 'SEO', 'Copywriting',
  'Digital Marketing', 'Social Media', 'Google Ads',
  'Video Editing', 'After Effects', 'Premiere Pro'
];

export default function PostJobPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    skills: [] as string[],
    deadline: '',
    customSkill: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'client') {
      router.push('/freelancer/browse-jobs');
      return;
    }
  }, [user, authLoading, router]);

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const addCustomSkill = () => {
    if (formData.customSkill.trim() && !formData.skills.includes(formData.customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.customSkill.trim()],
        customSkill: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Job title is required');
      return;
    }
    if (!formData.description.trim() || formData.description.length < 50) {
      setError('Job description must be at least 50 characters');
      return;
    }
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      setError('Please enter a valid budget');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setIsLoading(true);

    try {
      // First, fetch the client ID using the user's profile ID
      console.log('Fetching client for profile ID:', user?.id);
      const clientResponse = await fetch(`/api/clients?profileId=${user?.id}`);
      
      // Log the response status
      console.log('Client response status:', clientResponse.status);
      
      // Get response text first to see what we're getting
      const clientText = await clientResponse.text();
      console.log('Client response text:', clientText);

      // Try to parse as JSON
      let clientData;
      try {
        clientData = JSON.parse(clientText);
      } catch (parseError) {
        console.error('Failed to parse client response:', parseError);
        throw new Error('Invalid response from server. Please check console for details.');
      }

      if (!clientResponse.ok || !clientData.client) {
        throw new Error(clientData.error || 'Client profile not found. Please try logging in again.');
      }

      console.log('Client ID found:', clientData.client.id);

      // Now create the job with the client ID
      const jobPayload = {
        clientId: clientData.client.id,
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        category: formData.category,
        skills: formData.skills,
        deadline: formData.deadline || null,
      };

      console.log('Creating job with payload:', jobPayload);

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload),
      });

      console.log('Job response status:', response.status);

      // Get response text first
      const responseText = await response.text();
      console.log('Job response text:', responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse job response:', parseError);
        throw new Error('Invalid response from server. Please check console for details.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post job');
      }

      console.log('Job created successfully:', data);

      // Success! Redirect to jobs page
      router.push('/client/jobs');
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to post job');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className={`${manrope.className} min-h-screen bg-gradient-to-br from-background via-[#0CF574]/5 to-background px-4 py-12`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Post a Job
          </h1>
          <p className="text-gray-600">
            Find the perfect freelancer for your project
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CF574]"
                  placeholder="e.g., Build a Modern E-commerce Website"
                />
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description * (Min. 50 characters)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CF574] min-h-[150px]"
                placeholder="Describe your project in detail... What are you looking for? What are the requirements?"
              />
              <p className="mt-1 text-sm text-gray-500">{formData.description.length} characters</p>
            </div>

            {/* Budget & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget (NPR) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CF574]"
                    placeholder="50000"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CF574] appearance-none"
                  >
                    <option value="">Select a category</option>
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Deadline (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deadline (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CF574]"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Skills Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Required Skills *
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {POPULAR_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      formData.skills.includes(skill)
                        ? 'bg-[#0CF574] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {/* Custom Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.customSkill}
                  onChange={(e) => setFormData({ ...formData, customSkill: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0CF574]"
                  placeholder="Add custom skill"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Selected Skills ({formData.skills.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <div
                        key={skill}
                        className="px-4 py-2 bg-[#0CF574] text-white rounded-full flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className="hover:bg-white/20 rounded-full p-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-[#0CF574] text-white rounded-lg font-semibold hover:bg-[#0CF574]/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Posting...' : 'Post Job'}
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
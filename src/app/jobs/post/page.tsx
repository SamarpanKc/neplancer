'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useWorkflow } from '@/contexts/WorkflowContext';
import WelcomeBanner from '@/components/workflow/WelcomeBanner';
import VerificationModal from '@/components/workflow/VerificationModal';
import {
  DollarSign,
  Plus, Paperclip, X, AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface JobPostData {
  title: string;
  description: string;
  category: string;
  budget_type: 'fixed' | 'hourly';
  budget_amount?: number;
  budget_min?: number;
  budget_max?: number;
  duration: string;
  experience_level: 'entry' | 'intermediate' | 'expert';
  skills: string[];
  attachments: File[];
}

export default function ClientPostJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const workflow = useWorkflow();
  
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationModalType, setVerificationModalType] = useState<'bank-details-incomplete' | 'email-not-verified'>('bank-details-incomplete');
  
  const [formData, setFormData] = useState<JobPostData>({
    title: '',
    description: '',
    category: '',
    budget_type: 'fixed',
    budget_amount: 0,
    duration: '',
    experience_level: 'intermediate',
    skills: [],
    attachments: [],
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user is newly registered
  useEffect(() => {
    if (user && workflow.state.jobsPosted === 0 && !workflow.state.hasSeenWelcomeBanner) {
      setShowWelcomeBanner(true);
    }
    
    // Restore saved job post data if redirected back
    if (workflow.state.savedJobPostData) {
      setFormData(workflow.state.savedJobPostData as unknown as JobPostData);
    }
  }, [user, workflow]);
  
  const handleDismissWelcome = () => {
    setShowWelcomeBanner(false);
    workflow.markWelcomeBannerSeen();
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.description.trim() || formData.description.length < 100) {
      newErrors.description = 'Description must be at least 100 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (formData.budget_type === 'fixed') {
      if (!formData.budget_amount || formData.budget_amount <= 0) {
        newErrors.budget = 'Please enter a valid budget';
      }
    } else {
      if (!formData.budget_min || !formData.budget_max || formData.budget_min >= formData.budget_max) {
        newErrors.budget = 'Please enter a valid hourly rate range';
      }
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Please select project duration';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'Add at least one required skill';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Check if bank details are completed
    const canPost = await workflow.checkCanPostJob();
    
    if (!canPost.canPost) {
      // Save current form data
      workflow.saveJobPost(formData as unknown as Record<string, unknown>);
      
      // Show appropriate modal
      if (canPost.reason === 'email-not-verified') {
        setVerificationModalType('email-not-verified');
      } else {
        setVerificationModalType('bank-details-incomplete');
      }
      setShowVerificationModal(true);
      return;
    }
    
    // Submit job post
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update workflow state
        workflow.incrementJobsPosted();
        workflow.clearSavedState();
        workflow.updateClientStage('job-posted');
        
        // Send confirmation email (handled by backend)
        
        // Redirect to job page
        router.push(`/jobs/${data.jobId}?posted=true`);
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Failed to post job' });
      }
    } catch (error) {
      console.error('Failed to post job:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };
  
  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };
  
  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <WelcomeBanner
          userRole="client"
          userName={user?.name}
          variant="first-time"
          onDismiss={handleDismissWelcome}
        />
      )}
      
      {/* Verification Modal */}
      {showVerificationModal && (
        <VerificationModal
          type={verificationModalType}
          isOpen={true}
          onClose={() => setShowVerificationModal(false)}
          context={{
            action: 'post a job',
          }}
        />
      )}
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-gray-600">Find the perfect freelancer for your project</p>
      </div>
      
      {/* Job Post Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Build a responsive e-commerce website"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.title}
            </p>
          )}
        </Card>
        
        {/* Job Description */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your project in detail..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.description.length} / 100 minimum characters
          </p>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.description}
            </p>
          )}
        </Card>
        
        {/* Category and Experience */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="design">Design</option>
                <option value="writing">Writing</option>
                <option value="marketing">Marketing</option>
                <option value="data-science">Data Science</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value as JobPostData['experience_level'] }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        </Card>
        
        {/* Budget */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-4">
            Budget <span className="text-red-500">*</span>
          </label>
          
          {/* Budget Type */}
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="fixed"
                checked={formData.budget_type === 'fixed'}
                onChange={() => setFormData(prev => ({ ...prev, budget_type: 'fixed' }))}
                className="w-4 h-4"
              />
              <span>Fixed Price</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="hourly"
                checked={formData.budget_type === 'hourly'}
                onChange={() => setFormData(prev => ({ ...prev, budget_type: 'hourly' }))}
                className="w-4 h-4"
              />
              <span>Hourly Rate</span>
            </label>
          </div>
          
          {/* Budget Amount */}
          {formData.budget_type === 'fixed' ? (
            <div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={formData.budget_amount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_amount: parseFloat(e.target.value) }))}
                  placeholder="Enter amount"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Minimum ($/hr)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={formData.budget_min || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_min: parseFloat(e.target.value) }))}
                    placeholder="Min"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Maximum ($/hr)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={formData.budget_max || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_max: parseFloat(e.target.value) }))}
                    placeholder="Max"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
          )}
        </Card>
        
        {/* Duration */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">
            Project Duration <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select duration</option>
            <option value="less-than-1-week">Less than 1 week</option>
            <option value="1-2-weeks">1-2 weeks</option>
            <option value="2-4-weeks">2-4 weeks</option>
            <option value="1-3-months">1-3 months</option>
            <option value="3-6-months">3-6 months</option>
            <option value="more-than-6-months">More than 6 months</option>
          </select>
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </Card>
        
        {/* Skills */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">
            Required Skills <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Type a skill and press Enter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button type="button" onClick={addSkill}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          {errors.skills && (
            <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
          )}
        </Card>
        
        {/* Attachments */}
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">
            Attachments (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Upload project files, requirements, or references
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button type="button" variant="outline" asChild>
                <span>Choose Files</span>
              </Button>
            </label>
          </div>
          {formData.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-red-700">{errors.submit}</p>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Posting...
              </>
            ) : (
              'Post Job'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

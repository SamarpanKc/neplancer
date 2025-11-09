'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  DollarSign, 
  Calendar, 
  FileText, 
  Tag, 
  Clock,
  Plus,
  X,
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { demoApi } from '@/lib/demoApi';

const categories = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'Video Editing',
  'Data Entry',
  'Other'
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level', description: 'New freelancers' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { value: 'expert', label: 'Expert', description: 'Highly experienced' }
];

const projectDurations = [
  { value: 'less-than-week', label: 'Less than a week' },
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '2-4-weeks', label: '2-4 weeks' },
  { value: '1-2-months', label: '1-2 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: 'more-than-6-months', label: 'More than 6 months' }
];

export default function PostJobPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    experienceLevel: 'intermediate',
    projectDuration: '2-4-weeks',
    skills: [] as string[],
    deadline: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'client') {
        router.push('/dashboard');
        return;
      }
      setCurrentUser(user);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      skills: prev.skills.filter(skill => skill !== skillToRemove) 
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.budget || parseFloat(formData.budget) <= 0) newErrors.budget = 'Please enter a valid budget';
    if (formData.skills.length === 0) newErrors.skills = 'Add at least one required skill';
    if (!formData.deadline) newErrors.deadline = 'Please select a deadline';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await demoApi.createJob({
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        category: formData.category,
        skills: formData.skills,
        clientId: currentUser?.id || '',
        status: 'open',
        createdAt: new Date(),
        deadline: new Date(formData.deadline)
      });

      setSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push('/client/jobs');
      }, 2000);
    } catch (error) {
      console.error('Error creating job:', error);
      setErrors({ submit: 'Failed to create job. Please try again.' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CF574]"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Job Posted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your job has been posted and is now visible to freelancers.
          </p>
          <div className="animate-pulse text-[#0CF574] font-medium">
            Redirecting to your jobs...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#0CF574] rounded-xl">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          </div>
          <p className="text-gray-600 ml-16">
            Fill in the details to find the perfect freelancer for your project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
              <FileText className="w-5 h-5 text-[#0CF574]" />
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Build a Responsive E-commerce Website"
              className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent transition`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
            <p className="text-xs text-gray-500 mt-2">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
              <Sparkles className="w-5 h-5 text-[#0CF574]" />
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              placeholder="Describe your project in detail... What needs to be done? What are your expectations? Any specific requirements?"
              className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent transition resize-none`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
            <p className="text-xs text-gray-500 mt-2">
              {formData.description.length}/2000 characters · Minimum 50 characters
            </p>
          </div>

          {/* Category and Budget */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                <Tag className="w-5 h-5 text-[#0CF574]" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent transition bg-white`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
            </div>

            {/* Budget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                <DollarSign className="w-5 h-5 text-[#0CF574]" />
                Budget (NPR)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="50000"
                min="0"
                step="1000"
                className={`w-full px-4 py-3 border ${errors.budget ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent transition`}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-2">{errors.budget}</p>}
            </div>
          </div>

          {/* Experience Level and Duration */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Experience Level */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="text-lg font-semibold text-gray-900 mb-4 block">
                Experience Level
              </label>
              <div className="space-y-3">
                {experienceLevels.map(level => (
                  <label key={level.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level.value}
                      checked={formData.experienceLevel === level.value}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-[#0CF574] focus:ring-[#0CF574]"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-500">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Project Duration */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                <Clock className="w-5 h-5 text-[#0CF574]" />
                Project Duration
              </label>
              <select
                name="projectDuration"
                value={formData.projectDuration}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent transition bg-white"
              >
                {projectDurations.map(duration => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="text-lg font-semibold text-gray-900 mb-3 block">
              Required Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-6 py-3 bg-[#0CF574] text-white rounded-lg hover:bg-[#0CF574]/90 transition font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
            {errors.skills && <p className="text-red-500 text-sm mb-3">{errors.skills}</p>}
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-[#0CF574]/10 text-[#0CF574] rounded-full font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-[#0CF574]/20 rounded-full p-1 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Deadline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
              <Calendar className="w-5 h-5 text-[#0CF574]" />
              Project Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border ${errors.deadline ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent transition`}
            />
            {errors.deadline && <p className="text-red-500 text-sm mt-2">{errors.deadline}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-4 bg-[#0CF574] text-white rounded-xl hover:bg-[#0CF574]/90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5" />
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { 
  User, 
  DollarSign, 
  Link2,
  Save,
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  Camera
} from 'lucide-react';

interface FreelancerData {
  username: string;
  title: string;
  bio: string;
  hourlyRate: number;
  skills: string[];
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
}

export default function FreelancerProfileSetup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<FreelancerData>({
    username: '',
    title: '',
    bio: '',
    hourlyRate: 0,
    skills: [],
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: ''
  });

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.title || !formData.bio) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.skills.length === 0) {
      alert('Please add at least one skill');
      return;
    }

    if (formData.hourlyRate <= 0) {
      alert('Please enter a valid hourly rate');
      return;
    }
    
    setLoading(true);
    
    try {
      // TODO: Replace with actual Supabase integration
      // 1. Upload avatar to Supabase Storage
      // 2. Get avatar URL
      // 3. Insert into freelancers table with profile_id from auth
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Freelancer profile saved:', {
        ...formData,
        avatar: avatarFile ? 'Avatar file ready for upload' : null
      });
      
      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = '/freelancer/dashboard';
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Created!</h2>
          <p className="text-gray-600 mb-4">
            Your freelancer profile has been successfully created. Redirecting to dashboard...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0CF574] mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#0CF574]/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#0CF574]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Your Freelancer Profile
              </h1>
            </div>
          </div>
          <p className="text-gray-600">
            Set up your profile to start finding work and connecting with clients
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Profile Picture
            </label>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#0CF574] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0CF574]/90 transition shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Upload your profile picture</p>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                {avatarFile && (
                  <p className="text-xs text-[#0CF574] mt-1 font-medium">
                    ✓ {avatarFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="johndoe"
            />
            <p className="text-xs text-gray-500 mt-1">This will be your unique identifier on the platform</p>
          </div>

          {/* Professional Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="Full Stack Developer"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none resize-none"
              placeholder="Tell clients about yourself, your experience, and what makes you unique. Highlight your expertise and what you can offer..."
            />
            <p className="text-xs text-gray-500 mt-1">{formData.bio.length} characters</p>
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Hourly Rate (NPR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.hourlyRate || ''}
              onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value) || 0})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="1000"
            />
            <p className="text-xs text-gray-500 mt-1">Set your base hourly rate for projects</p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
                placeholder="Add a skill (e.g., React, Python, UI/UX Design)"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-[#0CF574] text-white rounded-lg hover:bg-[#0CF574]/90 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            {formData.skills.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">Add at least one skill to showcase your expertise</p>
            )}
          </div>

          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Link2 className="w-4 h-4 inline mr-1" />
              Portfolio URL
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="https://yourportfolio.com"
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Profile
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="https://github.com/yourusername"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-6 py-3 bg-[#0CF574] text-white rounded-lg hover:bg-[#0CF574]/90 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Complete Profile & Continue
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-3">
              You can update your profile information anytime from your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
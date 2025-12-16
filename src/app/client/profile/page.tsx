'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Building,
  MapPin,
  Save,
  ArrowLeft,
  CheckCircle,
  Camera,
  Globe
} from 'lucide-react';

interface ClientData {
  clientType: 'individual' | 'company';
  companyName: string;
  location: string;
  website: string;
  companyDescription: string;
  industry: string;
  jobTitle?: string; // For individual clients
}

export default function ClientProfileSetup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();
  const { user, initialize, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<ClientData>({
    clientType: 'individual',
    companyName: '',
    location: '',
    website: '',
    companyDescription: '',
    industry: '',
    jobTitle: '',
  });
  
  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Redirect if not authenticated or not a client
  useEffect(() => {
    if (user && user.role !== 'client') {
      router.push('/dashboard');
    } else if (!user && !isLoading) {
      // Give some time for auth to initialize before redirecting
      const timer = setTimeout(() => {
        if (!user) {
          router.push('/login');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, router, isLoading]);

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
    // Validation based on client type
    if (formData.clientType === 'company') {
      if (!formData.companyName || !formData.location || !formData.companyDescription) {
        alert('Please fill in all required fields (Company Name, Location, Description)');
        return;
      }
    } else {
      // Individual client
      if (!formData.location) {
        alert('Please fill in your location');
        return;
      }
    }

    if (!user) {
      alert('You must be logged in to create a profile');
      router.push('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      // Update client profile using the new endpoint
      const clientResponse = await fetch(`/api/clients/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_type: formData.clientType,
          company_name: formData.clientType === 'company' ? formData.companyName : null,
          location: formData.location,
          website: formData.website || null,
          company_description: formData.clientType === 'company' ? formData.companyDescription : null,
          industry: formData.industry || null,
          job_title: formData.clientType === 'individual' ? formData.jobTitle : null,
          // TODO: Add logo upload functionality
        }),
      });

      if (!clientResponse.ok) {
        const errorData = await clientResponse.json();
        throw new Error(errorData.error || 'Failed to update client profile');
      }

      // Update profile_completed flag
      const profileResponse = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_completed: true,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile status');
      }

      // Update local auth state
      await initialize();
      
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to save profile. Please try again.');
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
            Your company profile has been successfully created. Redirecting to dashboard...
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
              <Building className="w-6 h-6 text-[#0CF574]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Your Client Profile
              </h1>
            </div>
          </div>
          <p className="text-gray-600">
            Set up your profile to start posting jobs and hiring talented freelancers
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Client Type Selection */}
          <div className="pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am hiring as
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, clientType: 'individual' })}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  formData.clientType === 'individual'
                    ? 'border-[#0CF574] bg-[#0CF574]/10 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">👤</div>
                <div className="font-semibold text-gray-900">Individual</div>
                <div className="text-xs text-gray-600 mt-1">Personal projects</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, clientType: 'company' })}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  formData.clientType === 'company'
                    ? 'border-[#0CF574] bg-[#0CF574]/10 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">🏢</div>
                <div className="font-semibold text-gray-900">Company</div>
                <div className="text-xs text-gray-600 mt-1">Business hiring</div>
              </button>
            </div>
          </div>
          {/* Logo Upload */}
          <div className="pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {formData.clientType === 'company' ? 'Company Logo' : 'Profile Picture'}
            </label>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Logo preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building className="w-12 h-12 text-gray-400" />
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
                <p className="text-sm text-gray-600 mb-1">
                  {formData.clientType === 'company' ? 'Upload your company logo' : 'Upload your profile picture'}
                </p>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                {avatarFile && (
                  <p className="text-xs text-[#0CF574] mt-1 font-medium">
                    ✓ {avatarFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Company Name or Job Title based on type */}
          {formData.clientType === 'company' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
                placeholder="Your Company Name Ltd."
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Job Title/Role (Optional)
              </label>
              <input
                type="text"
                value={formData.jobTitle || ''}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
                placeholder="e.g., Project Manager, Business Owner"
              />
              <p className="text-xs text-gray-500 mt-1">Help freelancers understand your role</p>
            </div>
          )}

          {/* Industry - only for companies */}
          {formData.clientType === 'company' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              >
                <option value="">Select an industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="consulting">Consulting</option>
                <option value="marketing">Marketing & Advertising</option>
                <option value="real-estate">Real Estate</option>
                <option value="hospitality">Hospitality</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="Kathmandu, Nepal"
            />
            <p className="text-xs text-gray-500 mt-1">City, Country or Region</p>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              {formData.clientType === 'company' ? 'Company Website' : 'Website/Portfolio (Optional)'}
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder={formData.clientType === 'company' ? 'https://www.yourcompany.com' : 'https://yourwebsite.com'}
            />
          </div>

          {/* Company Description or About - conditional */}
          {formData.clientType === 'company' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={formData.companyDescription}
                onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none resize-none"
                placeholder="Tell freelancers about your company, what you do, your mission, and what makes you unique..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.companyDescription.length} characters</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  {formData.clientType === 'company' ? 'Why complete your profile?' : 'Quick Tips for Hiring'}
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {formData.clientType === 'company' ? (
                    <>
                      <li>• Attract high-quality freelancers</li>
                      <li>• Build trust and credibility</li>
                      <li>• Get better proposal responses</li>
                      <li>• Stand out from other clients</li>
                    </>
                  ) : (
                    <>
                      <li>• Provide clear project details for better matches</li>
                      <li>• Build your reputation with reviews</li>
                      <li>• Secure payments through the platform</li>
                      <li>• Communicate directly with freelancers</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
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
        
        <div className="flex justify-center">
   
  <button className ="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition underline"
  onClick = {() => router.push('/components/ClientDashboard')}>
    Skip for now
    </button>
      </div>
      </div>
    </div>
  );
}
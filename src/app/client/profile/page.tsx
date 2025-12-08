'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building,
  Link2,
  MapPin,
  Save,
  ArrowLeft,
  CheckCircle,
  Camera,
  Globe
} from 'lucide-react';

interface ClientData {
  companyName: string;
  location: string;
  website: string;
  companyDescription: string;
  industry: string;
}

export default function ClientProfileSetup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();
  
  const [formData, setFormData] = useState<ClientData>({
    companyName: '',
    location: '',
    website: '',
    companyDescription: '',
    industry: ''
  });

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
    if (!formData.companyName || !formData.location || !formData.companyDescription) {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // TODO: Replace with actual Supabase integration
      // 1. Upload logo to Supabase Storage
      // 2. Get logo URL
      // 3. Insert into clients table with profile_id from auth
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Client profile saved:', {
        ...formData,
        logo: avatarFile ? 'Logo file ready for upload' : null
      });
      
      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = '/client/dashboard';
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
                Complete Your Company Profile
              </h1>
            </div>
          </div>
          <p className="text-gray-600">
            Set up your company profile to start posting jobs and hiring talented freelancers
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Logo Upload */}
          <div className="pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Company Logo
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
                <p className="text-sm text-gray-600 mb-1">Upload your company logo</p>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                {avatarFile && (
                  <p className="text-xs text-[#0CF574] mt-1 font-medium">
                    ✓ {avatarFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="Acme Corporation"
            />
          </div>

          {/* Industry */}
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
              Company Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent outline-none"
              placeholder="https://www.yourcompany.com"
            />
          </div>

          {/* Company Description */}
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
            />
            <p className="text-xs text-gray-500 mt-1">{formData.companyDescription.length} characters</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Why complete your profile?</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Attract high-quality freelancers</li>
                  <li>• Build trust and credibility</li>
                  <li>• Get better proposal responses</li>
                  <li>• Stand out from other clients</li>
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
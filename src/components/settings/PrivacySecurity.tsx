"use client"

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Globe, Lock, Shield } from "lucide-react";

export default function PrivacySecurity() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowSearchEngines: true,
    showOnlineStatus: true
  });

  const [dataSettings, setDataSettings] = useState({
    collectAnalytics: true,
    personalizedAds: false,
    shareWithPartners: false
  });

  const handleSavePrivacy = () => {
    // TODO: Save privacy settings
    alert("Privacy settings saved successfully");
  };

  const handleSaveData = () => {
    // TODO: Save data settings
    alert("Data settings saved successfully");
  };

  const handleDownloadData = () => {
    // TODO: Implement data download
    alert("Your data download request has been submitted. You'll receive an email with a download link within 24 hours.");
  };

  const handleDeleteData = () => {
    if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      // TODO: Implement data deletion
      alert("Data deletion request submitted");
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Profile Privacy</h2>
            <p className="text-sm text-gray-600">Control who can see your profile and information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Visibility
            </label>
            <select 
              value={privacySettings.profileVisibility}
              onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
            >
              <option value="public">Public - Anyone can view your profile</option>
              <option value="registered">Registered Users - Only logged-in users can view</option>
              <option value="private">Private - Only you can view your profile</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Show Email Address</h3>
              <p className="text-sm text-gray-500">Display your email on your public profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={privacySettings.showEmail}
                onChange={(e) => setPrivacySettings({...privacySettings, showEmail: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Show Phone Number</h3>
              <p className="text-sm text-gray-500">Display your phone number on your public profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={privacySettings.showPhone}
                onChange={(e) => setPrivacySettings({...privacySettings, showPhone: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Show Location</h3>
              <p className="text-sm text-gray-500">Display your city and country on your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={privacySettings.showLocation}
                onChange={(e) => setPrivacySettings({...privacySettings, showLocation: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Allow Search Engine Indexing</h3>
              <p className="text-sm text-gray-500">Let search engines like Google index your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={privacySettings.allowSearchEngines}
                onChange={(e) => setPrivacySettings({...privacySettings, allowSearchEngines: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">Show Online Status</h3>
              <p className="text-sm text-gray-500">Let others see when you&apos;re online</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={privacySettings.showOnlineStatus}
                onChange={(e) => setPrivacySettings({...privacySettings, showOnlineStatus: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleSavePrivacy} className="bg-foreground hover:bg-gray-800">
            Save Privacy Settings
          </Button>
        </div>
      </Card>

      {/* Data & Analytics */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Data & Analytics</h2>
            <p className="text-sm text-gray-600">Manage how we use your data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Analytics & Performance</h3>
              <p className="text-sm text-gray-500">Help us improve the platform by sharing usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={dataSettings.collectAnalytics}
                onChange={(e) => setDataSettings({...dataSettings, collectAnalytics: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Personalized Advertising</h3>
              <p className="text-sm text-gray-500">See ads tailored to your interests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={dataSettings.personalizedAds}
                onChange={(e) => setDataSettings({...dataSettings, personalizedAds: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">Share with Partners</h3>
              <p className="text-sm text-gray-500">Allow trusted partners to contact you with relevant opportunities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={dataSettings.shareWithPartners}
                onChange={(e) => setDataSettings({...dataSettings, shareWithPartners: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleSaveData} className="bg-foreground hover:bg-gray-800">
            Save Data Settings
          </Button>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Lock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
            <p className="text-sm text-gray-600">Download or delete your personal data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Download Your Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Request a copy of all your personal data stored on Neplancer. This includes your profile, projects, messages, and activity history.
            </p>
            <Button onClick={handleDownloadData} variant="outline">
              Request Data Download
            </Button>
          </div>

          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-medium text-red-900 mb-2">Delete Your Data</h3>
            <p className="text-sm text-red-700 mb-4">
              Permanently delete all your personal data from our servers. This action cannot be undone and will not delete your account.
            </p>
            <Button onClick={handleDeleteData} variant="outline" className="text-red-600 border-red-600 hover:bg-red-100">
              Delete Personal Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Connected Accounts */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Connected Accounts</h2>
            <p className="text-sm text-gray-600">Manage your social account connections</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">GitHub</h3>
                <p className="text-sm text-gray-500">Connected as @johndoe</p>
              </div>
            </div>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              Disconnect
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">LinkedIn</h3>
                <p className="text-sm text-gray-500">Not connected</p>
              </div>
            </div>
            <Button variant="outline">
              Connect
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Twitter</h3>
                <p className="text-sm text-gray-500">Not connected</p>
              </div>
            </div>
            <Button variant="outline">
              Connect
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

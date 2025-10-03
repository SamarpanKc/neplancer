"use client"
import React, { useState } from 'react';
import { Manrope } from "next/font/google";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import FreelancerCard from './FreelancerCard';
import { freelancersData } from '@/data/freelancers';

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
});

const HeroSection = () => {
  const router = useRouter();
  const { isAuthenticated, isClient, isFreelancer } = useAuth();
  const [activeTab, setActiveTab] = useState<'hire' | 'get-hired'>('hire');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tab: 'hire' | 'get-hired') => {
    setActiveTab(tab);
    setSearchQuery(''); // Reset search when switching tabs
  };

  const handleBrowse = () => {
    if (activeTab === 'hire') {
      // Client wants to hire - go to browse freelancers or post job
      if (isAuthenticated && isClient) {
        router.push('/client/post-job');
      } else {
        router.push('/register'); // Redirect to register as client
      }
    } else {
      // Freelancer wants to get hired - go to browse jobs
      if (isAuthenticated && isFreelancer) {
        router.push('/freelancer/browse-jobs');
      } else {
        router.push('/register'); // Redirect to register as freelancer
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results based on active tab
      if (activeTab === 'hire') {
        router.push(`/search/freelancers?q=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push(`/freelancer/browse-jobs?q=${encodeURIComponent(searchQuery)}`);
      }
    } else {
      handleBrowse();
    }
  };

  const handleCategoryClick = (category: string) => {
    if (activeTab === 'hire') {
      router.push(`/search/freelancers?category=${encodeURIComponent(category)}`);
    } else {
      router.push(`/freelancer/browse-jobs?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <>
    <div className={`${manrope.className} min-h-screen bg-gradient-to-b from-background to-[#0CF574]/28 flex flex-col items-center justify-center px-8 pb-20`}>
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => handleTabChange('hire')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'hire'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
            aria-label="Switch to hire mode"
          >
            HIRE
          </button>
          <button
            onClick={() => handleTabChange('get-hired')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'get-hired'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
            aria-label="Switch to get hired mode"
          >
            GET HIRED
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-2 leading-tight -tracking-wider">
          {activeTab === 'hire' ? 'Find the perfect talent' : 'Find your next opportunity'}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-xl text-gray-600 mb-16 leading-relaxed max-w-3xl mx-auto">
          {activeTab === 'hire' 
            ? "Discover, connect, and work with Nepal's best independent creatives."
            : "Connect with top companies and showcase your skills to get hired."}
        </p>

        {/* Search Section */}
        <div className="flex items-center justify-center max-w-4xl mx-auto">
          {/* Combined Search Input and Button */}
          <form onSubmit={handleSearch} className="relative w-full max-w-3xl">
            <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
              {/* Search Icon */}
              <div className="pl-6 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'hire' ? 'What do you need help with?' : 'What kind of work are you looking for?'}
                className="flex-1 py-4 px-2 text-lg bg-transparent font-semibold border-none focus:outline-none placeholder-gray-500"
              />
              
              {/* Browse Button */}
              <button 
                type="submit"
                className="bg-gray-900 text-white px-8 py-3 font-semibold text-lg hover:bg-black cursor-pointer transition-colors duration-200 whitespace-nowrap rounded-full mr-1"
              >
                {activeTab === 'hire' ? 'Browse 1M+ independents' : 'Browse available jobs'}
              </button>
            </div>
          </form>
        </div>

        {/* Popular searches or categories */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {['Logo Design', 'Web Development', 'Content Writing', 'Marketing', 'Video Editing'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="px-4 py-2 font-medium bg-white border border-gray-200 rounded-full text-sm text-foreground/70 hover:border-gray-300 hover:text-gray-900 transition-colors cursor-pointer"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Freelancers Showcase - Only visible when HIRE tab is active */}
    {activeTab === 'hire' && (
      <div className={`${manrope.className} bg-gradient-to-b from-[#0CF574]/28 via-[#0CF574] to-white py-16 px-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Top Freelancers in Nepal
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with talented professionals ready to bring your projects to life
            </p>
          </div>

          {/* Freelancer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {freelancersData.map((freelancer) => (
              <FreelancerCard
                key={freelancer.id}
                name={freelancer.name}
                username={freelancer.username}
                avatar={freelancer.avatar}
                status={freelancer.status}
                lastSeen={freelancer.lastSeen}
                skills={freelancer.skills}
                rating={freelancer.rating}
              />
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/search/freelancers')}
              className="px-8 py-4 bg-gray-900 hover:bg-black text-white font-semibold text-lg rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
            >
              View All Freelancers →
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default HeroSection;
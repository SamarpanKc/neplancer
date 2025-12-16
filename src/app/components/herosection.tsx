"use client"
import React, { useState } from 'react';
import { Manrope } from "next/font/google";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FreelancerCard } from './FreelancerCard';
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
    <div className={`${manrope.className} min-h-[85vh] bg-gradient-to-b from-white via-white to-[#0CF574]/20 flex flex-col items-center justify-center px-4 sm:px-8 py-16 lg:py-20`}>
      {/* Tab Navigation */}
      <div className="mb-10 lg:mb-12">
        <div className="flex bg-gray-50 rounded-full p-1.5 border border-gray-100">
          <button
            onClick={() => handleTabChange('hire')}
            className={`px-6 sm:px-10 py-3 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'hire'
                ? 'bg-gray-900 text-white shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            aria-label="Switch to hire mode"
          >
            HIRE TALENT
          </button>
          <button
            onClick={() => handleTabChange('get-hired')}
            className={`px-6 sm:px-10 py-3 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'get-hired'
                ? 'bg-gray-900 text-white shadow-md scale-105'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            aria-label="Switch to get hired mode"
          >
            FIND WORK
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center max-w-5xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 lg:mb-6 leading-[1.1] tracking-tight">
          {activeTab === 'hire' ? (
            <>
              Find the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0CF574] to-emerald-600">talent</span>
            </>
          ) : (
            <>
              Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0CF574] to-emerald-600">opportunity</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-12 lg:mb-16 leading-relaxed max-w-3xl mx-auto font-medium">
          {activeTab === 'hire' 
            ? "Connect with Nepal's top independent professionals and bring your vision to life"
            : "Join leading companies and showcase your expertise to land your dream project"}
        </p>

        {/* Search Section */}
        <div className="flex items-center justify-center max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              {/* Search Icon */}
              <div className="hidden sm:flex pl-6 pr-3 items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'hire' ? 'Search for skills or services...' : 'Search for projects or jobs...'}
                className="flex-1 py-4 px-6 text-base sm:text-lg bg-transparent font-medium border-none focus:outline-none placeholder-gray-400 focus:placeholder-gray-500"
              />
              
              {/* Browse Button */}
              <button 
                type="submit"
                className="bg-gray-900 text-white px-6 sm:px-8 py-4 sm:py-3 font-bold text-base sm:text-lg hover:bg-black cursor-pointer transition-all duration-200 whitespace-nowrap rounded-b-2xl sm:rounded-full sm:mr-1.5 hover:scale-105"
              >
                {activeTab === 'hire' ? 'Browse Talent →' : 'Browse Jobs →'}
              </button>
            </div>
          </form>
        </div>

        {/* Popular categories */}
        <div className="flex flex-wrap justify-center gap-2.5">
          <span className="text-sm text-gray-500 font-medium mr-1">Popular:</span>
          {['Logo Design', 'Web Development', 'Content Writing', 'Marketing', 'Video Editing'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="px-4 py-2 font-semibold bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-white hover:border-gray-900 hover:text-gray-900 transition-all duration-200 cursor-pointer hover:scale-105"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Freelancers Showcase - Only visible when HIRE tab is active */}
    {activeTab === 'hire' && (
      <div className={`${manrope.className} bg-gradient-to-b from-[#0CF574]/20 via-[#0CF574] to-emerald-600 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-full border border-emerald-200">
                ⭐ Featured Talent
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Top Freelancers in Nepal
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Handpicked professionals ready to bring your vision to life
            </p>
          </div>

          {/* Modern Masonry Grid with Uneven Spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 auto-rows-max">
            {freelancersData.slice(0, 12).map((freelancer, index) => {
              // Create staggered pattern with varied offsets
              const offsets = ['', 'lg:mt-8', '', 'lg:mt-12', 'lg:mt-6', '', 'lg:mt-10', 'lg:mt-4', '', 'lg:mt-8', 'lg:mt-3', 'lg:mt-11'];
              
              return (
                <div
                  key={freelancer.id}
                  className={`${offsets[index]} transition-all duration-300`}
                >
                  <FreelancerCard
                    name={freelancer.name}
                    username={freelancer.username}
                    avatar={freelancer.avatar}
                    status={freelancer.status}
                    skills={freelancer.skills}
                    rating={freelancer.rating}
                  />
                </div>
              );
            })}
          </div>

          {/* View More Button */}
          <div className="text-center mt-12 lg:mt-16">
            <button
              onClick={() => router.push('/search/freelancers')}
              className="group px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold text-base sm:text-lg rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2"
            >
              <span>View All Freelancers</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default HeroSection;
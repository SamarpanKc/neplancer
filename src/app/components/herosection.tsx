"use client"
import React, { useState } from 'react';
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
});

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<'hire' | 'get-hired'>('hire');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`${manrope.className} min-h-screen bg-gradient-to-b from-background to-[#0CF574]/28 flex flex-col items-center justify-center px-8`}>
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab('hire')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'hire'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            HIRE
          </button>
          <button
            onClick={() => setActiveTab('get-hired')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'get-hired'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            GET HIRED
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-2 leading-tight">
          A new way to work
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-xl text-gray-600 mb-16 leading-relaxed max-w-3xl mx-auto">
          Discover, connect, and work with the Nepal&apos;s best<br />
          independent creatives.
        </p>

        {/* Search Section */}
        <div className="flex items-center justify-center max-w-4xl mx-auto">
          {/* Combined Search Input and Button */}
          <div className="relative w-full max-w-3xl">
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
                placeholder="What do you need help with?"
                className="flex-1 py-4 px-2 text-lg bg-transparent font-semibold border-none focus:outline-none placeholder-gray-500"
              />
              
              {/* Browse Button */}
              <button className="bg-gray-900 text-white px-8 py-3 font-semibold text-lg hover:bg-foreground/80 transition-colors duration-200 whitespace-nowrap rounded-full mr-1">
                Browse 1M+ independents
              </button>
            </div>
          </div>
        </div>

        {/* Optional: Popular searches or categories */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {['Logo Design', 'Web Development', 'Content Writing', 'Marketing', 'Video Editing'].map((category) => (
            <span
              key={category}
              className="px-4 py-2 font-medium bg-white border border-gray-200 rounded-full text-sm text-foreground/70 hover:border-gray-300 hover:text-gray-900 transition-colors cursor-pointer"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
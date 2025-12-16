'use client';

import { useState, useMemo } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { useFreelancers } from '@/hooks/useFreelancers';
import { useDebounce } from '@/hooks/useCommon';
import Fuse from 'fuse.js';
import { JobCard } from '@/app/components/JobCard';
import { FreelancerCard } from '@/app/components/FreelancerCard';

type SearchMode = 'jobs' | 'freelancers';

interface SearchFilters {
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  experienceLevel?: string;
  skills?: string[];
}

export default function AdvancedSearchPage() {
  const [mode, setMode] = useState<SearchMode>('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch data
  const { data: jobs = [], isLoading: jobsLoading } = useJobs({
    status: 'open',
    ...filters,
  });

  const { data: freelancers = [], isLoading: freelancersLoading } = useFreelancers(filters);

  // Fuse.js configuration for fuzzy search
  const jobFuse = useMemo(() => {
    return new Fuse(jobs, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'category', weight: 0.2 },
        { name: 'skills', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [jobs]);

  const freelancerFuse = useMemo(() => {
    return new Fuse(freelancers, {
      keys: [
        { name: 'full_name', weight: 0.3 },
        { name: 'title', weight: 0.3 },
        { name: 'bio', weight: 0.2 },
        { name: 'skills', weight: 0.2 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [freelancers]);

  // Perform fuzzy search
  const searchResults = useMemo(() => {
    if (!debouncedSearch) {
      return mode === 'jobs' ? jobs : freelancers;
    }

    if (mode === 'jobs') {
      const results = jobFuse.search(debouncedSearch);
      return results.map(result => result.item);
    } else {
      const results = freelancerFuse.search(debouncedSearch);
      return results.map(result => result.item);
    }
  }, [debouncedSearch, mode, jobs, freelancers, jobFuse, freelancerFuse]);

  const isLoading = mode === 'jobs' ? jobsLoading : freelancersLoading;

  // Available categories and skills (in a real app, fetch from database)
  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Science',
    'DevOps',
  ];

  const experienceLevels = ['entry', 'intermediate', 'expert'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
          <p className="text-gray-600 mt-2">Find the perfect match with powerful search and filters</p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setMode('jobs')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'jobs'
                ? 'bg-[#0CF574] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Search Jobs
            </div>
          </button>
          <button
            onClick={() => setMode('freelancers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'freelancers'
                ? 'bg-[#0CF574] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Search Freelancers
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-[#0CF574]"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Budget Range (for jobs) */}
              {mode === 'jobs' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minBudget || ''}
                      onChange={(e) => setFilters({ ...filters, minBudget: Number(e.target.value) || undefined })}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-[#0CF574]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxBudget || ''}
                      onChange={(e) => setFilters({ ...filters, maxBudget: Number(e.target.value) || undefined })}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-[#0CF574]"
                    />
                  </div>
                </div>
              )}

              {/* Experience Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={filters.experienceLevel || ''}
                  onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value || undefined })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-[#0CF574]"
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({})}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={mode === 'jobs' ? 'Search jobs by title, skills, or description...' : 'Search freelancers by name, skills, or expertise...'}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#0CF574] focus:border-[#0CF574]"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {searchResults.length} {mode === 'jobs' ? 'jobs' : 'freelancers'} found
                {debouncedSearch && ` for "${debouncedSearch}"`}
              </p>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mode === 'jobs' ? (
                  searchResults.map((job: any) => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  searchResults.map((freelancer: any) => (
                    <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

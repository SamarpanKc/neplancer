'use client';

import { useState } from 'react';
import PlatformOverview from '@/components/analytics/PlatformOverview';
import RevenueChart from '@/components/analytics/RevenueChart';
import ActivityChart from '@/components/analytics/ActivityChart';

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState<number>(30);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor your platform's performance and growth</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border">
            {[
              { label: '7D', value: 7 },
              { label: '30D', value: 30 },
              { label: '90D', value: 90 },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-[#0CF574] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Overview Stats */}
        <div className="mb-8">
          <PlatformOverview />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart days={timeRange} />
          <ActivityChart days={timeRange} />
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-[#0CF574]/10 to-[#00D9A3]/10 rounded-lg p-6 border border-[#0CF574]/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#0CF574] rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Analytics Information</h3>
              <p className="text-sm text-gray-600 mt-1">
                Platform statistics are updated daily. Revenue and fee calculations are based on completed transactions. 
                User activity metrics track engagement over the last 30 days.
              </p>
              <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#0CF574] rounded-full"></div>
                  <span className="text-gray-700">Active Metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-700">Historical Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

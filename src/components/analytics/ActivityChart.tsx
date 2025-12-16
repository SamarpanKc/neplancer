'use client';

import { Card } from '@/components/ui/card';
import { useActivityData, formatNumber } from '@/hooks/useAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
  days?: number;
}

export default function ActivityChart({ days = 30 }: ActivityChartProps) {
  const { data, isLoading } = useActivityData(days);

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Platform Activity</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No activity data available yet
        </div>
      </Card>
    );
  }

  const latestData = data[data.length - 1] || { jobs: 0, proposals: 0, contracts: 0 };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Platform Activity</h3>
        <div className="flex gap-6 mt-3">
          <div>
            <p className="text-sm text-gray-600">Total Jobs</p>
            <p className="text-2xl font-bold text-blue-600">{formatNumber(latestData.jobs)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Proposals</p>
            <p className="text-2xl font-bold text-purple-600">{formatNumber(latestData.proposals)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Contracts</p>
            <p className="text-2xl font-bold text-green-600">{formatNumber(latestData.contracts)}</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => formatNumber(value)}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="jobs" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Jobs"
          />
          <Line 
            type="monotone" 
            dataKey="proposals" 
            stroke="#A855F7" 
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Proposals"
          />
          <Line 
            type="monotone" 
            dataKey="contracts" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Contracts"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

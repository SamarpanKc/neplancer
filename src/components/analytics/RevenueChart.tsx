'use client';

import { Card } from '@/components/ui/card';
import { useRevenueData, formatCurrency } from '@/hooks/useAnalytics';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  days?: number;
}

export default function RevenueChart({ days = 30 }: RevenueChartProps) {
  const { data, isLoading } = useRevenueData(days);

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
        <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No revenue data available yet
        </div>
      </Card>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalFees = data.reduce((sum, item) => sum + item.fees, 0);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
        <div className="flex gap-6 mt-3">
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Platform Fees (10%)</p>
            <p className="text-2xl font-bold text-[#0CF574]">{formatCurrency(totalFees)}</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0CF574" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0CF574" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D9A3" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00D9A3" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#0CF574" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)" 
            name="Total Revenue"
          />
          <Area 
            type="monotone" 
            dataKey="fees" 
            stroke="#00D9A3" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorFees)" 
            name="Platform Fees"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

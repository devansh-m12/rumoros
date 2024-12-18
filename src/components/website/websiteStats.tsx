'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface WebsiteStats {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}

interface StatsResponse {
  success: boolean;
  data: {
    current: WebsiteStats[];
    previous: WebsiteStats[] | null;
  };
}

interface WebsiteStatsProps {
  websiteId: string;
  startAt?: number;
  endAt?: number;
}

export default function WebsiteStats({ websiteId, startAt, endAt }: WebsiteStatsProps) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (startAt) queryParams.append('startAt', startAt.toString());
        if (endAt) queryParams.append('endAt', endAt.toString());

        const response = await fetch(
          `/api/website/${websiteId}/stats?${queryParams.toString()}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [websiteId, startAt, endAt]);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentStats = stats?.data.current[0] || {
    pageviews: 0,
    visitors: 0,
    visits: 0,
    bounces: 0,
    totaltime: 0,
  };

  // Sample data for graphs - in a real app, this would come from your API
  const visitorData = [
    { name: 'Mon', visitors: 400, pageviews: 600 },
    { name: 'Tue', visitors: 300, pageviews: 450 },
    { name: 'Wed', visitors: 500, pageviews: 750 },
    { name: 'Thu', visitors: 450, pageviews: 680 },
    { name: 'Fri', visitors: 600, pageviews: 900 },
    { name: 'Sat', visitors: 350, pageviews: 500 },
    { name: 'Sun', visitors: 250, pageviews: 380 },
  ];

  const bounceData = [
    { name: 'Mon', rate: 45 },
    { name: 'Tue', rate: 52 },
    { name: 'Wed', rate: 48 },
    { name: 'Thu', rate: 51 },
    { name: 'Fri', rate: 40 },
    { name: 'Sat', rate: 55 },
    { name: 'Sun', rate: 50 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Pageviews</h3>
          <p className="text-2xl font-bold">{currentStats.pageviews}</p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Unique Visitors</h3>
          <p className="text-2xl font-bold">{currentStats.visitors}</p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Visits</h3>
          <p className="text-2xl font-bold">{currentStats.visits}</p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Bounce Rate</h3>
          <p className="text-2xl font-bold">
            {currentStats.visits ? 
              `${Math.round((currentStats.bounces / currentStats.visits) * 100)}%` 
              : '0%'}
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Avg. Visit Time</h3>
          <p className="text-2xl font-bold">
            {currentStats.visits ? 
              `${Math.round(currentStats.totaltime / (currentStats.visits - currentStats.bounces))}s` 
              : '0s'}
          </p>
        </Card>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Visitors & Pageviews</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#8884d8" 
                  name="Visitors"
                />
                <Line 
                  type="monotone" 
                  dataKey="pageviews" 
                  stroke="#82ca9d" 
                  name="Pageviews"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Bounce Rate</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bounceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar 
                  dataKey="rate" 
                  fill="#8884d8" 
                  name="Bounce Rate"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MetricsData {
  totalInstalls: number;
  freeTierUsers: number;
  premiumUsers: number;
  conversionRate: number;
  dailySignups: number;
  mrr: string;
  annualUsers: number;
  monthlyUsers: number;
  funnel: {
    totalInstalls: number;
    upgradeClicked: number;
    checkoutCompleted: number;
    premiumUsers: number;
    upgradeClickRate: number;
    checkoutCompletionRate: number;
  };
  growth: {
    dailySignups: number;
    weeklyProjection: number;
    monthlyProjection: number;
  };
}

const COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  teal: '#14b8a6',
};

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMetrics() {
    try {
      const response = await fetch('https://api.nexus-alert.com/api/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Metrics</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchMetrics}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  // Prepare data for charts
  const tierDistribution = [
    { name: 'Free Tier', value: metrics.freeTierUsers, color: COLORS.primary },
    { name: 'Premium', value: metrics.premiumUsers, color: COLORS.success },
  ];

  const planDistribution = [
    { name: 'Monthly', value: metrics.monthlyUsers, color: COLORS.warning },
    { name: 'Annual', value: metrics.annualUsers, color: COLORS.purple },
  ];

  const funnelData = [
    { stage: 'Total Installs', count: metrics.funnel.totalInstalls },
    { stage: 'Upgrade Clicked', count: metrics.funnel.upgradeClicked },
    { stage: 'Checkout Completed', count: metrics.funnel.checkoutCompleted },
    { stage: 'Premium Users', count: metrics.funnel.premiumUsers },
  ];

  const growthData = [
    { period: 'Daily', signups: metrics.growth.dailySignups },
    { period: 'Weekly', signups: metrics.growth.weeklyProjection },
    { period: 'Monthly', signups: metrics.growth.monthlyProjection },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Conversion Funnel Analytics
              </h1>
              <p className="mt-2 text-gray-600">
                Real-time metrics and user behavior analysis
              </p>
            </div>
            <button
              onClick={fetchMetrics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Installs"
            value={metrics.totalInstalls.toLocaleString()}
            subtitle="All users"
            color="bg-blue-500"
            icon="📊"
          />
          <MetricCard
            title="Premium Conversions"
            value={metrics.premiumUsers.toLocaleString()}
            subtitle={`${metrics.conversionRate.toFixed(2)}% conversion rate`}
            color="bg-green-500"
            icon="💎"
            target={metrics.conversionRate >= 10 ? 'Met' : 'Below target'}
            targetMet={metrics.conversionRate >= 10}
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${parseFloat(metrics.mrr).toLocaleString()}`}
            subtitle="MRR from active subscriptions"
            color="bg-purple-500"
            icon="💰"
          />
          <MetricCard
            title="Daily Sign-ups"
            value={metrics.dailySignups.toLocaleString()}
            subtitle={`${metrics.growth.monthlyProjection} projected/month`}
            color="bg-orange-500"
            icon="📈"
          />
        </div>

        {/* Conversion Funnel Visualization */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Conversion Funnel Analysis
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6 grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
            <div>
              <p className="text-sm text-gray-600">Upgrade Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.funnel.upgradeClickRate.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500">
                {metrics.funnel.upgradeClicked} / {metrics.funnel.totalInstalls} users
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Checkout Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.funnel.checkoutCompletionRate.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500">
                {metrics.funnel.checkoutCompleted} / {metrics.funnel.upgradeClicked} started
              </p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Tier Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              User Tier Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Premium Plan Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Premium Plan Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Projections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Growth Projections
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="signups"
                stroke={COLORS.success}
                fill={COLORS.success}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Drop-off Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Drop-off Points & Recommendations
          </h2>
          <div className="space-y-4">
            <DropOffAnalysis
              stage="Install → Upgrade Click"
              rate={metrics.funnel.upgradeClickRate}
              benchmark={15}
              recommendation="Consider: (1) More prominent upgrade CTAs in popup, (2) Highlight premium benefits after first slot found, (3) Add urgency messaging"
            />
            <DropOffAnalysis
              stage="Upgrade Click → Checkout Complete"
              rate={metrics.funnel.checkoutCompletionRate}
              benchmark={70}
              recommendation="Optimize: (1) Reduce checkout friction, (2) Add trust badges, (3) Offer multiple payment methods, (4) Show value proposition on checkout page"
            />
            <DropOffAnalysis
              stage="Overall Conversion"
              rate={metrics.conversionRate}
              benchmark={10}
              recommendation={
                metrics.conversionRate >= 10
                  ? '✅ Target met! Consider: (1) Upsell annual plans, (2) Implement referral rewards, (3) Launch affiliate program'
                  : '⚠️ Below target. Focus on: (1) User interviews (see docs/user-research.md), (2) Value proposition clarity, (3) Pricing optimization'
              }
            />
          </div>
        </div>

        {/* User Interview Tracker */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎯</div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Next Step: User Research
              </h2>
              <p className="text-gray-700 mb-4">
                After reaching 1K installs, conduct user interviews to understand conversion blockers.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Email 20 users who installed but didn't upgrade</li>
                <li>• Offer $25 Amazon gift card for 15min Zoom call</li>
                <li>• Ask: "What would make you pay for this?"</li>
                <li>• Document findings in docs/user-research.md</li>
              </ul>
              <a
                href="/docs/user-research.md"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                View Interview Guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  color,
  icon,
  target,
  targetMet,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: string;
  target?: string;
  targetMet?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
      {target && (
        <div className={`mt-2 inline-block px-2 py-1 rounded text-xs font-medium ${
          targetMet ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
        }`}>
          {target}
        </div>
      )}
    </div>
  );
}

function DropOffAnalysis({
  stage,
  rate,
  benchmark,
  recommendation,
}: {
  stage: string;
  rate: number;
  benchmark: number;
  recommendation: string;
}) {
  const performance = rate >= benchmark ? 'good' : 'needs-improvement';

  return (
    <div className={`border-l-4 pl-4 py-2 ${
      performance === 'good' ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{stage}</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">{rate.toFixed(2)}%</span>
          <span className={`text-sm ${performance === 'good' ? 'text-green-600' : 'text-orange-600'}`}>
            (target: {benchmark}%)
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-700">{recommendation}</p>
    </div>
  );
}

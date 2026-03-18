'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  location: string;
  program: string;
  timeToFind: string;
  enrollmentCenter: string;
  appointmentDate: string;
  previousWaitTime: string;
  story: string;
  tier: string;
  permissionToShare: boolean;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  premiumCode?: string;
  premiumMonths?: number;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [authToken, setAuthToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE = 'https://nexus-alert-backend.YOUR_SUBDOMAIN.workers.dev';

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
      fetchTestimonials(savedToken);
    } else {
      setLoading(false);
    }
  }, [filter]);

  const fetchTestimonials = async (token: string) => {
    setLoading(true);
    try {
      const statusParam = filter === 'all' ? '' : `?status=${filter}`;
      const response = await fetch(`${API_BASE}/api/admin/testimonials${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      } else {
        console.error('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_token', authToken);
    setIsAuthenticated(true);
    fetchTestimonials(authToken);
  };

  const handleApprove = async (id: string, months = 3) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/testimonials/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, premiumMonths: months }),
      });

      if (response.ok) {
        alert('Testimonial approved! Premium code sent.');
        fetchTestimonials(authToken);
      } else {
        alert('Failed to approve testimonial');
      }
    } catch (error) {
      console.error('Error approving testimonial:', error);
      alert('Error approving testimonial');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Reason for rejection (optional):');
    try {
      const response = await fetch(`${API_BASE}/api/admin/testimonials/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, reason }),
      });

      if (response.ok) {
        alert('Testimonial rejected');
        fetchTestimonials(authToken);
      } else {
        alert('Failed to reject testimonial');
      }
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      alert('Error rejecting testimonial');
    }
  };

  const copyForWebsite = (testimonial: Testimonial) => {
    const formatted = {
      name: formatName(testimonial.name),
      location: testimonial.location,
      rating: 5,
      date: new Date(testimonial.submittedAt).toISOString().split('T')[0],
      text: testimonial.story,
      avatar: getInitials(testimonial.name),
    };

    navigator.clipboard.writeText(JSON.stringify(formatted, null, 2));
    alert('Copied to clipboard! Paste into Testimonials.tsx');
  };

  const formatName = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length === 1) return fullName;
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Admin Token</label>
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-lg focus:outline-none focus:border-[#3b82f6]"
                placeholder="Enter admin token"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg font-semibold transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Testimonial Review</h1>
          <button
            onClick={() => {
              localStorage.removeItem('admin_token');
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 text-sm text-[#888] hover:text-white transition"
          >
            Logout
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#222]">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 font-semibold transition border-b-2 ${
                filter === status
                  ? 'border-[#3b82f6] text-white'
                  : 'border-transparent text-[#888] hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-xs text-[#666]">
                  ({testimonials.filter(t => t.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#888]">Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 text-[#888]">
            No {filter === 'all' ? '' : filter} testimonials yet.
          </div>
        ) : (
          <div className="space-y-6">
            {testimonials
              .filter(t => filter === 'all' || t.status === filter)
              .map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-6 rounded-xl border border-[#222] bg-[#111]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-[#888]">
                        {testimonial.location} • {testimonial.program}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          testimonial.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : testimonial.status === 'approved'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {testimonial.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-[#666]">Email:</span> {testimonial.email}
                    </div>
                    <div>
                      <span className="text-[#666]">Time to Find:</span> {testimonial.timeToFind}
                    </div>
                    <div>
                      <span className="text-[#666]">Enrollment Center:</span>{' '}
                      {testimonial.enrollmentCenter || 'N/A'}
                    </div>
                    <div>
                      <span className="text-[#666]">Tier:</span> {testimonial.tier}
                    </div>
                    <div>
                      <span className="text-[#666]">Wait Time Saved:</span>{' '}
                      {testimonial.previousWaitTime || 'N/A'}
                    </div>
                    <div>
                      <span className="text-[#666]">Submitted:</span>{' '}
                      {new Date(testimonial.submittedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-[#666] mb-2">Story:</p>
                    <p className="text-[#ccc] leading-relaxed">{testimonial.story}</p>
                  </div>

                  {testimonial.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-[#222]">
                      <button
                        onClick={() => handleApprove(testimonial.id, 3)}
                        className="px-6 py-2 bg-[#22c55e] hover:bg-[#16a34a] rounded-lg font-semibold transition"
                      >
                        Approve (3 months)
                      </button>
                      <button
                        onClick={() => handleApprove(testimonial.id, 6)}
                        className="px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg font-semibold transition"
                      >
                        Approve (6 months)
                      </button>
                      <button
                        onClick={() => copyForWebsite(testimonial)}
                        className="px-6 py-2 bg-[#666] hover:bg-[#555] rounded-lg font-semibold transition"
                      >
                        Copy for Website
                      </button>
                      <button
                        onClick={() => handleReject(testimonial.id)}
                        className="px-6 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg font-semibold transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {testimonial.status === 'approved' && testimonial.premiumCode && (
                    <div className="pt-4 border-t border-[#222]">
                      <p className="text-sm text-[#888]">
                        Premium Code: <code className="text-[#22c55e]">{testimonial.premiumCode}</code> ({testimonial.premiumMonths} months)
                      </p>
                      <button
                        onClick={() => copyForWebsite(testimonial)}
                        className="mt-2 px-4 py-2 bg-[#666] hover:bg-[#555] rounded-lg text-sm font-semibold transition"
                      >
                        Copy for Website
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  email: string;
  locations: number[];
  program: string;
  lastChecked: string | null;
  status: 'active' | 'inactive';
}

export default function ProDashboard() {
  const router = useRouter();
  const [proEmail, setProEmail] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientLocations, setNewClientLocations] = useState('');
  const [addingClient, setAddingClient] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const email = localStorage.getItem('proEmail');
    if (!email) {
      router.push('/pro');
      return;
    }
    setProEmail(email);
    fetchClients(email);
  }, [router]);

  async function fetchClients(email: string) {
    try {
      const res = await fetch(`/api/pro/clients?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WEBHOOK_SECRET || ''}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    if (!newClientEmail || !newClientLocations) return;

    setAddingClient(true);
    setError('');

    try {
      // Parse locations (comma-separated IDs)
      const locations = newClientLocations
        .split(',')
        .map(l => parseInt(l.trim()))
        .filter(l => !isNaN(l));

      if (locations.length === 0) {
        throw new Error('Invalid location IDs');
      }

      const res = await fetch('/api/pro/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WEBHOOK_SECRET || ''}`,
        },
        body: JSON.stringify({
          lawFirmEmail: proEmail,
          clientEmail: newClientEmail,
          locations,
          program: 'NEXUS',
          dateRange: { start: null, end: null },
          timeRange: { start: null, end: null },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add client');
      }

      // Refresh client list
      await fetchClients(proEmail);

      // Reset form
      setNewClientEmail('');
      setNewClientLocations('');
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add client');
    } finally {
      setAddingClient(false);
    }
  }

  async function handleRemoveClient(clientEmail: string) {
    if (!confirm(`Remove ${clientEmail} from monitoring?`)) return;

    try {
      const res = await fetch('/api/pro/clients', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WEBHOOK_SECRET || ''}`,
        },
        body: JSON.stringify({
          lawFirmEmail: proEmail,
          clientEmail,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to remove client');
      }

      // Refresh client list
      await fetchClients(proEmail);
    } catch (err) {
      console.error('Error removing client:', err);
      setError('Failed to remove client');
    }
  }

  function formatLastChecked(timestamp: string | null) {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#888]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-lg font-bold tracking-tight">
              NEXUS Alert
            </a>
            <span className="text-sm px-2 py-1 rounded bg-[#3b82f6] text-white font-semibold">
              PRO
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#888]">{proEmail}</span>
            <button
              onClick={() => {
                localStorage.removeItem('proEmail');
                router.push('/pro');
              }}
              className="text-sm text-[#888] hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
            <p className="text-[#888]">
              Managing {clients.length}/20 clients — monitoring NEXUS/Global Entry appointment slots
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
              <div className="text-sm text-[#888] mb-1">Total Clients</div>
              <div className="text-3xl font-bold">{clients.length}</div>
            </div>
            <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
              <div className="text-sm text-[#888] mb-1">Active Monitoring</div>
              <div className="text-3xl font-bold text-[#22c55e]">
                {clients.filter(c => c.status === 'active').length}
              </div>
            </div>
            <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
              <div className="text-sm text-[#888] mb-1">Slots Remaining</div>
              <div className="text-3xl font-bold text-[#3b82f6]">
                {20 - clients.length}
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444]">
              {error}
            </div>
          )}

          {/* Client table */}
          <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
            <div className="p-6 border-b border-[#222] flex items-center justify-between">
              <h2 className="text-xl font-semibold">Clients</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-semibold hover:bg-[#2563eb] transition"
              >
                + Add Client
              </button>
            </div>

            {clients.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[#888] mb-4">No clients added yet</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 rounded-lg bg-[#3b82f6] text-white text-sm font-semibold hover:bg-[#2563eb] transition"
                >
                  Add Your First Client
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-[#222]">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-[#888]">
                        Client Email
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-[#888]">
                        Locations Monitored
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-[#888]">
                        Last Checked
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-[#888]">
                        Status
                      </th>
                      <th className="text-right p-4 text-sm font-semibold text-[#888]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.email} className="border-b border-[#222] hover:bg-[#0a0a0a] transition">
                        <td className="p-4 text-sm">{client.email}</td>
                        <td className="p-4 text-sm text-[#888]">
                          {client.locations.length === 0
                            ? 'None'
                            : `${client.locations.length} location${client.locations.length > 1 ? 's' : ''}`}
                        </td>
                        <td className="p-4 text-sm text-[#888]">
                          {formatLastChecked(client.lastChecked)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              client.status === 'active'
                                ? 'bg-[#22c55e]/10 text-[#22c55e]'
                                : 'bg-[#888]/10 text-[#888]'
                            }`}
                          >
                            {client.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleRemoveClient(client.email)}
                            className="text-sm text-[#ef4444] hover:text-[#dc2626] transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* API documentation */}
          <div className="mt-8 p-6 rounded-xl border border-[#222] bg-[#111]">
            <h3 className="text-lg font-semibold mb-3">API Access</h3>
            <p className="text-sm text-[#888] mb-4">
              Integrate NEXUS Alert Pro with your CRM or case management system:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#222]">
                <div className="text-xs text-[#888] mb-1">Add Client</div>
                <code className="text-xs text-[#22c55e] block overflow-x-auto">
                  POST /api/pro/clients
                </code>
              </div>
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#222]">
                <div className="text-xs text-[#888] mb-1">Remove Client</div>
                <code className="text-xs text-[#ef4444] block overflow-x-auto">
                  DELETE /api/pro/clients
                </code>
              </div>
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#222]">
                <div className="text-xs text-[#888] mb-1">List Clients</div>
                <code className="text-xs text-[#3b82f6] block overflow-x-auto">
                  GET /api/pro/clients?email={proEmail}
                </code>
              </div>
            </div>
            <p className="text-xs text-[#555] mt-4">
              Full API documentation available at{' '}
              <a href="https://docs.nexus-alert.com/api" className="text-[#3b82f6] hover:underline">
                docs.nexus-alert.com/api
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-md w-full bg-[#111] rounded-2xl border border-[#222] p-6">
            <h3 className="text-xl font-bold mb-4">Add New Client</h3>
            <form onSubmit={handleAddClient}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Client Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@example.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[#333] text-sm text-[#ededed] placeholder-[#555] focus:outline-none focus:border-[#3b82f6] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location IDs (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="5020, 5021, 5402"
                    value={newClientLocations}
                    onChange={(e) => setNewClientLocations(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[#333] text-sm text-[#ededed] placeholder-[#555] focus:outline-none focus:border-[#3b82f6] transition"
                  />
                  <p className="text-xs text-[#555] mt-1">
                    Common locations: 5020 (Seattle), 5021 (Blaine), 5402 (Vancouver)
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewClientEmail('');
                    setNewClientLocations('');
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-[#444] text-[#ccc] text-sm font-semibold hover:border-[#666] hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingClient}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-semibold hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {addingClient ? 'Adding...' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

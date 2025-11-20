'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { PRICING_TIERS } from '@/lib/pricing';

interface User {
  id: string;
  name: string | null;
  email: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  interviewsThisMonth: number;
  feedbackThisMonth: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    verifyAdminAndLoadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAdminAndLoadUsers = async () => {
    try {
      // Verify admin status
      const verifyResponse = await fetch('/api/admin/verify');
      if (!verifyResponse.ok) {
        router.push('/admin/login');
        return;
      }

      // Load users
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const data = await usersResponse.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (userId: string, tier: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/subscription`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });

      if (response.ok) {
        // Refresh users list
        verifyAdminAndLoadUsers();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const stats = {
    totalUsers: users.length,
    freeUsers: users.filter(u => u.subscriptionTier === 'free').length,
    proUsers: users.filter(u => u.subscriptionTier === 'pro').length,
    enterpriseUsers: users.filter(u => u.subscriptionTier === 'enterprise').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
              <p className="text-gray-400">PrepCoach User Management</p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
            <div className="text-blue-100 text-sm font-semibold mb-2">Total Users</div>
            <div className="text-white text-4xl font-bold">{stats.totalUsers}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg">
            <div className="text-green-100 text-sm font-semibold mb-2">Free Tier</div>
            <div className="text-white text-4xl font-bold">{stats.freeUsers}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg">
            <div className="text-orange-100 text-sm font-semibold mb-2">Pro Tier</div>
            <div className="text-white text-4xl font-bold">{stats.proUsers}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg">
            <div className="text-purple-100 text-sm font-semibold mb-2">Enterprise</div>
            <div className="text-white text-4xl font-bold">{stats.enterpriseUsers}</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{user.name || 'No name'}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.subscriptionTier === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                        user.subscriptionTier === 'pro' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.subscriptionTier.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>{user.interviewsThisMonth} interviews</div>
                      <div>{user.feedbackThisMonth} feedback</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-orange-400 hover:text-orange-300 font-semibold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Edit Subscription</h3>
            <div className="mb-4">
              <p className="text-gray-300 mb-2">{selectedUser.email}</p>
              <p className="text-sm text-gray-400">Current: {selectedUser.subscriptionTier}</p>
            </div>
            <div className="space-y-3 mb-6">
              {Object.keys(PRICING_TIERS).map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleUpdateSubscription(selectedUser.id, tier)}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
                    selectedUser.subscriptionTier === tier
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {PRICING_TIERS[tier as keyof typeof PRICING_TIERS].name} - ${PRICING_TIERS[tier as keyof typeof PRICING_TIERS].price}/{PRICING_TIERS[tier as keyof typeof PRICING_TIERS].interval}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowEditModal(false)}
              className="w-full px-4 py-2 bg-slate-700 text-gray-300 rounded-lg font-semibold hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

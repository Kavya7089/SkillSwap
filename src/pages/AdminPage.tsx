import React, { useState, useEffect } from 'react';
import posthog from 'posthog-js'; // Add this import
import { Users, MessageSquare, Star, TrendingUp, Ban, Eye, AlertTriangle } from 'lucide-react';
import { AdminStats, User, SkillSwapRequest } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';

// Access PostHog API key from .env
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;

posthog.init(POSTHOG_KEY, {
  api_host: 'https://app.posthog.com',
});

const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<SkillSwapRequest[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'requests'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email === 'admin@skillswap.com') {
      posthog.capture('admin_dashboard_viewed', { email: user.email });
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        mockApi.getAdminStats(),
        mockApi.getUsers()
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.email !== 'admin@skillswap.com') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, monitor activity, and oversee the platform</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: TrendingUp },
                { key: 'users', label: 'Users', icon: Users },
                { key: 'requests', label: 'Requests', icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'overview' && stats && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Users</p>
                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Completed Swaps</p>
                        <p className="text-3xl font-bold">{stats.completedSwaps}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm">Pending Requests</p>
                        <p className="text-3xl font-bold">{stats.pendingRequests}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-yellow-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Average Rating</p>
                        <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
                      </div>
                      <Star className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Health</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{((stats.completedSwaps / stats.totalSwaps) * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Completion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{(stats.totalSwaps / stats.totalUsers).toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Swaps per User</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}/5</div>
                      <div className="text-sm text-gray-600">User Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'users' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <div className="text-sm text-gray-600">{users.length} total users</div>
                </div>

                <div className="grid gap-4">
                  {users.map((user) => (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {user.rating.toFixed(1)} ({user.totalRatings} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isPublic ? 'Public' : 'Private'}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'requests' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Request Monitoring</h3>
                  <div className="text-sm text-gray-600">Platform-wide request activity</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Request Monitoring</h4>
                  <p className="text-gray-600">
                    Monitor and manage skill swap requests across the platform. 
                    Review flagged content and ensure quality interactions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
              <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Send Announcement</div>
              <div className="text-sm text-gray-600">Notify all users</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Export Analytics</div>
              <div className="text-sm text-gray-600">Download reports</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
              <Ban className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Moderation Tools</div>
              <div className="text-sm text-gray-600">Review content</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, User, MessageSquare } from 'lucide-react';
import { SkillSwapRequest, User as UserType } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const [requests, setRequests] = useState<SkillSwapRequest[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadRequests();
      loadUsers();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await mockApi.getRequests(user.id);
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await mockApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const getUserById = (id: string) => {
    return users.find(u => u.id === id);
  };

  const handleUpdateStatus = async (requestId: string, status: SkillSwapRequest['status']) => {
    try {
      await mockApi.updateRequestStatus(requestId, status);
      await loadRequests();
    } catch (error) {
      console.error('Failed to update request status:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusIcon = (status: SkillSwapRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: SkillSwapRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <p className="text-gray-300 opacity-80">Please log in to view your requests.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 opacity-80">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Skill Swap Requests</h1>
          <p className="text-gray-300">Manage your incoming and outgoing skill swap requests</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-6 opacity-90">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Requests', count: requests.length },
              { key: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
              { key: 'accepted', label: 'Accepted', count: requests.filter(r => r.status === 'accepted').length },
              { key: 'rejected', label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length },
              { key: 'completed', label: 'Completed', count: requests.filter(r => r.status === 'completed').length },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === filterOption.key
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-gray-900 rounded-xl p-8 text-center opacity-90">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-8 text-center opacity-90">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-100 mb-2">No requests found</h3>
              <p className="text-gray-300">
                {filter === 'all' 
                  ? "You don't have any skill swap requests yet."
                  : `You don't have any ${filter} requests.`}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const isIncoming = request.toUserId === user.id;
              const otherUser = getUserById(isIncoming ? request.fromUserId : request.toUserId);
              
              return (
                <div
                  key={request.id}
                  className="bg-gray-900 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow opacity-90"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* User Avatar */}
                      <div className="relative">
                        <img
                          src={otherUser?.avatar || '/placeholder-avatar.png'}
                          alt={otherUser?.name || 'Unknown User'}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-800 shadow-lg"
                        />
                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                          isIncoming ? 'bg-emerald-500' : 'bg-green-500'
                        }`}>
                          <User className="h-3 w-3 text-white" />
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-100">
                            {isIncoming ? 'Request from' : 'Request to'} {otherUser?.name || 'Unknown User'}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(request.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-sm text-gray-400">Offering:</span>
                            <div className="bg-green-900 text-green-200 px-3 py-1 rounded-full text-sm font-medium inline-block">
                              {request.offeredSkill}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Wants to learn:</span>
                            <div className="bg-emerald-900 text-emerald-200 px-3 py-1 rounded-full text-sm font-medium inline-block">
                              {request.wantedSkill}
                            </div>
                          </div>
                        </div>

                        {request.message && (
                          <div className="bg-gray-800 rounded-lg p-3 mb-3">
                            <p className="text-gray-200 text-sm">{request.message}</p>
                          </div>
                        )}

                        <div className="text-xs text-gray-400">
                          {isIncoming ? 'Received' : 'Sent'} on {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isIncoming && request.status === 'pending' && (
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleUpdateStatus(request.id, 'accepted')}
                          className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request.id, 'rejected')}
                          className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {request.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(request.id, 'completed')}
                        className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors ml-4"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
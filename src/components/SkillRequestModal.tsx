import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';

interface SkillRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User | null;
  onSuccess: () => void;
}

const SkillRequestModal: React.FC<SkillRequestModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [offeredSkill, setOfferedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !targetUser) return;

    setIsSubmitting(true);
    try {
      await mockApi.createRequest({
        fromUserId: user.id,
        toUserId: targetUser.id,
        offeredSkill,
        wantedSkill,
        message,
        status: 'pending'
      });
      onSuccess();
      onClose();
      // Reset form
      setOfferedSkill('');
      setWantedSkill('');
      setMessage('');
    } catch (error) {
      console.error('Failed to send request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !targetUser) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full">
              <div className="flex items-center mb-4">
                <img
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Request Skill Swap with {targetUser.name}
                  </h3>
                  <p className="text-sm text-gray-500">{targetUser.location}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    I can offer:
                  </label>
                  <select
                    value={offeredSkill}
                    onChange={(e) => setOfferedSkill(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <option value="">Select a skill to offer</option>
                    {user?.skillsOffered.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    I want to learn:
                  </label>
                  <select
                    value={wantedSkill}
                    onChange={(e) => setWantedSkill(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <option value="">Select a skill to learn</option>
                    {targetUser.skillsOffered.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (optional):
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Tell them why you'd like to swap skills..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-purple-600 text-white py-2 px-4 rounded-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillRequestModal;
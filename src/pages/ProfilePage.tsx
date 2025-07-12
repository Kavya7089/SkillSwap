import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Plus, Camera, MapPin, Star, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { mockApi } from '../services/mockApi';
import { pusher, subscribeToNotifications } from '../services/realtime';

// Access Cloudinary API key and URL from .env
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_URL = import.meta.env.CLOUDINARY_URL;

const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  useEffect(() => {
    const handleNewNotification = (data: any) => {
      // Handle the notification (e.g., show a toast, update the UI, etc.)
      console.log('New notification:', data);
    };

    subscribeToNotifications(handleNewNotification);

    return () => {
      // Unsubscribe from notifications on unmount
      pusher.unsubscribe('notifications');
    };
  }, []);

  const handleSave = async () => {
    if (!editedUser) return;

    setIsSaving(true);
    try {
      const updatedUser = await mockApi.updateUser(editedUser);
      login(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({ ...user });
    }
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && editedUser) {
      setEditedUser({
        ...editedUser,
        skillsOffered: [...editedUser.skillsOffered, newSkillOffered.trim()]
      });
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && editedUser) {
      setEditedUser({
        ...editedUser,
        skillsWanted: [...editedUser.skillsWanted, newSkillWanted.trim()]
      });
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (index: number) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        skillsOffered: editedUser.skillsOffered.filter((_, i) => i !== index)
      });
    }
  };

  const removeSkillWanted = (index: number) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        skillsWanted: editedUser.skillsWanted.filter((_, i) => i !== index)
      });
    }
  };

  const availabilityOptions = [
    'Weekday Mornings',
    'Weekday Afternoons',
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekends'
  ];

  const toggleAvailability = (option: string) => {
    if (!editedUser) return;

    const newAvailability = editedUser.availability.includes(option)
      ? editedUser.availability.filter(a => a !== option)
      : [...editedUser.availability, option];

    setEditedUser({
      ...editedUser,
      availability: newAvailability
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Avatar upload logic with Cloudinary
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editedUser) {
      setAvatarUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('upload_preset', 'your_upload_preset'); 

      try {
        const cloudinaryApiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_URL.split('@')[1]}/image/upload`;
        const response = await fetch(cloudinaryApiUrl, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          setEditedUser({ ...editedUser, avatar: data.secure_url });
          await mockApi.updateUser({ ...editedUser, avatar: data.secure_url });
        }
      } catch (err) {
        // Handle error
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  if (!user || !editedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white h-32 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16 relative z-10">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={editedUser.avatar}
                  alt={editedUser.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <>
                    <button
                      className="absolute bottom-2 right-2 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarUploading}
                      aria-label="Edit avatar"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                    />
                    {avatarUploading && (
                      <span className="absolute bottom-2 left-2 text-xs bg-white px-2 py-1 rounded shadow text-blue-500">Uploading...</span>
                    )}
                  </>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        className="text-2xl font-bold text-gray-900 border-b-2 border-emerald-500 bg-transparent focus:outline-none"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-gray-900">{editedUser.name}</h1>
                    )}
                    
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedUser.location || ''}
                            onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                            placeholder="Add location"
                            className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-emerald-500"
                          />
                        ) : (
                          <span>{editedUser.location || 'No location set'}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        {renderStars(editedUser.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          {editedUser.rating.toFixed(1)} ({editedUser.totalRatings} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center mt-2 text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Joined {new Date(editedUser.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-4 py-2 bg-gradient-to-r  from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2"
                        >
                          {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
              {isEditing ? (
                <textarea
                  value={editedUser.bio || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  placeholder="Tell others about yourself..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-600">
                  {editedUser.bio || 'No bio available.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Skills Offered */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Skills I Offer
            </h3>
            
            <div className="space-y-2 mb-4">
              {editedUser.skillsOffered.map((skill, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                  <span className="text-green-800 font-medium">{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeSkillOffered(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  placeholder="Add a skill you can offer"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                />
                <button
                  onClick={addSkillOffered}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Skills Wanted */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Skills I Want to Learn
            </h3>
            
            <div className="space-y-2 mb-4">
              {editedUser.skillsWanted.map((skill, index) => (
                <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="text-blue-800 font-medium">{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeSkillWanted(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  placeholder="Add a skill you want to learn"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                />
                <button
                  onClick={addSkillWanted}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availabilityOptions.map((option) => (
              <button
                key={option}
                onClick={() => isEditing && toggleAvailability(option)}
                disabled={!isEditing}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  editedUser.availability.includes(option)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Public Profile</h4>
              <p className="text-sm text-gray-600">Allow other users to find and contact you</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={editedUser.isPublic}
                onChange={(e) => setEditedUser({ ...editedUser, isPublic: e.target.checked })}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
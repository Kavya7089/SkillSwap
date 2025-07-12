import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, Phone, Globe, MessageSquare, ArrowLeft, Clock } from 'lucide-react';
import { User } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import SkillRequestModal from '../components/SkillRequestModal';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  const loadUserProfile = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const userData = await mockApi.getUserById(userId);
      setProfileUser(userData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSkill = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">The user profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === profileUser.id;

  return (
    <div className="min-h-screen bg-gradient-to-br  from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-32 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16 relative z-10">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profileUser.name}</h1>
                    
                    <div className="flex items-center mt-2 space-x-4">
                      {profileUser.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{profileUser.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        {renderStars(profileUser.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          {profileUser.rating.toFixed(1)} ({profileUser.totalRatings} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center mt-2 text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Joined {new Date(profileUser.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!isOwnProfile && (
                    <div className="flex space-x-3 mt-4 sm:mt-0">
                      <button
                        onClick={handleRequestSkill}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Request Swap</span>
                      </button>
                    </div>
                  )}

                  {isOwnProfile && (
                    <button
                      onClick={() => navigate('/profile')}
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all mt-4 sm:mt-0"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{profileUser.bio}</p>
              </div>
            )}

            {/* Contact Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileUser.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{profileUser.phone}</span>
                </div>
              )}
              {profileUser.website && (
                <div className="flex items-center text-gray-600">
                  <Globe className="h-4 w-4 mr-2" />
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {profileUser.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Skills Offered */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              Skills Offered
            </h3>
            
            <div className="space-y-2">
              {profileUser.skillsOffered.map((skill, index) => (
                <div key={index} className="bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-200">
                  <span className="text-emerald-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
              Skills Wanted
            </h3>
            
            <div className="space-y-2">
              {profileUser.skillsWanted.map((skill, index) => (
                <div key={index} className="bg-teal-50 px-4 py-3 rounded-lg border border-teal-200">
                  <span className="text-teal-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-indigo-500" />
            Availability
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {profileUser.availability.map((option) => (
              <div
                key={option}
                className="px-4 py-2 bg-indigo-50 text-indigo-800 rounded-lg text-sm font-medium text-center border border-indigo-200"
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        {profileUser.experience && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Experience</h3>
            <p className="text-gray-600">{profileUser.experience}</p>
          </div>
        )}
      </div>

      {/* Skill Request Modal */}
      <SkillRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetUser={profileUser}
        onSuccess={() => {
          console.log('Request sent successfully!');
        }}
      />
    </div>
  );
};

export default UserProfilePage;
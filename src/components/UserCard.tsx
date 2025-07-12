import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface UserCardProps {
  user: User;
  onRequest: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onRequest }) => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : index < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleViewProfile = () => {
    navigate(`/user/${user.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Card Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 
                className="text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={handleViewProfile}
              >
                {user.name}
              </h3>
              <div className="flex items-center space-x-1">
                {renderStars(user.rating)}
                <span className="text-sm text-gray-600 ml-1">({user.totalRatings})</span>
              </div>
            </div>
            
            {user.location && (
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {user.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="px-6 pb-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Offers</h4>
            <div className="flex flex-wrap gap-1">
              {user.skillsOffered.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                >
                  {skill}
                </span>
              ))}
              {user.skillsOffered.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{user.skillsOffered.length - 3}
                </span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Wants</h4>
            <div className="flex flex-wrap gap-1">
              {user.skillsWanted.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                >
                  {skill}
                </span>
              ))}
              {user.skillsWanted.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{user.skillsWanted.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="px-6 pb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{user.availability.join(', ')}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <div className="flex space-x-2">
          <button
            onClick={handleViewProfile}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>View Profile</span>
          </button>
          <button
            onClick={() => onRequest(user)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 group-hover:from-emerald-600 group-hover:to-teal-700"
          >
            <span>Request</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
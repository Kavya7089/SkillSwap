import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import UserCard from '../components/UserCard';
import SkillRequestModal from '../components/SkillRequestModal';
import { User } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import hs from '../assets/hs.png'; // Placeholder for hero image

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const usersPerPage = 6;

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, skillFilter, availabilityFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = async () => {
    try {
      const filtered = await mockApi.getUsers(searchTerm, skillFilter, availabilityFilter);
      setFilteredUsers(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to filter users:', error);
    }
  };

  const handleRequestSkill = (targetUser: User) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedUser(targetUser);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const availabilityOptions = [
    'Weekday Mornings',
    'Weekday Afternoons',
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekends'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div
        className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 relative opacity-90"
        style={{
          backgroundImage: `url(${hs})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center opacity-80">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Amazing
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Skill Swappers
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto opacity-80">
            Connect with talented individuals and exchange skills to grow together
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 opacity-80">
        <div className="bg-gray-900 rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search skills or names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Skills</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="Photoshop">Photoshop</option>
                <option value="Excel">Excel</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Availability</option>
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <button
              onClick={filterUsers}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 opacity-80">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onRequest={handleRequestSkill}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === index + 1
                          ? 'bg-emerald-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Skill Request Modal */}
      <SkillRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetUser={selectedUser}
        onSuccess={() => {
          // Could show a success toast here
          console.log('Request sent successfully!');
        }}
      />
    </div>
  );
};

export default HomePage;
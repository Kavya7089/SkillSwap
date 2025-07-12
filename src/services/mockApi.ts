import { User, SkillSwapRequest, Feedback, AdminStats, SignupData } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    location: 'San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['React', 'JavaScript', 'UI/UX Design'],
    skillsWanted: ['Python', 'Data Science', 'Machine Learning'],
    availability: ['Weekday Evenings', 'Weekends'],
    rating: 4.8,
    totalRatings: 24,
    isPublic: true,
    joinDate: '2024-01-15',
    bio: 'Frontend developer passionate about creating beautiful user experiences.',
    phone: '+1 (555) 123-4567',
    website: 'https://sarahchen.dev',
    experience: '5+ years in web development'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus@example.com',
    location: 'New York, NY',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Python', 'Data Analysis', 'Machine Learning'],
    skillsWanted: ['React', 'Node.js', 'GraphQL'],
    availability: ['Weekday Mornings', 'Weekend Afternoons'],
    rating: 4.9,
    totalRatings: 31,
    isPublic: true,
    joinDate: '2024-02-03',
    bio: 'Data scientist with 5+ years experience in ML and analytics.',
    phone: '+1 (555) 987-6543',
    website: 'https://marcusdata.com',
    experience: '7+ years in data science'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena@example.com',
    location: 'Barcelona, Spain',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Photoshop', 'Illustrator', 'Brand Design'],
    skillsWanted: ['After Effects', 'Motion Graphics', '3D Modeling'],
    availability: ['Weekday Evenings', 'Weekend Mornings'],
    rating: 4.7,
    totalRatings: 18,
    isPublic: true,
    joinDate: '2024-01-28',
    bio: 'Creative designer specializing in brand identity and visual communications.',
    phone: '+34 123 456 789',
    website: 'https://elenadesigns.es',
    experience: '4+ years in graphic design'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@example.com',
    location: 'Seoul, South Korea',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Excel', 'Financial Modeling', 'Data Visualization'],
    skillsWanted: ['Power BI', 'Tableau', 'SQL'],
    availability: ['Weekday Evenings', 'Weekend Afternoons'],
    rating: 4.6,
    totalRatings: 22,
    isPublic: true,
    joinDate: '2024-02-10',
    bio: 'Financial analyst with expertise in Excel modeling and data visualization.',
    phone: '+82 10 1234 5678',
    website: 'https://davidfinance.kr',
    experience: '6+ years in financial analysis'
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@skillswap.com',
    location: 'Global',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: ['Platform Management', 'User Support'],
    skillsWanted: ['Community Building'],
    availability: ['24/7'],
    rating: 5.0,
    totalRatings: 1,
    isPublic: false,
    joinDate: '2024-01-01',
    bio: 'Platform administrator ensuring the best experience for all users.',
    experience: 'Platform management'
  }
];

const mockRequests: SkillSwapRequest[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    offeredSkill: 'React',
    wantedSkill: 'Python',
    message: 'I would love to learn Python from you in exchange for React expertise!',
    status: 'pending',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  }
];

const mockFeedback: Feedback[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    requestId: '1',
    rating: 5,
    comment: 'Excellent teacher! Marcus explained Python concepts clearly.',
    createdAt: '2024-03-05T15:30:00Z'
  }
];

// Mock API functions
export const mockApi = {
  // User management
  getUsers: async (search?: string, skillFilter?: string, availabilityFilter?: string): Promise<User[]> => {
    let filteredUsers = [...mockUsers.filter(user => user.isPublic)];
    
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(search.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (skillFilter) {
      filteredUsers = filteredUsers.filter(user =>
        user.skillsOffered.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }
    
    if (availabilityFilter) {
      filteredUsers = filteredUsers.filter(user =>
        user.availability.includes(availabilityFilter)
      );
    }
    
    return new Promise(resolve => setTimeout(() => resolve(filteredUsers), 500));
  },

  getUserById: async (id: string): Promise<User | null> => {
    const user = mockUsers.find(u => u.id === id);
    return new Promise(resolve => setTimeout(() => resolve(user || null), 300));
  },

  updateUser: async (user: User): Promise<User> => {
    const index = mockUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      mockUsers[index] = user;
    }
    return new Promise(resolve => setTimeout(() => resolve(user), 500));
  },

  // Authentication
  login: async (email: string, password: string): Promise<User | null> => {
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return new Promise(resolve => 
      setTimeout(() => resolve(user || null), 1000)
    );
  },

  signup: async (signupData: SignupData): Promise<User> => {
    const newUser: User = {
      id: Date.now().toString(),
      name: signupData.name,
      email: signupData.email,
      location: signupData.location,
      avatar: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      skillsOffered: signupData.skillsOffered,
      skillsWanted: signupData.skillsWanted,
      availability: signupData.availability,
      rating: 0,
      totalRatings: 0,
      isPublic: true,
      joinDate: new Date().toISOString().split('T')[0],
      bio: signupData.bio,
      phone: signupData.phone,
      website: signupData.website,
      experience: 'New to platform'
    };
    
    mockUsers.push(newUser);
    return new Promise(resolve => setTimeout(() => resolve(newUser), 1000));
  },

  // Request management
  getRequests: async (userId: string): Promise<SkillSwapRequest[]> => {
    const userRequests = mockRequests.filter(r => 
      r.fromUserId === userId || r.toUserId === userId
    );
    return new Promise(resolve => setTimeout(() => resolve(userRequests), 400));
  },

  createRequest: async (request: Omit<SkillSwapRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<SkillSwapRequest> => {
    const newRequest: SkillSwapRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockRequests.push(newRequest);
    return new Promise(resolve => setTimeout(() => resolve(newRequest), 600));
  },

  updateRequestStatus: async (requestId: string, status: SkillSwapRequest['status']): Promise<SkillSwapRequest | null> => {
    const request = mockRequests.find(r => r.id === requestId);
    if (request) {
      request.status = status;
      request.updatedAt = new Date().toISOString();
    }
    return new Promise(resolve => setTimeout(() => resolve(request || null), 400));
  },

  // Feedback
  submitFeedback: async (feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    mockFeedback.push(newFeedback);
    return new Promise(resolve => setTimeout(() => resolve(newFeedback), 500));
  },

  // Admin
  getAdminStats: async (): Promise<AdminStats> => {
    const stats: AdminStats = {
      totalUsers: mockUsers.length,
      totalSwaps: mockRequests.filter(r => r.status === 'completed').length,
      pendingRequests: mockRequests.filter(r => r.status === 'pending').length,
      completedSwaps: mockRequests.filter(r => r.status === 'completed').length,
      averageRating: 4.7
    };
    return new Promise(resolve => setTimeout(() => resolve(stats), 400));
  }
};
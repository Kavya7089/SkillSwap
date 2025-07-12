export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  avatar: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  rating: number;
  totalRatings: number;
  isPublic: boolean;
  joinDate: string;
  bio?: string;
  phone?: string;
  website?: string;
  experience?: string;
}

export interface SkillSwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredSkill: string;
  wantedSkill: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  fromUserId: string;
  toUserId: string;
  requestId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalSwaps: number;
  pendingRequests: number;
  completedSwaps: number;
  averageRating: number;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location?: string;
  bio?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  phone?: string;
  website?: string;
}
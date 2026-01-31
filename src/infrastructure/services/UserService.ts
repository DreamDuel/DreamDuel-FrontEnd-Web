// User Service
// Servicio completo para gestión de usuarios

import { HttpClient } from './HttpClient';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  isPremium: boolean;
  stats: {
    storiesCreated: number;
    totalLikes: number;
    followers: number;
    following: number;
  };
  credits: {
    freeImagesLeft: number;
    referralCode: string;
    referralsCount: number;
  };
}

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface FollowResponse {
  following: boolean;
  followersCount: number;
}

export class UserService {
  private http: HttpClient;
  private userEndpoint = '/api/users';

  constructor() {
    this.http = new HttpClient();
  }

  async getProfile(userId: string): Promise<UserProfile> {
    return await this.http.get<UserProfile>(`${this.userEndpoint}/${userId}`);
  }

  async getCurrentUser(): Promise<UserProfile> {
    return await this.http.get<UserProfile>(`${this.userEndpoint}/me`);
  }

  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<UserProfile> {
    return await this.http.put<UserProfile>(`${this.userEndpoint}/${userId}`, data);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    return await this.http.put<UserProfile>(`${this.userEndpoint}/${userId}/avatar`, { avatarUrl });
  }

  async followUser(userId: string): Promise<FollowResponse> {
    return await this.http.post<FollowResponse>(`${this.userEndpoint}/${userId}/follow`, {});
  }

  async unfollowUser(userId: string): Promise<FollowResponse> {
    return await this.http.post<FollowResponse>(`${this.userEndpoint}/${userId}/unfollow`, {});
  }

  async getFollowers(userId: string): Promise<UserProfile[]> {
    return await this.http.get<UserProfile[]>(`${this.userEndpoint}/${userId}/followers`);
  }

  async getFollowing(userId: string): Promise<UserProfile[]> {
    return await this.http.get<UserProfile[]>(`${this.userEndpoint}/${userId}/following`);
  }

  async checkCredits(): Promise<{ freeImagesLeft: number; resetAt: Date }> {
    return await this.http.get(`${this.userEndpoint}/me/credits`);
  }

  async useCredit(): Promise<{ success: boolean; creditsLeft: number }> {
    return await this.http.post(`${this.userEndpoint}/me/credits/use`, {});
  }

  async applyReferralCode(code: string): Promise<{ success: boolean; bonusCredits: number }> {
    return await this.http.post(`${this.userEndpoint}/me/referral/apply`, { code });
  }
}

// Repository Interface: IUserRepository
// Contrato para acceder a usuarios

import type { User } from '../entities/User.entity';

export interface IUserRepository {
  // Queries
  getById(id: string): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  getCurrent(): Promise<User | null>;
  
  // Commands
  update(id: string, data: Partial<User>): Promise<User>;
  follow(userId: string, targetUserId: string): Promise<void>;
  unfollow(userId: string, targetUserId: string): Promise<void>;
  
  // Auth
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  register(data: RegisterData): Promise<User>;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

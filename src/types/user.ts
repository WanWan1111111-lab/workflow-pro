export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  createdAt: string;
}

import { create } from 'zustand';
import type { User } from '../types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => {
  // 从 localStorage 恢复用户状态
  const savedUser = localStorage.getItem('user');
  const initialUser = savedUser ? JSON.parse(savedUser) : null;

  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    login: (username: string) => {
      const role = username === 'admin' ? 'admin' : 'user';
      const user: User = {
        id: `u_${Date.now()}`,
        username,
        role,
        email: `${username}@workflow-pro.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
    },
  };
});

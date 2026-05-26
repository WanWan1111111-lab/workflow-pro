import { useUserStore } from '../store';
import { isAdmin, hasPermission } from '../utils/permission';
import type { UserRole } from '../types';

export const useAuth = () => {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return {
    user,
    isAuthenticated,
    isAdmin: user ? isAdmin(user.role) : false,
    hasPermission: (requiredRoles: UserRole[]) =>
      user ? hasPermission(user.role, requiredRoles) : false,
  };
};

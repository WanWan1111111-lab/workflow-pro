import type { UserRole } from '../types';

/**
 * 检查用户是否有权限
 * @param userRole 用户角色
 * @param requiredRoles 需要的角色列表
 * @returns 是否有权限
 */
export const hasPermission = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};

/**
 * 检查是否是管理员
 * @param userRole 用户角色
 * @returns 是否是管理员
 */
export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === 'admin';
};

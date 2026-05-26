// WorkOrder types
export type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high';

export interface WorkOrder {
  id: string;
  project: string;
  status: WorkOrderStatus;
  overtime: boolean;
  hours: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
}

// User types
export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  createdAt: string;
}

// OperationLog type
export interface OperationLog {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'view';
  targetType: 'workorder' | 'user';
  targetId: string;
  timestamp: string;
  details?: Record<string, any>;
}

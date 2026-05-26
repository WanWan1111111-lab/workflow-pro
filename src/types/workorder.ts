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

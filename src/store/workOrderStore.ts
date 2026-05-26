import { create } from 'zustand';
import type { WorkOrder } from '../types';
import { MOCK_WORK_ORDERS } from '../constants';

interface WorkOrderState {
  workOrders: WorkOrder[];
  initWorkOrders: () => void;
  addWorkOrder: (workOrder: WorkOrder) => void;
  updateWorkOrder: (id: string, workOrder: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  deleteWorkOrders: (ids: string[]) => void;
}

export const useWorkOrderStore = create<WorkOrderState>((set) => {
  // 从 localStorage 恢复工单数据
  const savedOrders = localStorage.getItem('workOrders');
  const initialOrders = savedOrders ? JSON.parse(savedOrders) : MOCK_WORK_ORDERS;

  return {
    workOrders: initialOrders,
    initWorkOrders: () => {
      localStorage.setItem('workOrders', JSON.stringify(MOCK_WORK_ORDERS));
      set({ workOrders: MOCK_WORK_ORDERS });
    },
    addWorkOrder: (workOrder: WorkOrder) => {
      set((state) => {
        const newOrders = [...state.workOrders, workOrder];
        localStorage.setItem('workOrders', JSON.stringify(newOrders));
        return { workOrders: newOrders };
      });
    },
    updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => {
      set((state) => {
        const newOrders = state.workOrders.map((order) =>
          order.id === id ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
        );
        localStorage.setItem('workOrders', JSON.stringify(newOrders));
        return { workOrders: newOrders };
      });
    },
    deleteWorkOrder: (id: string) => {
      set((state) => {
        const newOrders = state.workOrders.filter((order) => order.id !== id);
        localStorage.setItem('workOrders', JSON.stringify(newOrders));
        return { workOrders: newOrders };
      });
    },
    deleteWorkOrders: (ids: string[]) => {
      set((state) => {
        const newOrders = state.workOrders.filter((order) => !ids.includes(order.id));
        localStorage.setItem('workOrders', JSON.stringify(newOrders));
        return { workOrders: newOrders };
      });
    },
  };
});

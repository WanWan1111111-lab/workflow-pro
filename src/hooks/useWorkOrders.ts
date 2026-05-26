import { useWorkOrderStore } from '../store';

export const useWorkOrders = () => {
  const workOrders = useWorkOrderStore((state) => state.workOrders);
  const addWorkOrder = useWorkOrderStore((state) => state.addWorkOrder);
  const updateWorkOrder = useWorkOrderStore((state) => state.updateWorkOrder);
  const deleteWorkOrder = useWorkOrderStore((state) => state.deleteWorkOrder);
  const deleteWorkOrders = useWorkOrderStore((state) => state.deleteWorkOrders);
  const initWorkOrders = useWorkOrderStore((state) => state.initWorkOrders);

  return {
    workOrders,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    deleteWorkOrders,
    initWorkOrders,
  };
};

import type { WorkOrder } from '../types';
import dayjs from 'dayjs';

/**
 * 处理项目工时分布数据（柱状图）
 */
export const processProjectHoursData = (workOrders: WorkOrder[]) => {
  const projectMap = new Map<string, { normal: number; overtime: number }>();

  workOrders.forEach((order) => {
    if (!projectMap.has(order.project)) {
      projectMap.set(order.project, { normal: 0, overtime: 0 });
    }
    const data = projectMap.get(order.project)!;
    if (order.overtime) {
      data.overtime += order.hours;
    } else {
      data.normal += order.hours;
    }
  });

  const projects = Array.from(projectMap.keys());
  const normalHours = projects.map((p) => projectMap.get(p)!.normal);
  const overtimeHours = projects.map((p) => projectMap.get(p)!.overtime);

  return { projects, normalHours, overtimeHours };
};

/**
 * 处理工时趋势数据（折线图）
 */
export const processTrendData = (workOrders: WorkOrder[], days: number = 7) => {
  const dateMap = new Map<string, { normal: number; overtime: number }>();

  // 初始化最近 N 天的数据
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('MM-DD');
    dateMap.set(date, { normal: 0, overtime: 0 });
  }

  // 统计数据
  workOrders.forEach((order) => {
    const date = dayjs(order.createdAt).format('MM-DD');
    if (dateMap.has(date)) {
      const data = dateMap.get(date)!;
      if (order.overtime) {
        data.overtime += order.hours;
      } else {
        data.normal += order.hours;
      }
    }
  });

  const dates = Array.from(dateMap.keys());
  const normalHours = dates.map((d) => dateMap.get(d)!.normal);
  const overtimeHours = dates.map((d) => dateMap.get(d)!.overtime);

  return { dates, normalHours, overtimeHours };
};

/**
 * 处理状态分布数据（饼图）
 */
export const processStatusData = (workOrders: WorkOrder[]) => {
  const statusMap = new Map<string, number>();
  const statusNames = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
  };

  workOrders.forEach((order) => {
    const count = statusMap.get(order.status) || 0;
    statusMap.set(order.status, count + 1);
  });

  return Object.entries(statusNames).map(([key, name]) => ({
    name,
    value: statusMap.get(key) || 0,
  }));
};

/**
 * 处理加班热力图数据
 */
export const processHeatmapData = (workOrders: WorkOrder[]): [number, number, number][] => {
  const heatmapData: [number, number, number][] = [];
  const dataMap = new Map<string, number>();

  // 统计加班数据
  workOrders
    .filter((order) => order.overtime)
    .forEach((order) => {
      const date = dayjs(order.createdAt);
      const day = date.day() === 0 ? 6 : date.day() - 1; // 转换为周一=0, 周日=6
      const hour = Math.floor(date.hour() / 2); // 每2小时一格
      const key = `${day}-${hour}`;
      dataMap.set(key, (dataMap.get(key) || 0) + 1);
    });

  // 转换为 ECharts 格式
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 12; hour++) {
      const key = `${day}-${hour}`;
      heatmapData.push([hour, day, dataMap.get(key) || 0]); // 注意：[x, y, value] x是小时，y是星期
    }
  }

  return heatmapData;
};

/**
 * 计算统计数据
 */
export const calculateStats = (workOrders: WorkOrder[]) => {
  const totalOrders = workOrders.length;
  const totalHours = workOrders.reduce((sum, order) => sum + order.hours, 0);
  const overtimeOrders = workOrders.filter((order) => order.overtime).length;
  const overtimeRate = totalOrders > 0 ? (overtimeOrders / totalOrders) * 100 : 0;
  const activeProjects = new Set(
    workOrders.filter((order) => order.status === 'in_progress').map((order) => order.project)
  ).size;

  return {
    totalOrders,
    totalHours: totalHours.toFixed(1),
    overtimeRate: overtimeRate.toFixed(0),
    activeProjects,
  };
};

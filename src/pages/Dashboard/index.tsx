import { Row, Col, Card } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  FireOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { useWorkOrders } from '../../hooks';
import StatCard from '../../components/StatCard';
import { BarChart, LineChart, PieChart, HeatmapChart } from '../../components/Charts';
import {
  processProjectHoursData,
  processTrendData,
  processStatusData,
  processHeatmapData,
  calculateStats,
} from '../../utils/chartData';
import './index.less';

const Dashboard = () => {
  const { workOrders } = useWorkOrders();

  // 计算统计数据
  const stats = calculateStats(workOrders);

  // 处理图表数据
  const projectHoursData = processProjectHoursData(workOrders);
  const trendData = processTrendData(workOrders, 7);
  const statusData = processStatusData(workOrders);
  const heatmapData = processHeatmapData(workOrders);

  return (
    <div className="dashboard-container">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总工单数"
            value={stats.totalOrders}
            icon={<FileTextOutlined />}
            trend={12}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总工时"
            value={stats.totalHours}
            suffix="h"
            icon={<ClockCircleOutlined />}
            trend={8}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="加班率"
            value={stats.overtimeRate}
            suffix="%"
            icon={<FireOutlined />}
            trend={-5}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="活跃项目"
            value={stats.activeProjects}
            icon={<ProjectOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="工时趋势" bordered={false} className="chart-card">
            <LineChart data={trendData} height={350} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="项目工时分布" bordered={false} className="chart-card">
            <BarChart data={projectHoursData} height={350} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="加班时段分布" bordered={false} className="chart-card">
            <HeatmapChart data={heatmapData} height={350} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="工单状态占比" bordered={false} className="chart-card">
            <PieChart data={statusData} height={350} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

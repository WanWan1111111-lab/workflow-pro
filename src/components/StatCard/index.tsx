import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './index.less';

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: number;
  color?: string;
}

const StatCard = ({ title, value, suffix, icon, trend, color = '#1890ff' }: StatCardProps) => {
  const trendIcon = trend && trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  const trendColor = trend && trend > 0 ? '#52c41a' : '#f5222d';

  return (
    <Card className="stat-card" bordered={false}>
      <div className="stat-card-content">
        <div className="stat-info">
          <div className="stat-title">{title}</div>
          <Statistic
            value={value}
            suffix={suffix}
            valueStyle={{ color, fontSize: 28, fontWeight: 600 }}
          />
          {trend !== undefined && (
            <div className="stat-trend" style={{ color: trendColor }}>
              {trendIcon}
              <span style={{ marginLeft: 4 }}>
                {Math.abs(trend)}% {trend > 0 ? '增长' : '下降'}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="stat-icon" style={{ color }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;

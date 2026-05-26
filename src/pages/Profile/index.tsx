import { Row, Col, Card, Avatar, Descriptions, List, Tag, Statistic, Empty } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth, useWorkOrders } from '../../hooks';
import { formatDate } from '../../utils/date';
import { STATUS_COLORS, STATUS_TEXT } from '../../constants';
import { useMemo } from 'react';
import type { WorkOrder } from '../../types';
import './index.less';

const Profile = () => {
  const { user } = useAuth();
  const { workOrders } = useWorkOrders();

  console.log('Profile - 当前用户:', user);
  console.log('Profile - 所有工单数:', workOrders.length);
  console.log('Profile - 用户创建的工单:', workOrders.filter((order) => order.createdBy === user?.username));

  // 计算个人统计数据
  const userStats = useMemo(() => {
    const userOrders = workOrders.filter((order) => order.createdBy === user?.username);
    const totalOrders = userOrders.length;
    const totalHours = userOrders.reduce((sum, order) => sum + order.hours, 0);
    const overtimeCount = userOrders.filter((order) => order.overtime).length;
    const avgHours = totalOrders > 0 ? totalHours / totalOrders : 0;

    return {
      totalOrders,
      totalHours: totalHours.toFixed(1),
      overtimeCount,
      avgHours: avgHours.toFixed(1),
    };
  }, [workOrders, user]);

  // 获取用户最近的工单
  const recentOrders = useMemo(() => {
    return workOrders
      .filter((order) => order.createdBy === user?.username)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [workOrders, user]);

  // 模拟操作日志
  const operationLogs = useMemo(() => {
    return recentOrders.slice(0, 20).map((order) => ({
      id: order.id,
      time: order.createdAt,
      action: '创建工单',
      target: `#${order.id}`,
    }));
  }, [recentOrders]);

  if (!user) {
    return <Empty description="未登录" />;
  }

  return (
    <div className="profile-container">
      <Row gutter={[16, 16]}>
        {/* 个人信息卡片 */}
        <Col xs={24} lg={8}>
          <Card className="profile-card" bordered={false}>
            <div className="profile-header">
              <Avatar size={80} src={user.avatar} icon={<UserOutlined />} />
              <div className="profile-info">
                <h2>{user.username}</h2>
                <Tag color={user.role === 'admin' ? 'red' : 'blue'}>
                  {user.role === 'admin' ? '管理员' : '普通用户'}
                </Tag>
              </div>
            </div>
            <Descriptions column={1} style={{ marginTop: 24 }}>
              <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {formatDate(user.createdAt, 'YYYY-MM-DD')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 统计数据卡片 */}
        <Col xs={24} lg={16}>
          <Card title="我的统计" bordered={false} className="stats-card">
            <Row gutter={16}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="本月工单"
                  value={userStats.totalOrders}
                  suffix="条"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="本月工时"
                  value={userStats.totalHours}
                  suffix="小时"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="加班次数"
                  value={userStats.overtimeCount}
                  suffix="次"
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="平均工时"
                  value={userStats.avgHours}
                  suffix="小时/单"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 我的工单 */}
        <Col xs={24} lg={12}>
          <Card title="我的工单" bordered={false} className="list-card">
            <List
              dataSource={recentOrders}
              locale={{ emptyText: '暂无工单' }}
              renderItem={(item: WorkOrder) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <span>
                        #{item.id} - {item.project}
                      </span>
                    }
                    description={
                      <span>
                        {formatDate(item.createdAt)} · {item.hours}h
                      </span>
                    }
                  />
                  <Tag color={STATUS_COLORS[item.status]}>
                    {STATUS_TEXT[item.status]}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 操作日志 */}
        <Col xs={24} lg={12}>
          <Card title="操作日志" bordered={false} className="list-card">
            <List
              dataSource={operationLogs}
              locale={{ emptyText: '暂无日志' }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.action} ${item.target}`}
                    description={formatDate(item.time)}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;

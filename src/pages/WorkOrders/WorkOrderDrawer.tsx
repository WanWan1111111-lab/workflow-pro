import { Drawer, Descriptions, Tag, Space } from 'antd';
import { formatDate } from '../../utils/date';
import { STATUS_COLORS, STATUS_TEXT, PRIORITY_COLORS, PRIORITY_TEXT } from '../../constants';
import type { WorkOrder } from '../../types';

interface WorkOrderDrawerProps {
  open: boolean;
  workOrder: WorkOrder | null;
  onClose: () => void;
}

const WorkOrderDrawer = ({ open, workOrder, onClose }: WorkOrderDrawerProps) => {
  if (!workOrder) return null;

  return (
    <Drawer
      title="工单详情"
      placement="right"
      width={600}
      onClose={onClose}
      open={open}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="工单ID">{workOrder.id}</Descriptions.Item>
        <Descriptions.Item label="项目名称">{workOrder.project}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={STATUS_COLORS[workOrder.status]}>
            {STATUS_TEXT[workOrder.status]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="工时">{workOrder.hours} 小时</Descriptions.Item>
        <Descriptions.Item label="是否加班">
          <Tag color={workOrder.overtime ? 'orange' : 'default'}>
            {workOrder.overtime ? '是' : '否'}
          </Tag>
        </Descriptions.Item>
        {workOrder.priority && (
          <Descriptions.Item label="优先级">
            <Tag color={PRIORITY_COLORS[workOrder.priority]}>
              {PRIORITY_TEXT[workOrder.priority]}
            </Tag>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="创建时间">
          {formatDate(workOrder.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {formatDate(workOrder.updatedAt)}
        </Descriptions.Item>
        <Descriptions.Item label="创建人">{workOrder.createdBy}</Descriptions.Item>
        {workOrder.description && (
          <Descriptions.Item label="备注说明">{workOrder.description}</Descriptions.Item>
        )}
        {workOrder.tags && workOrder.tags.length > 0 && (
          <Descriptions.Item label="标签">
            <Space>
              {workOrder.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Drawer>
  );
};

export default WorkOrderDrawer;

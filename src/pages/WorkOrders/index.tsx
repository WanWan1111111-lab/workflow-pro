import { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
  message,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useWorkOrders, useAuth } from '../../hooks';
import { formatDate } from '../../utils/date';
import { STATUS_COLORS, STATUS_TEXT, PRIORITY_COLORS, PRIORITY_TEXT } from '../../constants';
import WorkOrderModal from './WorkOrderModal';
import WorkOrderDrawer from './WorkOrderDrawer';
import type { WorkOrder } from '../../types';
import './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const WorkOrders = () => {
  const { workOrders, addWorkOrder, updateWorkOrder, deleteWorkOrder, deleteWorkOrders } =
    useWorkOrders();
  const { user, isAdmin } = useAuth();

  // 状态管理
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentWorkOrder, setCurrentWorkOrder] = useState<WorkOrder | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailWorkOrder, setDetailWorkOrder] = useState<WorkOrder | null>(null);

  // 筛选条件
  const [searchText, setSearchText] = useState('');
  const [filterProject, setFilterProject] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterOvertime, setFilterOvertime] = useState<string>('');

  // 获取项目列表
  const projects = useMemo(() => {
    return Array.from(new Set(workOrders.map((order) => order.project)));
  }, [workOrders]);

  // 筛选数据
  const filteredData = useMemo(() => {
    return workOrders.filter((order) => {
      const matchSearch =
        !searchText ||
        order.id.toLowerCase().includes(searchText.toLowerCase()) ||
        order.project.toLowerCase().includes(searchText.toLowerCase());
      const matchProject = !filterProject || order.project === filterProject;
      const matchStatus = !filterStatus || order.status === filterStatus;
      const matchOvertime =
        !filterOvertime ||
        (filterOvertime === 'yes' && order.overtime) ||
        (filterOvertime === 'no' && !order.overtime);

      return matchSearch && matchProject && matchStatus && matchOvertime;
    });
  }, [workOrders, searchText, filterProject, filterStatus, filterOvertime]);

  // 表格列定义
  const columns: ColumnsType<WorkOrder> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: '项目名称',
      dataIndex: 'project',
      key: 'project',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={STATUS_COLORS[status as keyof typeof STATUS_COLORS]}>
          {STATUS_TEXT[status as keyof typeof STATUS_TEXT]}
        </Tag>
      ),
    },
    {
      title: '工时',
      dataIndex: 'hours',
      key: 'hours',
      width: 100,
      sorter: (a, b) => a.hours - b.hours,
      render: (hours) => `${hours}h`,
    },
    {
      title: '加班',
      dataIndex: 'overtime',
      key: 'overtime',
      width: 80,
      render: (overtime) => (
        <Tag color={overtime ? 'orange' : 'default'}>{overtime ? '是' : '否'}</Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) =>
        priority ? (
          <Tag color={PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS]}>
            {PRIORITY_TEXT[priority as keyof typeof PRIORITY_TEXT]}
          </Tag>
        ) : (
          '-'
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="编辑">
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 处理函数
  const handleCreate = () => {
    setModalMode('create');
    setCurrentWorkOrder(undefined);
    setModalOpen(true);
  };

  const handleEdit = (record: WorkOrder) => {
    setModalMode('edit');
    setCurrentWorkOrder(record);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条工单吗？',
      onOk: () => {
        deleteWorkOrder(id);
        message.success('删除成功');
      },
    });
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的工单');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条工单吗？`,
      onOk: () => {
        deleteWorkOrders(selectedRowKeys as string[]);
        setSelectedRowKeys([]);
        message.success('批量删除成功');
      },
    });
  };

  const handleViewDetail = (record: WorkOrder) => {
    setDetailWorkOrder(record);
    setDrawerOpen(true);
  };

  const handleModalSubmit = (values: Partial<WorkOrder>) => {
    if (modalMode === 'create') {
      const newWorkOrder: WorkOrder = {
        id: `${Date.now()}`.slice(-6).padStart(3, '0'),
        ...values,
        createdBy: user?.username || 'unknown',
        updatedAt: new Date().toISOString(),
      } as WorkOrder;
      addWorkOrder(newWorkOrder);
    } else if (currentWorkOrder) {
      updateWorkOrder(currentWorkOrder.id, values);
    }
    setModalOpen(false);
  };

  const handleReset = () => {
    setSearchText('');
    setFilterProject('');
    setFilterStatus('');
    setFilterOvertime('');
  };

  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div className="workorders-container">
      <Card className="filter-card" bordered={false}>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索 ID 或项目名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Select
              placeholder="项目"
              value={filterProject}
              onChange={setFilterProject}
              style={{ width: 150 }}
              allowClear
            >
              {projects.map((project) => (
                <Option key={project} value={project}>
                  {project}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="状态"
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="pending">待处理</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
            <Select
              placeholder="加班"
              value={filterOvertime}
              onChange={setFilterOvertime}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="yes">仅加班</Option>
              <Option value="no">仅非加班</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </div>

        <Space wrap>
          {isAdmin && (
            <>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新建工单
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBatchDelete}
                disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
            </>
          )}
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出 Excel
          </Button>
          <span style={{ marginLeft: 8, color: '#8c8c8c' }}>
            共 {filteredData.length} 条
          </span>
        </Space>
      </Card>

      <Card bordered={false} style={{ marginTop: 16 }}>
        <Table
          rowSelection={isAdmin ? rowSelection : undefined}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>

      <WorkOrderModal
        open={modalOpen}
        mode={modalMode}
        workOrder={currentWorkOrder}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <WorkOrderDrawer
        open={drawerOpen}
        workOrder={detailWorkOrder}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default WorkOrders;

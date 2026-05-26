import { Modal, Form, Input, InputNumber, Select, Switch, DatePicker, message } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import type { WorkOrder } from '../../types';

interface WorkOrderModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  workOrder?: WorkOrder;
  onCancel: () => void;
  onSubmit: (values: Partial<WorkOrder>) => void;
}

const { TextArea } = Input;
const { Option } = Select;

const WorkOrderModal = ({ open, mode, workOrder, onCancel, onSubmit }: WorkOrderModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && workOrder) {
        form.setFieldsValue({
          ...workOrder,
          createdAt: dayjs(workOrder.createdAt),
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, mode, workOrder, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        createdAt: values.createdAt.toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onSubmit(formattedValues);
      message.success(mode === 'create' ? '工单创建成功' : '工单更新成功');
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={mode === 'create' ? '新建工单' : '编辑工单'}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <Form.Item
          name="project"
          label="项目名称"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
          initialValue="pending"
        >
          <Select placeholder="请选择状态">
            <Option value="pending">待处理</Option>
            <Option value="in_progress">进行中</Option>
            <Option value="completed">已完成</Option>
            <Option value="cancelled">已取消</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="hours"
          label="工时（小时）"
          rules={[{ required: true, message: '请输入工时' }]}
        >
          <InputNumber
            min={0}
            max={24}
            step={0.5}
            placeholder="请输入工时"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item name="overtime" label="是否加班" valuePropName="checked" initialValue={false}>
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>

        <Form.Item name="priority" label="优先级" initialValue="medium">
          <Select placeholder="请选择优先级">
            <Option value="low">低</Option>
            <Option value="medium">中</Option>
            <Option value="high">高</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="createdAt"
          label="创建时间"
          rules={[{ required: true, message: '请选择创建时间' }]}
          initialValue={dayjs()}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="description" label="备注说明">
          <TextArea rows={4} placeholder="请输入备注说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WorkOrderModal;

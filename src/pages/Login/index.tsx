import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import './index.less';

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const [form] = Form.useForm();

  const handleSubmit = (values: LoginForm) => {
    // 简单验证：任何非空用户名和密码都可以登录
    if (values.username && values.password) {
      login(values.username);
      message.success(`欢迎回来，${values.username}！`);
      navigate('/dashboard');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    });
  };

  return (
    <div className="login-container">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-content">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon-wrapper">
              <span className="logo-icon">⚡</span>
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-text">WorkFlow</span>
              <span className="logo-badge">Pro</span>
            </div>
          </div>
          <p className="subtitle">让工单管理更简单</p>
        </div>

        <Card className="login-card">
          <div className="card-decoration"></div>
          
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="输入用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="输入密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block className="login-btn">
                立即登录
              </Button>
            </Form.Item>
          </Form>

          <div className="login-tips">
            <div className="tip-item">
              <span className="tip-icon">👤</span>
              <span>管理员账号：<code>admin</code></span>
              <Button 
                type="text" 
                size="small" 
                icon={<CopyOutlined />} 
                onClick={() => handleCopy('admin')}
                className="copy-btn"
              />
            </div>
            <div className="tip-item">
              <span className="tip-icon">👨‍💼</span>
              <span>普通用户：<code>user1</code></span>
              <Button 
                type="text" 
                size="small" 
                icon={<CopyOutlined />} 
                onClick={() => handleCopy('user1')}
                className="copy-btn"
              />
            </div>
            <div className="tip-item">
              <span className="tip-icon">🔑</span>
              <span>密码随意，非空即可</span>
            </div>
          </div>
        </Card>

        <div className="login-footer">
          <p>© WorkFlow Pro · 工单管理系统</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { Layout, Avatar, Dropdown, Space, Input } from 'antd';
import { UserOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import type { MenuProps } from 'antd';
import './Header.less';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon-wrapper">
            <span className="logo-icon">⚡</span>
          </div>
          <span className="logo-text">WorkFlow</span>
        </div>
      </div>

      <div className="header-center">
        <Search
          placeholder="搜索工单、项目..."
          prefix={<SearchOutlined />}
          style={{ width: 400 }}
          allowClear
        />
      </div>

      <div className="header-right">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Space className="user-info">
            <Avatar src={user?.avatar} icon={<UserOutlined />} />
            <span className="username">{user?.username}</span>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;

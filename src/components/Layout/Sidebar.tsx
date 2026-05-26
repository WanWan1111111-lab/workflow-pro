import { Menu } from 'antd';
import { DashboardOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import './Sidebar.less';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '数据看板',
  },
  {
    key: '/workorders',
    icon: <FileTextOutlined />,
    label: '工单管理',
  },
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: '个人中心',
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  return (
    <div className="app-sidebar">
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ height: '100%', borderRight: 0 }}
      />
    </div>
  );
};

export default Sidebar;

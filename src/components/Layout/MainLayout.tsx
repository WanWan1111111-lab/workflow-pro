import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.less';

const { Content, Sider } = Layout;

const MainLayout = () => {
  return (
    <Layout className="main-layout">
      <Header />
      <Layout>
        <Sider width={200} className="site-layout-sider">
          <Sidebar />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content className="site-layout-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

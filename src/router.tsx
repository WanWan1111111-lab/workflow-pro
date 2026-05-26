import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';

// 懒加载页面组件
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkOrders = lazy(() => import('./pages/WorkOrders'));
const Profile = lazy(() => import('./pages/Profile'));

// 加载组件
const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<LoadingComponent />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: 'workorders',
            element: (
              <Suspense fallback={<LoadingComponent />}>
                <WorkOrders />
              </Suspense>
            ),
          },
          {
            path: 'profile',
            element: (
              <Suspense fallback={<LoadingComponent />}>
                <Profile />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

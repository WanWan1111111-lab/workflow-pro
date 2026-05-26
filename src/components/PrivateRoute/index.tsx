import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../store';

const PrivateRoute = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

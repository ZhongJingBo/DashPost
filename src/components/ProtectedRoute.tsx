import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setAuthChecked(true);
  }, []);

  // 在认证状态确定之前不渲染任何内容，避免闪烁
  if (!authChecked) {
    return null;
  }

  if (!isAuth) {
    // 保存尝试访问的路径，登录后跳转回来
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <div className="bg-white">{children}</div>;
};

export default ProtectedRoute; 
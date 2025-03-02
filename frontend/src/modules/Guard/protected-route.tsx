import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  const token = Cookies.get('access_token');
  const userData = Cookies.get('user');
  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from cookies:', error);
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute -> token:', token);
  console.log('ProtectedRoute -> user:', user);

  if (!token) {
    console.warn('No token found, redirecting...');
    return <Navigate to="/" replace />;
  }

  if (!user) {
    console.warn('No user data found, redirecting...');
    return <Navigate to="/" replace />;
  }

  if (!user.position) {
    console.warn('User position missing, redirecting...');
    return <Navigate to="/" replace />;
  }

  if (!['hr'].includes(user.position)) {
    console.warn(`Unauthorized position: ${user.position}, redirecting...`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

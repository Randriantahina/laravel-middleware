import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? <Navigate to="/dashboard" /> : children;
};

export default GuestRoute;

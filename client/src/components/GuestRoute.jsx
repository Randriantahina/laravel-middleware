// GuestRoute.js
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Rediriger un utilisateur déjà authentifié vers le dashboard
  return token ? <Navigate to="/dashboard" /> : children;
};

export default GuestRoute;

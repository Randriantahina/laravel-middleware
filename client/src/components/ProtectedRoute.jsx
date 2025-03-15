// ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Rediriger un utilisateur non authentifié vers la page de login
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

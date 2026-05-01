import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

// function responsible for restricting routes and allowing only authenticated users to use those routes
// else redirecting them to the login page

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Pass the current path to the login page state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

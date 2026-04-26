import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

// function responsible for restricting routes and allowing only authenticated users to use those routes
// else redirecting them to the login page

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;

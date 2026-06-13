import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectTo =
      user.role === "department_user" ? "/dept/dashboard" : "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;

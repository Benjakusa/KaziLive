import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    if (allowedRoles && allowedRoles.includes('employer')) {
      return <Navigate to="/employer/login" />;
    }
    if (allowedRoles && allowedRoles.includes('jobseeker')) {
      return <Navigate to="/jobseeker/login" />;
    }
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'employer') {
      return <Navigate to="/employer/dashboard" />;
    }
    if (user?.role === 'jobseeker') {
      return <Navigate to="/jobseeker/dashboard" />;
    }
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute; 
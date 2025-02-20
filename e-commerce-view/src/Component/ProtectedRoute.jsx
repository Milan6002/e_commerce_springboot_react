import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../Services/authService";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();

  if (!user ) {
    return <Navigate to="/ecommerce/login" />;
  }

  return children;
};

export default ProtectedRoute;

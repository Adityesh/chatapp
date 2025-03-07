import { APP_URL } from "@/constants/clientUrl.constants";
import { checkAuthenticatedUser } from "@/utils";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const SessionCookie = checkAuthenticatedUser();
  if (SessionCookie) {
    return <Outlet />;
  }

  return <Navigate to={APP_URL.AUTH} replace />;
};

export default ProtectedRoute;

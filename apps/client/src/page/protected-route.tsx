import { APP_URL } from "@/constants/clientUrl.constants";
import { checkAuthenticatedUser } from "@/utils";
import { Navigate, Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import AppSidebarToggle from "@/components/AppSidebar/AppSidebarToggle";

const ProtectedRoute = () => {
  const SessionCookie = checkAuthenticatedUser();
  if (SessionCookie) {
    return <>
      <AppSidebarToggle />
      <AppSidebar />
      <Outlet />
    </>;
  }

  return <Navigate to={APP_URL.AUTH} replace />;
};

export default ProtectedRoute;

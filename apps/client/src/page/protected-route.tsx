import { APP_URL } from "@/constants/clientUrl.constants";
import { checkAuthenticatedUser } from "@/utils";
import { Navigate, Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import AppSidebarToggle from "@/components/AppSidebar/AppSidebarToggle";
import { useEffect } from "react";
import SocketSingleton from "@/types/socket.types.ts";

const socket = SocketSingleton.getInstance();

const ProtectedRoute = () => {
  const SessionCookie = checkAuthenticatedUser();

  useEffect(() => {
    if (!socket.connected && SessionCookie) {
      socket.connect();
    }
  }, [SessionCookie]);

  if (SessionCookie) {
    return (
      <>
        <AppSidebarToggle />
        <AppSidebar />
        <Outlet />
      </>
    );
  }

  return <Navigate to={APP_URL.AUTH} replace />;
};

export default ProtectedRoute;

import { APP_URL } from "@/constants/clientUrl.constants";
import { checkAuthenticatedUser } from "@/utils";
import { Navigate, Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import AppSidebarToggle from "@/components/AppSidebar/AppSidebarToggle";
import { useEffect } from "react";
import SocketSingleton from "@/utils/socket.ts";
import { useAppDispatch } from "@/hooks/useStore.ts";
import { INIT_SOCKET } from "@/store/slice/socketSlice.ts";

const socket = SocketSingleton.getInstance();

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const SessionCookie = checkAuthenticatedUser();

  useEffect(() => {
    if (!socket.connected && SessionCookie) {
      dispatch(INIT_SOCKET());
      socket.connect();
    }
  }, [SessionCookie, dispatch]);

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

import { APP_URL } from "@/constants/clientUrl.constants";
import { useAppSelector } from "@/hooks/store";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <>{children}</>;
  }
  return <Navigate to={APP_URL.AUTH} replace />;
};

export default ProtectedRoute;

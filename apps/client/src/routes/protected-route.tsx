import { APP_URL } from "@/constants/clientUrl.constants";
import Cookie from "js-cookie";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const SessionCookie = Cookie.get("valid_session");
  return SessionCookie ? (
    <>{children}</>
  ) : (
    <Navigate to={APP_URL.AUTH} replace />
  );
};

export default ProtectedRoute;

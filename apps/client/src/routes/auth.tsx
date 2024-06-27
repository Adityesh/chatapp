import { APP_URL } from "@/constants/clientUrl.constants";
import { useAppSelector } from "@/hooks/store";
import { Navigate } from "react-router-dom";

export default function AuthRoute() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to={APP_URL.BASE} replace />;
  }

  return <>Auth Route</>;
}

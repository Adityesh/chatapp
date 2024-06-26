import AuthComponent from "@/components/page/auth";
import { Outlet, useLocation } from "react-router-dom";

export default function Root() {
  const location = useLocation();

  const isAuthRoute = location.pathname === "/auth";
  return (
    <div className="flex h-screen text-white">
      <div className="flex-1">{isAuthRoute && <AuthComponent />}</div>
      <div className="grow-[3] shrink basis-0">
        <Outlet />
      </div>
    </div>
  );
}

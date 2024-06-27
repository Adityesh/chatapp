import AuthComponent from "@/components/page/auth";
import Sidebar from "@/components/page/sidebar";
import { useAppSelector } from "@/hooks/store";
import { Outlet } from "react-router-dom";

export default function Root() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  return (
    <div className="flex h-screen text-white">
      <div className="flex-1">
        {!isLoggedIn ? <AuthComponent /> : <Sidebar />}
      </div>
      <div className="grow-[3] shrink basis-0">
        <Outlet />
      </div>
    </div>
  );
}

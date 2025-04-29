import { APP_URL } from "@/constants/clientUrl.constants.ts";
import { useAppSelector } from "@/hooks/useStore.ts";
import { Outlet, useNavigate } from "react-router-dom";
import "./style.css";

export default function AuthRoute() {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) navigate(APP_URL.BASE);

  return (
    <div
      className={
        "background h-screen w-screen flex items-center justify-center"
      }
    >
      <div
        className={
          "w-[90%] h-3/4 overflow-auto md:h-fit md:w-1/3 card px-4 py-8"
        }
      >
        <Outlet />
      </div>
    </div>
  );
}

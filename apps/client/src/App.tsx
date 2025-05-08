import Cookie from "js-cookie";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useStore.ts";
import { SET_AUTH_STATE } from "./store/slice/authSlice";
import AppRoutes from "@/AppRoutes.tsx";
import { useIdleTimer } from "react-idle-timer";
import { UPDATE_USER_STATUS } from "@/store/slice/socketSlice.ts";

function App() {
  const SessionCookie = Cookie.get("valid_session");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      SET_AUTH_STATE({ key: "isLoggedIn", value: Boolean(SessionCookie) }),
    );
  }, [SessionCookie, dispatch]);

  useIdleTimer({
    onIdle: () => {
      if (!SessionCookie) return;
      dispatch(
        UPDATE_USER_STATUS({
          status: "away",
        }),
      );
    },
    onActive: () => {
      if (!SessionCookie) return;
      dispatch(
        UPDATE_USER_STATUS({
          status: "online",
        }),
      );
    },
    timeout: 3_600_000,
    throttle: 500,
  });

  return <AppRoutes />;
}

export default App;

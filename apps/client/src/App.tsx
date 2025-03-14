import Cookie from "js-cookie";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useStore.ts";
import { SET_AUTH_STATE } from "./store/slice/authSlice";
import { INIT_SOCKET } from "./store/slice/socketSlice";
import AppRoutes from '@/AppRoutes.tsx';

function App() {
  const SessionCookie = Cookie.get("valid_session");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      SET_AUTH_STATE({ key: "isLoggedIn", value: Boolean(SessionCookie) }),
    );
  }, [SessionCookie, dispatch]);

  useEffect(() => {
    dispatch(INIT_SOCKET());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;

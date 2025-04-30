import Cookie from "js-cookie";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks/useStore.ts";
import { SET_AUTH_STATE } from "./store/slice/authSlice";
import AppRoutes from "@/AppRoutes.tsx";

function App() {
  const SessionCookie = Cookie.get("valid_session");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      SET_AUTH_STATE({ key: "isLoggedIn", value: Boolean(SessionCookie) }),
    );
  }, [SessionCookie, dispatch]);


  return <AppRoutes />;
}

export default App;

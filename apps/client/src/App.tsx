import Cookie from "js-cookie";
import { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { APP_URL } from "./constants/clientUrl.constants";
import { useAppDispatch } from "./hooks/store";
import AuthRoute from "./routes/auth";
import Channel from "./routes/channel";
import ChatInit from "./routes/chatinit";
import Error from "./routes/error";
import ProtectedRoute from "./routes/protected-route";
import Root from "./routes/root";
import { SET_AUTH_STATE } from "./store/slice/authSlice";

const router = createBrowserRouter([
  {
    path: APP_URL.BASE,
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <div>Index element</div>
          </ProtectedRoute>
        ),
      },
      {
        path: APP_URL.CHAT,
        element: <Outlet />,
        children: [
          {
            path: APP_URL.CHAT_INIT,
            element: (
              <ProtectedRoute>
                <ChatInit />
              </ProtectedRoute>
            ),
          },
          {
            path: APP_URL.CHAT_CHANNEL,
            element: (
              <ProtectedRoute>
                <Channel />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: APP_URL.AUTH,
        element: <AuthRoute />,
      },
    ],
  },
]);

function App() {
  const SessionCookie = Cookie.get("valid_session");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      SET_AUTH_STATE({ key: "isLoggedIn", value: Boolean(SessionCookie) }),
    );
  }, [SessionCookie, dispatch]);

  return <RouterProvider router={router} />;
}

export default App;

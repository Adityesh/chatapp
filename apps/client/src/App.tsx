import Cookie from "js-cookie";
import { useEffect } from "react";
import { useAppDispatch } from "./store/store.ts";
import { SET_AUTH_STATE } from "./store/slice/authSlice";
import { INIT_SOCKET } from "./store/slice/socketSlice";
import AppRoutes from '@/AppRoutes.tsx';

// const router = createBrowserRouter([
//   {
//     path: APP_URL.BASE,
//     element: <Root />,
//     errorElement: <Error />,
//     children: [
//       {
//         index: true,
//         element: (
//           <ProtectedRoute>
//             <div>Index element</div>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: APP_URL.CHAT,
//         element: <Outlet />,
//         children: [
//           {
//             path: APP_URL.CHAT_INIT,
//             element: (
//               <ProtectedRoute>
//                 <ChatInit />
//               </ProtectedRoute>
//             ),
//           },
//           {
//             path: APP_URL.CHAT_CHANNEL,
//             element: (
//               <ProtectedRoute>
//                 <Channel />
//               </ProtectedRoute>
//             ),
//           },
//         ],
//       },
//       {
//         path: APP_URL.AUTH,
//         element: <AuthRoute />,
//       },
//     ],
//   },
// ]);

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

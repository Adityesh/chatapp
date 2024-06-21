import { useEffect } from "react";
import "./App.css";
import { useAppDispatch } from "./hooks/store";
import { INIT_SOCKET } from "./store/slice/socketSlice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Error from "./routes/error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <>Index element</>,
      },
      {
        path : "/contacts",
        element : <>Contacts Route</>
      },
    ],
  },
]);

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(INIT_SOCKET());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;

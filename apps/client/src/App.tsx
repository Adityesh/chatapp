import { useEffect } from "react";
import "./App.css";
import { useAppDispatch } from "./hooks/store";
import { INIT_SOCKET } from "./store/slice/socketSlice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Error from "./routes/error";
import { Button } from "./components/ui/button";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: (
          <div className="font-poppins bg-foreground text-text">
            Index element
            <Button variant="link">Primary</Button>

          </div>
        ),
      },
      {
        path: "/contacts",
        element: <>Contacts Route</>,
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

import { APP_URL } from "@/constants/clientUrl.constants.ts";

import ProtectedRoute from "@/page/protected-route.tsx";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import Index from "@/page";
import Error from "@/page/error";
import User from "@/page/user";

const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Settings = lazy(() => import("@/page/settings"));
const Chat = lazy(() => import("@/page/chat"));
const Auth = lazy(() => import("@/page/auth"));

export default function () {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
      }}
    >
      <div className={"h-screen w-screen relative"}>
        <SidebarProvider>
          <Routes>
            <Route
              path={APP_URL.AUTH}
              element={<Auth />}
              errorElement={<Error />}
            >
              <Route index element={<Login />} />
              <Route path={APP_URL.REGISTER} element={<Register />} />
            </Route>
            <Route element={<ProtectedRoute />} errorElement={<Error />}>
              <Route index element={<Index />} />
              <Route path={APP_URL.SETTINGS} element={<Settings />} />
              <Route path={APP_URL.USER}>
                <Route path=":id" element={<User />} />
              </Route>
              <Route path={APP_URL.CHAT}>
                <Route path=":id" element={<Chat />} />
              </Route>
            </Route>
            <Route path={"*"} element={<Error notFound />} />
          </Routes>
        </SidebarProvider>
      </div>
    </BrowserRouter>
  );
}

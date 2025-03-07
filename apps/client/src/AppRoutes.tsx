import { APP_URL } from "@/constants/clientUrl.constants.ts";

import ProtectedRoute from "@/page/protected-route.tsx";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppSidebar from "./components/AppSidebar";
import AppSidebarToggle from "./components/AppSidebar/AppSidebarToggle";
import { SidebarProvider } from "./components/ui/sidebar";

const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Settings = lazy(() => import("@/page/settings"));
const Chat = lazy(() => import("@/page/chat"));
const Auth = lazy(() => import("@/page/auth"));

export default function () {
  return (
    <div className={"h-screen w-screen relative"}>
      <SidebarProvider>
        <AppSidebarToggle />
        <BrowserRouter
          future={{
            v7_startTransition: true,
          }}
        >
          <AppSidebar />
          <Routes>
            <Route path={APP_URL.AUTH} element={<Auth />}>
              <Route index element={<Login />} />
              <Route path={APP_URL.REGISTER} element={<Register />} />
            </Route>
            <Route element={<ProtectedRoute />} >
              <Route index element={<div>Index element</div>} />
              <Route path={APP_URL.SETTINGS} element={<Settings />} />
              <Route path={APP_URL.CHAT} element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </div>
  );
}

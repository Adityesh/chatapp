import { useLocation } from "react-router-dom";
import { APP_URL } from "@/constants/clientUrl.constants.ts";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarHeader from "./AppSidebarHeader";

export default function AppSidebar() {
  const { pathname } = useLocation();
  if (pathname.includes(APP_URL.AUTH)) return null;

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
      <AppSidebarHeader />
      </SidebarFooter>
    </Sidebar>
  );
}

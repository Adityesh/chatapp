import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "@/components/AppSidebar/AppSidebarFooter";
import AppSidebarContent from "@/components/AppSidebar/AppSidebarContent";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarContent />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}

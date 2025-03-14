import { useAppSelector } from "@/hooks/useStore.ts";
import { useMemo } from "react";
import Channels from "@/components/AppSidebar/AppSidebarContent/Tabs/Channels.tsx";
import Users from "@/components/AppSidebar/AppSidebarContent/Tabs/Users.tsx";
import Notifications from "@/components/AppSidebar/AppSidebarContent/Tabs/Notifications.tsx";
import Chats from "@/components/AppSidebar/AppSidebarContent/Tabs/Chats.tsx";

export default function () {
  const { tab } = useAppSelector((state) => state.navigation);

  const renderTab = useMemo(() => {
    switch (tab) {
      case "CHANNELS":
        return <Channels />;
      case "CHATS":
        return <Chats />;
      case "NOTIFICATIONS":
        return <Notifications />;
      case "USERS":
        return <Users />;
    }
  }, [tab]);

  return <>{renderTab}</>;
}

import { useAppSelector } from "@/hooks/store";
import { useMemo } from "react";
import Navbar from "./navbar";
import ChannelsTab from "./tabs/channelstab";
import ChatTab from "./tabs/chattab";
import ConnectionsTab from "./tabs/connectionstab";
import SearchTab from "./tabs/searchtab";

const Sidebar = () => {
  const tab = useAppSelector((state) => state.navigation.tab);

  const renderTab = useMemo(() => {
    switch (tab) {
      case "chat":
        return <ChatTab />;
      case "connections":
        return <ConnectionsTab />;
      case "channels":
        return <ChannelsTab />;
      case "search":
        return <SearchTab />;
    }
  }, [tab]);

  return (
    <div className="h-full flex items-center justify-between">
      <Navbar />
      <div className="w-full h-full">{renderTab}</div>
    </div>
  );
};

export default Sidebar;

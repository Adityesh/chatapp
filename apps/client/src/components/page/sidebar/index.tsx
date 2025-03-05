import { useAppSelector } from "@/store/store.ts";
import { useMemo } from "react";
import Navbar from "./navbar";
import ChannelsTab from "./tabs/channels";
import ChatTab from "./tabs/chat";
import ConnectionsTab from "./tabs/connections";
import SearchTab from "./tabs/search";

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
      {renderTab}
    </div>
  );
};

export default Sidebar;

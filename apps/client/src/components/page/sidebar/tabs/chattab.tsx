import ChannelTabItem from "@/components/common/ChannelTabItem";
import { useGetChannelsQuery } from "@/store/slice/apiSlice";
import { useState } from "react";
import ChannelHeader from "../../channel/channelheader";

const ChatTab = () => {
  const [page, setPage] = useState(1);
  const { data } = useGetChannelsQuery({
    limit: 10,
    page,
  });

  if (!data || !data.data) return;

  return (
    <div className="w-full h-full bg-foreground">
      {data.data.items.map((channel, index) => {
        return <ChannelTabItem {...channel} key={index} index={index} />;
      })}
    </div>
  );
};

export default ChatTab;

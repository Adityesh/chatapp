import Circularloader from "@/components/ui/circularloader";
import {
  useGetLoggedInUserQuery,
  useGetMessagesQuery,
} from "@/store/slice/apiSlice";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ChannelMessageItem from "./channelmessageitem";

const ChannelMessage: FC<{ channelId: number }> = ({ channelId }) => {
  const loggedInUser = useGetLoggedInUserQuery(null);
  const [page, setPage] = useState(1);
  const { data: messages } = useGetMessagesQuery(
    {
      limit: 15,
      page,
      channelId: Number(channelId),
    },
    {
      skip: !channelId || isNaN(Number(channelId)),
    }
  );

  if (!messages || !messages.data || !loggedInUser || !loggedInUser.data)
    return <></>;

  return (
    <div
      id="scrollableDiv"
      className="h-auto overflow-auto flex flex-col-reverse w-full"
    >
      <div id="message-bottom"></div>
      <InfiniteScroll
        dataLength={messages.data.items.length}
        next={() => setPage(page + 1)}
        className="w-full flex px-2 mt-auto mb-0 flex-col-reverse"
        inverse={true}
        hasMore={
          messages.data.meta.currentPage !== messages.data.meta.totalPages
        }
        loader={<Circularloader className="mx-auto" />}
        scrollableTarget="scrollableDiv"
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>This is the beginning of your conversation.</b>
          </p>
        }
      >
        {messages.data.items.map((message, index) => (
          <ChannelMessageItem
            message={message}
            isSenderLoggedIn={message.sender.id === loggedInUser.data!.data?.id}
            key={index}
            loggedInUserId={loggedInUser.data!.data?.id!}
            channelId={Number(channelId)}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ChannelMessage;

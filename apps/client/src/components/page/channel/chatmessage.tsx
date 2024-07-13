import ChatPageBox from "@/components/common/ChatPageBox";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  useGetLoggedInUserQuery,
  useGetMessagesQuery,
} from "@/store/slice/apiSlice";
import { FC, useState } from "react";

const ChatMessage: FC<{ channelId: number }> = ({ channelId }) => {
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
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {messages.data.items.map((message, index) => (
          <ChatPageBox
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

export default ChatMessage;

import ChatPageBox from "@/components/common/ChatPageBox";
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
    },
  );

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop === 0) {
      if (!messages || !messages.data) return;
      const {
        meta: { totalPages },
      } = messages.data;
      if (page === totalPages) {
        return;
      }
      setPage(page + 1);
    }
  };

  if (!messages || !messages.data) return <></>;
  return (
    <div
      className="w-full flex flex-col px-2 mt-auto mb-0 overflow-auto"
      onScroll={handleScroll}
    >
      {messages.data.items.map((message, index) => {
        return (
          <ChatPageBox
            message={message}
            isSenderLoggedIn={message.sender.id === loggedInUser.data!.data?.id}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default ChatMessage;

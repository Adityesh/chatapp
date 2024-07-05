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
      limit: 5,
      page,
      channelId: Number(channelId),
    },
    {
      skip: !channelId || isNaN(Number(channelId)),
    }
  );

  const handleNextPage = () => {
    if (!messages || !messages.data) return;
    const {
      meta: { totalPages },
    } = messages.data;
    if (page === totalPages) {
      return;
    }
    setPage(page + 1);
  };

  if (!messages || !messages.data) return <></>;
  return (
    <div className="w-full flex flex-col">
      {messages.data.items.map((message, index) => {
        const isSenderLoggedIn =
          message.senderId.id === loggedInUser.data!.data?.id;
        return (
          <div
            key={message.createdAt + " " + index}
            className={`${isSenderLoggedIn && "mr-0 ml-auto text-right"} mb-2`}
          >
            <p className="text-primary">{message.senderId.userName}</p>
            <p>{message.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessage;

import ChatInput from "@/components/page/channel/chatinput";
import { SocketRoom } from "@/enums/socket.enum";
import SocketFactory from "@/store/SocketFactory";
import {
  useGetChatDetailsQuery,
  useGetMessagesQuery,
} from "@/store/slice/apiSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const socket = SocketFactory.getInstance().socket;

const Channel = () => {
  const { channelId } = useParams();
  const [page, setPage] = useState(1);
  useGetChatDetailsQuery({
    channelId: Number(channelId),
  });
  const { data: messages } = useGetMessagesQuery(
    {
      limit: 1,
      page,
      channelId: channelId!,
    },
    {
      skip: !channelId || isNaN(Number(channelId)),
    },
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

  useEffect(() => {
    socket.emit(SocketRoom.JOIN_ROOM, channelId);

    return () => {
      socket.emit(SocketRoom.LEAVE_ROOM, channelId);
    };
  }, [channelId]);

  if (!channelId || isNaN(Number(channelId)) || !messages || !messages.data)
    return <></>;
  return (
    <div className="h-full w-full flex flex-col items-center justify-start">
      <p>Chat Channel Id : {channelId} </p>
      <div>
        {messages.data.items.map((message) => {
          return <span key={message.id}>{message.content}</span>;
        })}
      </div>
      <button className="bg-primary" onClick={handleNextPage}>
        Next Page
      </button>
      <ChatInput channelId={Number(channelId)} />
    </div>
  );
};

export default Channel;

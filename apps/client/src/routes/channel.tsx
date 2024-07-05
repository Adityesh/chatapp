import ChatInput from "@/components/page/channel/chatinput";
import ChatMessage from "@/components/page/channel/chatmessage";
import { useAppDispatch } from "@/hooks/store";
import {
  useGetChatDetailsQuery
} from "@/store/slice/apiSlice";
import { JOIN_CHANNEL, LEAVE_CHANNEL } from "@/store/slice/socketSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Channel = () => {
  const dispatch = useAppDispatch();
  const { channelId } = useParams();
  useGetChatDetailsQuery({
    channelId: Number(channelId),
  });

  useEffect(() => {
    if (channelId) {
      dispatch(JOIN_CHANNEL({ id: channelId }));

      return () => {
        dispatch(LEAVE_CHANNEL({ id: channelId }));
      };
    }
  }, [channelId]);

  if (!channelId || isNaN(Number(channelId))) return <></>;
  return (
    <div className="h-full w-full flex flex-col items-center justify-start">
      <ChatMessage channelId={Number(channelId)} />
      <ChatInput channelId={Number(channelId)} />
    </div>
  );
};

export default Channel;

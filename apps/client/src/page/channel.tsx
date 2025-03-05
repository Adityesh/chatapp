import ChannelHeader from "@/components/page/channel/channelheader";
import ChatInput from "@/components/page/channel/channelinput";
import ChatMessage from "@/components/page/channel/channelmessage";
import { useAppDispatch } from "@/store/store.ts";
import {
  useGetChatDetailsQuery,
  useGetLoggedInUserQuery,
} from "@/store/slice/apiSlice";
import {
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  USER_TYPING,
} from "@/store/slice/socketSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useTitle from '@/hooks/useTitle.ts';

const Channel = () => {

  useTitle("Channel");

  const dispatch = useAppDispatch();
  const { channelId } = useParams();
  const { data } = useGetChatDetailsQuery({
    channelId: Number(channelId),
  });
  const { data: loggedInUser } = useGetLoggedInUserQuery(null);

  useEffect(() => {
    if (channelId) {
      dispatch(JOIN_CHANNEL({ id: channelId }));

      return () => {
        if (!loggedInUser || !loggedInUser.data) return;
        dispatch(
          USER_TYPING({
            channelId: channelId.toString(),
            fullName: loggedInUser.data.fullName,
            typing: false,
          }),
        );
        dispatch(LEAVE_CHANNEL({ id: channelId }));
      };
    }
  }, [channelId, loggedInUser]);

  if (!data || !data.data || !channelId || isNaN(Number(channelId)))
    return <></>;
  return (
    <div className="h-full w-full flex flex-col items-center justify-between">
      <ChannelHeader chatDetails={data.data} />
      <ChatMessage channelId={Number(channelId)} />
      <ChatInput channelId={Number(channelId)} />
    </div>
  );
};

export default Channel;

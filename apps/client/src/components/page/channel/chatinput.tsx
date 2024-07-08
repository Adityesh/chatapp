import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Typing from "@/components/ui/typing";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  useGetLoggedInUserQuery,
  useSendMessageMutation,
} from "@/store/slice/apiSlice";
import { SEND_MESSAGE, USER_TYPING } from "@/store/slice/socketSlice";
import { getUsersTyping } from "@/utils";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";

const ChatInput: React.FC<{ channelId: number }> = ({ channelId }) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");
  const [sendMessage] = useSendMessageMutation();
  const { data: loggedInUser } = useGetLoggedInUserQuery(null);
  const usersTyping = useAppSelector((state) => state.socket.usersTyping);
  const currentUsersTyping = usersTyping[channelId] || [];

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loggedInUser || !loggedInUser.data || content.length === 0) return;
    const response = await sendMessage({
      channelId,
      content,
      senderId: loggedInUser.data.id,
    }).unwrap();
    if (response.data) {
      setContent("");
      dispatch(SEND_MESSAGE({ ...response.data, channelId }));
    }
  };

  const handleFocus = () => {
    if (!loggedInUser || !loggedInUser.data) return;
    dispatch(
      USER_TYPING({
        typing: true,
        fullName: loggedInUser?.data?.fullName,
        channelId: channelId.toString(),
      }),
    );
  };

  const handleBlur = () => {
    if (!loggedInUser || !loggedInUser.data) return;
    dispatch(
      USER_TYPING({
        typing: false,
        fullName: loggedInUser?.data.fullName,
        channelId: channelId.toString(),
      }),
    );
  };

  return (
    <>
      {currentUsersTyping.length > 0 && (
        <div className="w-full flex items-center justify-start font-satoshi mt-2">
          <p className="pb-4 mx-2">{getUsersTyping(currentUsersTyping)}</p>
          <Typing />
        </div>
      )}
      <form className="w-full flex" onSubmit={handleSendMessage}>
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <Button
          type="submit"
          className="text-primary my-auto"
          variant={"ghost"}
        >
          <SendHorizonal />
        </Button>
      </form>
    </>
  );
};

export default ChatInput;

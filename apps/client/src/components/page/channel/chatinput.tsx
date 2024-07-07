import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  useGetLoggedInUserQuery,
  useSendMessageMutation,
} from "@/store/slice/apiSlice";
import { SEND_MESSAGE, USER_TYPING } from "@/store/slice/socketSlice";
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
    try {
      const response = await sendMessage({
        channelId,
        content,
        senderId: loggedInUser.data.id,
      }).unwrap();
      if (response.data) {
        setContent("");
        dispatch(SEND_MESSAGE({ ...response.data, channelId }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!loggedInUser || !loggedInUser.data) return;
    dispatch(
      USER_TYPING({
        typing: true,
        fullName: loggedInUser?.data?.fullName,
        channelId: channelId.toString(),
      })
    );
  };

  const handleBlur = () => {
    if (!loggedInUser || !loggedInUser.data) return;
    dispatch(
      USER_TYPING({
        typing: false,
        fullName: loggedInUser?.data.fullName,
        channelId: channelId.toString(),
      })
    );
  };

  return (
    <form className="w-full flex" onSubmit={handleSendMessage}>
      {currentUsersTyping.length > 0 &&
        currentUsersTyping.join(",") + " are typing"}
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Button type="submit" className="text-primary my-auto" variant={"ghost"}>
        <SendHorizonal />
      </Button>
    </form>
  );
};

export default ChatInput;

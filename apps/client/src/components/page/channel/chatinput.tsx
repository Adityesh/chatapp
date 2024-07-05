import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/store";
import {
  useGetLoggedInUserQuery,
  useSendMessageMutation,
} from "@/store/slice/apiSlice";
import { SEND_MESSAGE } from "@/store/slice/socketSlice";
import { useState } from "react";

const ChatInput: React.FC<{ channelId: number }> = ({ channelId }) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");
  const [sendMessage] = useSendMessageMutation();
  const { data: loggedInUser } = useGetLoggedInUserQuery(null);

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
        dispatch(SEND_MESSAGE({ ...response.data, channelId }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="mt-auto w-full" onSubmit={handleSendMessage}>
      <Input value={content} onChange={(e) => setContent(e.target.value)} />
      <Button type="submit">Send Message</Button>
    </form>
  );
};

export default ChatInput;

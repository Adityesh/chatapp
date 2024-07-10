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
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { EmojiMartPickerOnClick } from "@repo/shared";
import { useState } from "react";
import Icon from "@/components/ui/icon";

const ChatInput: React.FC<{ channelId: number }> = ({ channelId }) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
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

  const handleEmojiClick = (emoji: EmojiMartPickerOnClick) => {
    setContent(content + emoji.native);
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
        <div className="w-full relative">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="pr-10"
          />
          {emojiPicker && (
            <div className="absolute bottom-10 right-0">
              <Picker
                data={data}
                perLine={6}
                onEmojiSelect={handleEmojiClick}
                onClickOutside={() => setEmojiPicker(false)}
              />
            </div>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setEmojiPicker(!emojiPicker);
            }}
          >
            <Icon
              name="smile-plus"
              className="text-primary cursor-pointer absolute right-2 top-2 bottom-0"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="text-primary my-auto"
          variant={"ghost"}
        >
          <Icon name="send-horizontal" />
        </Button>
      </form>
    </>
  );
};

export default ChatInput;

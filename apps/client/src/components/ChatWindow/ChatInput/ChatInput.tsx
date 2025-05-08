import {
  useCreateMessageMutation,
  useEditMessageMutation,
} from "@/store/api/messageApi.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.ts";
import { Input } from "@/components/ui/input.tsx";
import { RESET_DRAFT, UPDATE_DRAFT } from "@/store/slice/chatSlice.ts";
import { FormEvent, useEffect, useRef } from "react";
import ActionView from "@/components/ChatWindow/ChatInput/ActionView";
import { X } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { BROADCAST_USER_TYPING } from "@/store/slice/socketSlice.ts";
import { useGetChannelByIdQuery } from "@/store/api/channelApi.ts";
import { APP_URL } from "@/constants/clientUrl.constants.ts";
import { useLocation } from "react-router-dom";
import { getUsersTyping } from "@/utils";

export type ChatInputProps = {
  channelId: number;
};

export default function ChatInput({ channelId }: ChatInputProps) {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const usersTyping = useAppSelector((state) => state.socket.usersTyping);
  const drafts = useAppSelector((state) => state.chat.drafts);
  const channelDraft = drafts[channelId];
  const content = !channelDraft ? "" : channelDraft.content;
  const [debouncedContent] = useDebounceValue(content, 500);
  const [createMessage] = useCreateMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const { data: channel } = useGetChannelByIdQuery(
    {
      id: Number(channelId),
    },
    {
      skip: !pathname.includes(APP_URL.CHAT),
    },
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleResetAction = () => dispatch(RESET_DRAFT({ channelId }));

  const handleMessageActions = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!channelDraft || content.length === 0) return;

    if (channelDraft.action === "EDIT" && channelDraft.messageId) {
      const result = await editMessage({
        content,
        messageId: channelDraft.messageId,
      }).unwrap();

      if (!result.error) {
        dispatch(RESET_DRAFT({ channelId }));
      }
      return;
    }

    const result = await createMessage({
      channelId,
      content,
      replyTo:
        channelDraft.action === "REPLY" ? channelDraft.messageId : undefined,
    }).unwrap();

    if (!result.error) {
      dispatch(RESET_DRAFT({ channelId }));
    }
  };

  const handleChannelDraft = (content: string) => {
    dispatch(UPDATE_DRAFT({ channelId, content }));
  };

  const displayUsersTyping = !channel ? "" : getUsersTyping(usersTyping, channel.data, channelId);

  useEffect(() => {
    if (inputRef.current && document.activeElement) {
      if (content && debouncedContent === content) {
        dispatch(BROADCAST_USER_TYPING({ channelId, type: "start" }));
      } else if (!content) {
        dispatch(BROADCAST_USER_TYPING({ channelId, type: "stop" }));
      }
    } else {
      dispatch(BROADCAST_USER_TYPING({ channelId, type: "stop" }));
    }
  }, [debouncedContent, content, channelId, dispatch]);

  return (
    <form onSubmit={handleMessageActions} className={"relative"}>
      {displayUsersTyping.length > 0 && <span>{displayUsersTyping}</span>}
      <ActionView channelId={channelId} />
      <Input
        type={"text"}
        onChange={(e) => handleChannelDraft(e.target.value)}
        value={!channelDraft ? "" : content}
        placeholder={"Send Message"}
        ref={inputRef}
      />
      {channelDraft?.action && (
        <X
          onClick={handleResetAction}
          className={`absolute ${channelDraft?.action === "REPLY" ? "top-17" : "top-8"} right-1 cursor-pointer`}
        />
      )}
    </form>
  );
}

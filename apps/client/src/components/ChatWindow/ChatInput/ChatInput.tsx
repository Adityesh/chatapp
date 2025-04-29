import {
  useCreateMessageMutation,
  useEditMessageMutation,
} from "@/store/api/messageApi.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.ts";
import { Input } from "@/components/ui/input.tsx";
import { RESET_DRAFT, UPDATE_DRAFT } from "@/store/slice/chatSlice.ts";
import { FormEvent } from "react";
import ActionView from "@/components/ChatWindow/ChatInput/ActionView";
import { X } from "lucide-react";

export type ChatInputProps = {
  channelId: number;
};

export default function ChatInput({ channelId }: ChatInputProps) {
  const dispatch = useAppDispatch();
  const drafts = useAppSelector((state) => state.chat.drafts);
  const channelDraft = drafts[channelId];
  const content = !channelDraft ? "" : channelDraft.content;
  const [createMessage] = useCreateMessageMutation();
  const [editMessage] = useEditMessageMutation();

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

  return (
    <form onSubmit={handleMessageActions} className={"relative"}>
      <ActionView channelId={channelId} />
      <Input
        type={"text"}
        onChange={(e) => handleChannelDraft(e.target.value)}
        value={!channelDraft ? "" : content}
        placeholder={"Send Message"}
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

import {
  useCreateMessageMutation,
  useEditMessageMutation,
} from "@/store/api/messageApi.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.ts";
import { Input } from "@/components/ui/input.tsx";
import { RESET_DRAFT, UPDATE_DRAFT } from "@/store/slice/chatSlice.ts";
import { FormEvent, memo, useEffect, useRef, useState } from "react";
import ActionView from "@/components/ChatWindow/ChatInput/ActionView";
import { Laugh, Paperclip, X } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { BROADCAST_USER_TYPING } from "@/store/slice/socketSlice.ts";
import { useGetChannelByIdQuery } from "@/store/api/channelApi.ts";
import { APP_URL } from "@/constants/clientUrl.constants.ts";
import { useLocation } from "react-router-dom";
import { getUsersTyping } from "@/utils";
import WithToolTip from "@/components/common/WithTooltip";
import EmojiInput from "@/components/ChatWindow/ChatInput/EmojiInput/EmojiInput.tsx";
import { useFileInput } from "@/hooks/useFileInput.ts";

export type ChatInputProps = {
  channelId: number;
};

const ChatInput = ({ channelId }: ChatInputProps) => {
  const { inputProps, showFilePreview, deleteFile, files } = useFileInput({
    multiple: true,
    accept: "image/*",
  });
  const [emojiOpen, setEmojiOpen] = useState(false);
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      files,
    }).unwrap();

    if (!result.error) {
      dispatch(RESET_DRAFT({ channelId }));
    }
  };

  const handleChannelDraft = (content: string) => {
    dispatch(UPDATE_DRAFT({ channelId, content }));
  };

  const displayUsersTyping = !channel
    ? ""
    : getUsersTyping(usersTyping, channel.data, channelId);

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

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleMessageActions} className={"relative"}>
      <input {...inputProps} ref={fileInputRef} className={"hidden"} key={new Date().toISOString()}/>
      {displayUsersTyping.length > 0 && <span>{displayUsersTyping}</span>}
      <ActionView channelId={channelId} files={showFilePreview()} deleteFile={deleteFile}/>
      <div className={"flex items-center relative"}>
        <WithToolTip tooltipText={"Attachment"}>
          <Paperclip
            className={`cursor-pointer mr-2`}
            onClick={handleFileUpload}
          />
        </WithToolTip>
        <WithToolTip tooltipText={"Emoticon"}>
          <EmojiInput
            open={emojiOpen}
            handleClose={() => setEmojiOpen(false)}
            closeOnSelect
            onOpenChange={setEmojiOpen}
            onEmojiSelect={({ emoji }) => {
              handleChannelDraft((!content ? "" : content) + emoji);
              inputRef?.current?.focus();
            }}
          >
            <Laugh
              className={`cursor-pointer mr-2`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEmojiOpen(true);
              }}
            />
          </EmojiInput>
        </WithToolTip>
        <Input
          type={"text"}
          onChange={(e) => handleChannelDraft(e.target.value)}
          value={!channelDraft ? "" : content}
          placeholder={"Send Message"}
          ref={inputRef}
        />
        {channelDraft?.action && (
          <WithToolTip tooltipText={"Cancel"}>
            <X onClick={handleResetAction} className={`cursor-pointer ml-2`} />
          </WithToolTip>
        )}
      </div>
    </form>
  );
};

export default memo(ChatInput);

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clipboard, MailX, MessageSquareReply, Pencil } from "lucide-react";
import { memo, PropsWithChildren } from "react";
import { BaseMessageDto, ClassProperties } from "shared";
import { useGetCurrentUserQuery } from "@/store/api/userApi.ts";
import { useDeleteMessageMutation } from "@/store/api/messageApi.ts";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useStore.ts";
import { UPDATE_DRAFT } from "@/store/slice/chatSlice.ts";
import { DraftAction } from "@/types/chatSlice.types.ts";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";

export type ChatMessageMenuProps = {
  message: ClassProperties<typeof BaseMessageDto>;
};

const ChatMessageMenu = ({
  children,
  message,
}: PropsWithChildren<ChatMessageMenuProps>) => {
  const [, copy] = useCopyToClipboard();
  const dispatch = useAppDispatch();
  const params = useParams();
  const channelId = params["id"];
  const { data: currentUser } = useGetCurrentUserQuery();
  const [deleteMessage] = useDeleteMessageMutation();

  const isCurrentUserSender = currentUser?.data?.id === message?.sender?.id;

  const handleDeleteMessage = async () => {
    if (!channelId) return;
    await deleteMessage({
      channelId: Number(channelId),
      messageId: message.id,
    });
  };

  const handleMessageAction = (action: DraftAction) => {
    dispatch(
      UPDATE_DRAFT({
        messageId: message.id,
        channelId: Number(channelId),
        content: action === "EDIT" ? message.content : undefined,
        action,
      }),
    );
  };

  const handleCopyToClipboard = async () => {
    try {
      const isSuccess = await copy(message.content);
      if (isSuccess) toast.success("Message copied to clipboard!");
    } catch {
      toast.error("Failed to copy message");
    }
  };

  if (!currentUser || !currentUser.data || !channelId) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={"cursor-pointer"}
            onClick={() => handleMessageAction("REPLY")}
          >
            <MessageSquareReply />
            <span>Reply</span>
          </DropdownMenuItem>
          {isCurrentUserSender && (
            <>
              <DropdownMenuItem
                className={"cursor-pointer"}
                onClick={() => handleMessageAction("EDIT")}
              >
                <Pencil />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"cursor-pointer"}
                onClick={handleDeleteMessage}
              >
                <MailX />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            className={"cursor-pointer"}
            onClick={handleCopyToClipboard}
          >
            <Clipboard />
            <span>Copy</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(ChatMessageMenu);

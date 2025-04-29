import { BaseMessageDto, BaseUserDto, ClassProperties } from "shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { getNameInitials, getRandomColor } from "@/utils";
import { FC, memo, useMemo } from "react";
import dayjs from "dayjs";
import { MESSAGE_TIME_FORMAT } from "@/constants/common.constants.ts";
import ChatMessageMenu from "@/components/ChatWindow/ChatMessageMenu";
import { EllipsisVertical } from "lucide-react";

export type ChatMessageProps = {
  message: ClassProperties<typeof BaseMessageDto>;
  currentUser: ClassProperties<typeof BaseUserDto>;
};

const MessageItem: FC<ChatMessageProps> = ({ message, currentUser }) => {
  const { content, sender, updatedAt, isEdited, replyTo } = message;
  const isCurrentUserSender = sender.id === currentUser.id;
  const { fullName, avatarUrl, userName } = sender;
  const nameInitials = getNameInitials(fullName);
  const avatarFallbackColor = useMemo(() => getRandomColor(), []);

  return (
    <div className={"w-full flex items-center group"}>
      <div
        className={`flex ${isCurrentUserSender ? "flex-row-reverse ml-auto" : "mr-auto"}`}
      >
        <Avatar className={`h-8 w-8`}>
          <AvatarImage src={avatarUrl || undefined} alt={`@${userName}`} />
          <AvatarFallback
            className={"text-white"}
            style={{ background: avatarFallbackColor }}
          >
            {nameInitials}
          </AvatarFallback>
        </Avatar>
        <div
          className={`flex items-center ${isCurrentUserSender ? "" : "flex-row-reverse"}`}
        >
          <ChatMessageMenu message={message}>
            <EllipsisVertical
              className={"mt-2 opacity-0 group-hover:opacity-100"}
            />
          </ChatMessageMenu>
          <div
            className={`mt-2 rounded-lg pt-1 ${isCurrentUserSender ? "rounded-tr-none mr-2 mt-3 bg-gray-500" : "rounded-tl-none ml-2 bg-primary"}`}
          >
            {!isCurrentUserSender && (
              <span className={"text-left font-poppins-bold text-xs"}>
                @{userName}
              </span>
            )}
            {replyTo && (
              <div
                className={`bg-gray-400 mx-1 rounded-lg ${isCurrentUserSender ? "border-l-primary border-l-4" : "border-r-grey-500 border-r-4"} flex-col items-start justify-start`}
              >
                <span className={"font-poppins-bold text-xs"}>
                  @{replyTo?.sender?.userName}
                </span>
                <div className={"mt-1 font-satoshi px-2"}>
                  {replyTo.content}
                </div>
              </div>
            )}
            <div className={"mt-1 font-satoshi px-2"}>{content}</div>
            <span
              className={`text-xs ${isCurrentUserSender ? "text-left ml-0.5" : "float-right mr-0.5"}`}
            >
              {dayjs(updatedAt).format(MESSAGE_TIME_FORMAT)}{" "}
              {isEdited && "(edited)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MessageItem);

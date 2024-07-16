import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MESSAGE_PAST_FORMAT,
  MESSAGE_TODAY_FORMAT,
} from "@/constants/common.constants";
import { useAppDispatch } from "@/hooks/store";
import { useIsVisible } from "@/hooks/useIsVisible";
import { MARK_MESSAGE_AS_READ } from "@/store/slice/socketSlice";
import { GetMessageItem } from "@repo/shared";
import dayjs from "dayjs";
import { FC, useEffect, useRef } from "react";

const ChannelMessageItem: FC<{
  message: GetMessageItem;
  isSenderLoggedIn: boolean;
  loggedInUserId: number;
  channelId: number;
}> = ({ message, isSenderLoggedIn, loggedInUserId, channelId }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref);

  const unreadStatus = message.messageStatus.find(
    (ms) => ms.user.id === loggedInUserId && ms.readAt === null
  );
  const isMessageSameDay = dayjs(message.createdAt).isSame(dayjs());
  const messageSentDate = dayjs(message.createdAt).format(
    isMessageSameDay ? MESSAGE_TODAY_FORMAT : MESSAGE_PAST_FORMAT
  );

  useEffect(() => {
    if (isVisible && unreadStatus) {
      dispatch(
        MARK_MESSAGE_AS_READ({
          messageStatusId: unreadStatus.id,
          channelId,
          messageId: message.id,
        })
      );
    }
  }, [isVisible, unreadStatus?.id, channelId, message.id]);

  return (
    <div>
      <div className="flex flex-row items-center justify-start font-satoshi">
        {!isSenderLoggedIn && (
          <Avatar className="scale-75 rounded-full -translate-x-1">
            <AvatarImage
              src={message.sender.avatarUrl || ""}
              alt={"channel avatar"}
            />
            <AvatarFallback>{message.sender.fullName}</AvatarFallback>
          </Avatar>
        )}
        <p
          className={`${isSenderLoggedIn ? "ml-auto mr-0" : "hover:cursor-pointer hover:text-primary"} text-xs`}
        >
          {!isSenderLoggedIn && (
            <>{message.sender.fullName.split(" ")[0]} &#183;</>
          )}{" "}
          {messageSentDate}
        </p>
      </div>
      <div className={``}>
        {message.attachments.map((file, index) => {
          return (
            <img
              className={`${isSenderLoggedIn ? "mr-0 ml-auto" : ""} rounded-sm mb-4"`}
              loading="lazy"
              key={index}
              src={file.url}
              width={200}
              alt="file-message"
            />
          );
        })}
      </div>
      <div
        ref={ref}
        key={message.id}
        className={`${isSenderLoggedIn ? "mr-0 ml-auto text-right rounded-xl bg-primary rounded-tr-none" : "rounded-xl rounded-tl-none bg-slate-500 ml-0 mr-auto"} mb-4 px-4 py-2 w-fit`}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default ChannelMessageItem;

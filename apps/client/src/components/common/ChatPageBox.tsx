import { useAppDispatch } from "@/hooks/store";
import { useIsVisible } from "@/hooks/useIsVisible";
import { MARK_MESSAGE_AS_READ } from "@/store/slice/socketSlice";
import { GetMessageItem } from "@repo/shared";
import { FC, useEffect, useRef } from "react";

const ChatPageBox: FC<{
  message: GetMessageItem;
  isSenderLoggedIn: boolean;
  loggedInUserId: number;
  channelId: number;
}> = ({ message, isSenderLoggedIn, loggedInUserId, channelId }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref);

  const unreadStatus = message.messageStatus.find(
    (ms) => ms.user.id === loggedInUserId && ms.readAt === null,
  );

  useEffect(() => {
    if (isVisible && unreadStatus) {
      dispatch(
        MARK_MESSAGE_AS_READ({
          messageStatusId: unreadStatus.id,
          channelId,
          messageId: message.id,
        }),
      );
    }
  }, [isVisible, unreadStatus?.id, channelId, message.id]);

  return (
    <div
      ref={ref}
      key={message.id}
      className={`${isSenderLoggedIn ? "mr-0 ml-auto text-right rounded-xl bg-primary rounded-tr-none" : "rounded-xl rounded-tl-none bg-slate-500 ml-0 mr-auto"} mb-2 px-4 py-2`}
    >
      <p>{message.content}</p>
    </div>
  );
};

export default ChatPageBox;

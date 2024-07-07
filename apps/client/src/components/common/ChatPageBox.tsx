import { GetMessageItem } from "@repo/shared";
import { FC } from "react";

const ChatPageBox: FC<{
  message: GetMessageItem;
  isSenderLoggedIn: boolean;
}> = ({ message, isSenderLoggedIn }) => {
  return (
    <div
      key={message.id}
      className={`${isSenderLoggedIn ? "mr-0 ml-auto text-right rounded-xl bg-primary rounded-tr-none" : "rounded-xl rounded-tl-none bg-slate-500 ml-0 mr-auto"} mb-2 px-4 py-2`}
    >
      <p>{message.content}</p>
    </div>
  );
};

export default ChatPageBox;

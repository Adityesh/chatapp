import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { FC } from "react";
import {Separator} from "@/components/ui/separator.tsx";

type ChatItemRowProps = {
  status?: "online" | "offline" | "away" | "invisible";
};

function getColor(status: ChatItemRowProps["status"]) {
  switch (status) {
    case "online":
      return "border-green-400";
    case "offline":
      return "border-red-400";
    case "away":
      return "border-yellow-400";
    case "invisible":
      return "border-grey-400";
  }
}

const ChatItemRow: FC<ChatItemRowProps> = ({ status }) => {
  return (
    <>
      <div
          className={
            " w-full hover:bg-sidebar-foreground py-4 px-4 md:px-6 cursor-pointer rounded-sm flex items-center justify-between"
          }
      >
        <Avatar className={`h-10 w-10 border-4 ${getColor(status)}`}>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className={"ml-2 grow truncate"}>
          <div className={"flex items-center justify-between"}>
            <p className={"text-white font-satoshi"}>Adityesh Mishra</p>
            <span className={"text-white font-poppins-thin text-xs"}>03/01/2025</span>
          </div>
          <p className={"text-white font-poppins text-xs md:text-sm text-nowrap"}>Sounds perfect. How about..................sdfsdfsdfsdfsdfsdfsdfsdfsdfsdf</p>
        </div>
      </div>

      <Separator />

    </>
  );
};

export default ChatItemRow;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNameInitials } from "@/utils";
import { GetChatDetailsResult } from "@repo/shared";
import { FC } from "react";

const ChannelHeader: FC<{ chatDetails: GetChatDetailsResult }> = ({
  chatDetails: { topic, users, isGroup },
}) => {
  const channelName = isGroup ? topic : users[0].user.fullName;

  return (
    <div className={"w-full bg-foreground mb-8 p-4"}>
      <div className="flex flex-row items-center justify-start">
        <Avatar>
          <AvatarImage
            src={users[0].user.fullName || topic!.charAt(0)}
            alt={"channel avatar"}
          />
          <AvatarFallback>
            {!isGroup
              ? getNameInitials(users[0].user.fullName)
              : topic!.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="ml-4">{channelName}</span>
      </div>
    </div>
  );
};

export default ChannelHeader;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetLoggedInUserQuery } from "@/store/slice/apiSlice";
import { getNameInitials } from "@/utils";
import { GetChatDetailsResult } from "@repo/shared";
import { FC } from "react";

const ChannelHeader: FC<{ chatDetails: GetChatDetailsResult }> = ({
  chatDetails: { topic, users, isGroup },
}) => {
  const { data: loggedInUser } = useGetLoggedInUserQuery(null);
  const chattingWith = users.find((u) => u.user.id !== loggedInUser?.data?.id);

  if (!chattingWith) return null;

  const channelName = isGroup ? topic : chattingWith.user.fullName;
  const channelAvatar = isGroup
    ? topic!.charAt(0)
    : chattingWith?.user.avatarUrl || undefined;

  return (
    <div className={"w-full bg-foreground mb-8 p-4"}>
      <div className="flex flex-row items-center justify-start">
        <Avatar>
          <AvatarImage src={channelAvatar} alt={"channel avatar"} />
          <AvatarFallback>
            {!isGroup
              ? getNameInitials(chattingWith?.user.fullName)
              : topic!.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="ml-4">{channelName}</span>
      </div>
    </div>
  );
};

export default ChannelHeader;

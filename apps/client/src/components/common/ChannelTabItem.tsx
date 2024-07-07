import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { APP_URL } from "@/constants/clientUrl.constants";
import { getNameInitials } from "@/utils";
import { GetChannelResponseType } from "@repo/shared";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const ChannelTabItem: FC<GetChannelResponseType & { index: number }> = ({
  isGroup,
  users,
  id,
  topic,
  index,
}) => {
  const navigate = useNavigate();
  const channelName = isGroup ? topic : users[0].user.fullName;
  return (
    <div
      key={id}
      onClick={() => navigate(APP_URL.CHAT + "/" + id)}
      className={`flex flex-row items-center justify-start p-2 ${index % 2 === 0 && "bg-slate-800"} cursor-pointer`}
    >
      <Avatar>
        <AvatarImage
          src={users[0].user.fullName || topic.charAt(0)}
          alt={"channel avatar"}
        />
        <AvatarFallback>
          {!isGroup ? getNameInitials(users[0].user.fullName) : topic.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <span className="ml-2">{channelName}</span>
    </div>
  );
};

export default ChannelTabItem

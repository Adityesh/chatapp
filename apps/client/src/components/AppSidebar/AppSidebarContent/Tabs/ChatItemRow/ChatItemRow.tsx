import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { FC, useMemo } from "react";
import { Separator } from "@/components/ui/separator.tsx";
import {
  BaseChannelDto,
  BaseUserDto,
  ChannelTypeEnum,
  ClassProperties,
} from "shared";
import { SET_TAB_SELECTED_ITEM } from "@/store/slice/navigationSlice.ts";
import { APP_URL } from "@/constants/clientUrl.constants.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.ts";
import { useNavigate } from "react-router-dom";
import { TAB_TYPE } from "@/types/navigationSlice.types.ts";

type ChatItemRowProps = {
  channel: ClassProperties<typeof BaseChannelDto>;
  currentUser: ClassProperties<typeof BaseUserDto>;
  selectedIndex?: number;
};

// function getColor(status: ChatItemRowProps["status"]) {
//   switch (status) {
//     case "online":
//       return "border-green-400";
//     case "offline":
//       return "border-red-400";
//     case "away":
//       return "border-yellow-400";
//     case "invisible":
//       return "border-grey-400";
//   }
// }

const ChatItemRow: FC<ChatItemRowProps> = ({ channel, currentUser, selectedIndex }) => {
  const dispatch = useAppDispatch();
  const { tab } = useAppSelector((state) => state.navigation);
  const navigate = useNavigate();
  const channelDetails = useMemo(() => {
    if (channel.channelType === ChannelTypeEnum.DIRECT) {
      const chatWith = channel.users.find(
        (cu) => cu.user.id !== currentUser.id,
      );
      return {
        avatar: chatWith?.user.avatarUrl ?? "",
        name: chatWith?.user.fullName,
        // should be last message sent time
        updatedAt: channel.updatedAt,
      };
    }

    return {
      avatar: channel.channelAvatar,
      name: channel.topic,
      // should be last message sent time
      updatedAt: channel.updatedAt,
    };
  }, [currentUser, channel]);
  const isItemSelected =
    tab === TAB_TYPE.CHATS && selectedIndex === channel.id;

  const handleChannelSelect = () => {
    dispatch(SET_TAB_SELECTED_ITEM({ value: channel }));
    navigate(APP_URL.CHAT + "/" + channel.id, {
      viewTransition: true,
    });
  };

  return (
    <>
      <div
        onClick={handleChannelSelect}
        className={`${isItemSelected ? "bg-primary" : "hover:bg-sidebar-foreground"} w-full py-4 px-4 md:px-6 cursor-pointer rounded-sm flex items-center justify-between`}
      >
        <Avatar className={`h-10 w-10 border-4`}>
          <AvatarImage src={channelDetails.avatar} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className={"ml-2 grow truncate"}>
          <div className={"flex items-center justify-between"}>
            <p className={"text-white font-satoshi"}>{channelDetails.name}</p>
            <span className={"text-white font-poppins-thin text-xs"}>
              03/01/2025
            </span>
          </div>
          <p
            className={"text-white font-poppins text-xs md:text-sm text-nowrap"}
          >
            Sounds perfect. How
            about..................sdfsdfsdfsdfsdfsdfsdfsdfsdfsdf
          </p>
        </div>
      </div>

      <Separator />
    </>
  );
};

export default ChatItemRow;

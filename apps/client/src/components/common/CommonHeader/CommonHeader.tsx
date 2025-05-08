import { useMemo } from "react";
import { ChannelTypeEnum, UserStatus } from "shared";
import {
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
} from "@/store/api/userApi.ts";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/useIsMobile.ts";
import { ChevronLeft } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { useGetChannelByIdQuery } from "@/store/api/channelApi.ts";
import { APP_URL } from "@/constants/clientUrl.constants.ts";
import { getUserPresenceColor } from "@/utils";

type CommonHeaderObj = {
  avatar: string | null;
  name: string;
  lastSeen?: Date | null;
  status?: UserStatus | null;
} | null;

export default function CommonHeader() {
  const isMobile = useIsMobile();
  const params = useParams();
  const { pathname } = useLocation();
  const id = params["id"];
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: channel } = useGetChannelByIdQuery(
    {
      id: Number(id),
    },
    {
      skip: !pathname.includes(APP_URL.CHAT),
    },
  );
  const { data: user } = useGetUserByIdQuery(
    {
      id: Number(id),
    },
    {
      skip: !pathname.includes(APP_URL.USER),
    },
  );

  const renderHeader = useMemo(() => {
    if (!currentUser) return null;
    if (channel?.data) {
      if (channel.data.channelType === ChannelTypeEnum.DIRECT) {
        const chatWith = channel.data.users.find(
          (cu) => cu.user.id !== currentUser.data.id,
        );
        if (!chatWith) return null;
        return {
          avatar: chatWith.user.avatarUrl ?? "",
          name: chatWith.user.fullName,
          lastSeen: chatWith.user.lastSeen,
          status: chatWith.user.status,
        } as CommonHeaderObj;
      }
      return {
        avatar: channel.data.channelAvatar,
        name: channel.data.topic,
        lastSeen: null,
        status: null,
      } as CommonHeaderObj;
    }

    if (user?.data) {
      return {
        avatar: user.data.avatarUrl,
        name: user.data.fullName,
        lastSeen: null,
        status: null,
      };
    }
  }, [currentUser, channel?.data, user?.data]);

  return (
    <div className={"w-full h-full flex-col flex justify-start"}>
      {renderHeader && (
        <div
          className={
            "w-full h-20 flex items-center justify-items-start bg-sidebar-foreground py-4 px-2 text-white"
          }
        >
          {!isMobile && (
            <ChevronLeft className={"text-white cursor-pointer mr-8"} />
          )}
          <Avatar
            className={`h-10 w-10 mr-4 ${renderHeader.lastSeen && "border-4 " + getUserPresenceColor(renderHeader.lastSeen, renderHeader.status)}`}
          >
            <AvatarImage
              src={renderHeader.avatar || undefined}
              alt={`@${renderHeader.name}`}
            />
            <AvatarFallback className={"text-white"}>
              {renderHeader.name[0]}
            </AvatarFallback>
          </Avatar>
          <p className={"font-satoshi"}>{renderHeader.name}</p>
        </div>
      )}
      <Outlet />
    </div>
  );
}

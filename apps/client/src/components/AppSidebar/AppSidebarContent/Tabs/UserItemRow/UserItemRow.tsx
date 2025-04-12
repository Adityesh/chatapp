import { BaseUserDto, ClassProperties } from "shared";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { getNameInitials, getRandomColor } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.ts";
import { SET_TAB_SELECTED_ITEM } from "@/store/slice/navigationSlice.ts";
import { TAB_TYPE } from "@/types/navigationSlice.types.ts";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { APP_URL } from "@/constants/clientUrl.constants.ts";

export type UserItemRowProps = {
  user: ClassProperties<typeof BaseUserDto>;
  selectedIndex?: number;
};

export default function UserItemRow({ user, selectedIndex }: UserItemRowProps) {
  const navigate = useNavigate();
  const { userName, fullName, avatarUrl, id } = user;
  const dispatch = useAppDispatch();
  const { tab } = useAppSelector((state) => state.navigation);
  const nameInitials = getNameInitials(fullName);
  const isItemSelected = tab === TAB_TYPE.USERS && selectedIndex === id;

  const avatarFallbackColor = useMemo(() => getRandomColor(), [user.id]);

  const handleUserSelect = () => {
    dispatch(SET_TAB_SELECTED_ITEM({ value: user }));
    navigate(APP_URL.USER + "/" + user.id, {
      viewTransition: true,
    });
  };

  return (
    <>
      <div
        onClick={handleUserSelect}
        className={`w-full ${isItemSelected ? "bg-primary" : "hover:bg-sidebar-foreground"} py-4 px-4 md:px-6 cursor-pointer rounded-sm flex items-center justify-between`}
      >
        <Avatar className={`h-10 w-10`}>
          <AvatarImage src={avatarUrl || undefined} alt={`@${userName}`} />
          <AvatarFallback
            className={"text-white"}
            style={{ background: avatarFallbackColor }}
          >
            {nameInitials}
          </AvatarFallback>
        </Avatar>
        <div className={`ml-2 grow truncate`}>
          <div className={"flex items-center justify-between"}>
            <p className={"text-white font-satoshi"}>{fullName}</p>
          </div>
          <p
            className={"text-white font-poppins text-xs md:text-sm text-nowrap"}
          >
            @{userName}
          </p>
        </div>
      </div>
      <Separator />
    </>
  );
}

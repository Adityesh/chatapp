import {
  BaseConnectionDto,
  ClassProperties,
  ConnectionStatusEnum,
} from "shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { cn, getNameInitials, getRandomColor } from "@/utils";
import { useMemo } from "react";
import { Trash2, UserRoundCheck, UserRoundMinus } from "lucide-react";
import WithToolTip from "@/components/common/WithTooltip";
import {
  useDeleteConnectionMutation,
  useUpdateConnectionMutation,
} from "@/store/api/connectionApi.ts";
import { toast } from "sonner";

export type ConnectionItemRowProps = {
  connection: ClassProperties<typeof BaseConnectionDto>;
  connectionFilterValue: string;
};

const iconClassName: string = "h-5 w-5 text-white cursor-pointer";

export default function ConnectionItemRow({
  connection,
  connectionFilterValue,
}: ConnectionItemRowProps) {
  const [updateConnection] = useUpdateConnectionMutation();
  const [deleteConnection] = useDeleteConnectionMutation();
  const { avatarUrl, userName, fullName } =
    connectionFilterValue === "incoming"
      ? connection.requester
      : connection.recipient;
  const nameInitials = getNameInitials(fullName);
  const avatarFallbackColor = useMemo(() => getRandomColor(), []);

  const handleConnectionStatusChange = async (status: ConnectionStatusEnum) => {
    const result = await updateConnection({
      id: connection.id,
      status,
    }).unwrap();

    if (result.data) {
      toast.success(`Connection ${status} successfully.`);
    }
  };

  const handleDeleteConnection = async () => {
    const result = await deleteConnection({
      id: connection.id,
    }).unwrap();
    if (result.data) {
      toast.success("Connection deleted successfully.");
    }
  };

  return (
    <>
      <div
        className={`w-full hover:bg-sidebar-foreground py-4 px-4 md:px-6 cursor-pointer rounded-sm flex items-center justify-between`}
      >
        <div className={"flex items-center justify-center"}>
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
              className={
                "text-white font-poppins text-xs md:text-sm text-nowrap"
              }
            >
              @{userName}
            </p>
          </div>
        </div>
        <div>
          {connectionFilterValue === "incoming" && (
            <>
              <WithToolTip tooltipText={"Accept request"}>
                <UserRoundCheck
                  className={cn(iconClassName, "text-green-500 mr-8")}
                  onClick={() =>
                    handleConnectionStatusChange(ConnectionStatusEnum.ACCEPTED)
                  }
                />
              </WithToolTip>
              <WithToolTip tooltipText={"Decline request"}>
                <UserRoundMinus
                  className={cn(iconClassName, "text-red-500")}
                  onClick={() =>
                    handleConnectionStatusChange(ConnectionStatusEnum.DECLINED)
                  }
                />
              </WithToolTip>
            </>
          )}
          {connectionFilterValue === "sent" && (
            <WithToolTip tooltipText={"Delete request"}>
              <Trash2
                className={cn(iconClassName, "text-red-500")}
                onClick={handleDeleteConnection}
              />
            </WithToolTip>
          )}
        </div>
      </div>
      <Separator />
    </>
  );
}

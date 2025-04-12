import {
  BaseConnectionDto,
  BaseUserDto,
  ClassProperties,
  ConnectionStatusEnum,
} from "shared";
import { getNameInitials } from "@/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import dayjs from "dayjs";
import {
  useCreateConnectionMutation,
  useDeleteConnectionMutation,
  useUpdateConnectionMutation,
} from "@/store/api/connectionApi.ts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";

type UserConnectionProps = {
  user: ClassProperties<typeof BaseUserDto>;
  connection: ClassProperties<typeof BaseConnectionDto> | null;
  currentUser: ClassProperties<typeof BaseUserDto>;
};

export default function UserConnection({
  user,
  connection,
  currentUser,
}: UserConnectionProps) {
  const [createConnection] = useCreateConnectionMutation();
  const [updateConnection] = useUpdateConnectionMutation();
  const [deleteConnection] = useDeleteConnectionMutation();
  const isRequesterCurrentUser = currentUser.id === connection?.requester.id;
  const nameInitials = getNameInitials(user.fullName);

  const handleCreateConnection = async () => {
    const result = await createConnection({
      recipient: user.id,
    }).unwrap();
    if (result.data) {
      toast.success("Connection invite sent!");
      return;
    }
    toast.error("Invite failed, please try again!");
  };

  const handleConnectionStatusChange = async (status: ConnectionStatusEnum) => {
    if (!connection) return;
    const result = await updateConnection({
      id: connection.id,
      status,
    }).unwrap();

    if (result.data) {
      toast.success(`Connection ${status} successfully.`);
    }
  };

  const handleDeleteConnection = async () => {
    if (!connection) return;
    const result = await deleteConnection({
      id: connection.id,
    }).unwrap();
    if (result.data) {
      toast.success("Connection deleted successfully.");
    }
  };

  return (
    <div className={"w-full text-white"}>
      <Avatar className={"h-24 w-24"}>
        <AvatarImage src={user.avatarUrl || undefined} />
        <AvatarFallback>{nameInitials}</AvatarFallback>
      </Avatar>
      <div>
        <p>{user.fullName}</p>
        <p>@{user.userName}</p>
        <p>{dayjs(user.createdAt).toDate().toString()}</p>
      </div>
      {!connection && (
        <div>
          <p>Begin chatting with {user.fullName} by sending an invite</p>
          <Button onClick={handleCreateConnection}>Connect</Button>
        </div>
      )}
      {isRequesterCurrentUser && connection && (
        <div>
          <p>
            Waiting for {connection.recipient.fullName} to accept your
            connection
          </p>
          <div>
            <Button onClick={handleDeleteConnection}>Delete</Button>
          </div>
        </div>
      )}
      {!isRequesterCurrentUser && connection && (
        <div>
          <p>{connection.requester.fullName} wants to connect.</p>
          <p>To begin chatting, click accept</p>
          <div>
            <Button
              onClick={() =>
                handleConnectionStatusChange(ConnectionStatusEnum.ACCEPTED)
              }
            >
              Accept
            </Button>
            <Button
              onClick={() =>
                handleConnectionStatusChange(ConnectionStatusEnum.DECLINED)
              }
            >
              Decline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

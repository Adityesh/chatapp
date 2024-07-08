import { Button } from "@/components/ui/button";
import { APP_URL } from "@/constants/clientUrl.constants";
import { ConnectionStatusEnum } from "../../../../../../packages/shared/src/enums/connection.enum";
import {
  useGetConnectionWithUserQuery,
  useGetLoggedInUserQuery,
  useGetUserQuery,
  useInitateChatMutation,
  useSendConnectionInviteMutation,
  useUpdateConnectionInviteMutation,
} from "@/store/slice/apiSlice";
import { MessageSquareX, PlugZap, UserCheck } from "lucide-react";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const InviteControl: React.FC<{ userId: number }> = ({ userId }) => {
  const navigate = useNavigate();
  const [sendConnectionInvite] = useSendConnectionInviteMutation();
  const [updateConnectionInvite] = useUpdateConnectionInviteMutation();
  const [initateChat] = useInitateChatMutation();
  const { data: loggedInUser } = useGetLoggedInUserQuery(null);
  const { data: targetUser } = useGetUserQuery({ userId });
  const { data: connectionData } = useGetConnectionWithUserQuery({
    userId,
  });

  const didCurrentUserInvite = useMemo(() => {
    if (
      !loggedInUser ||
      !connectionData ||
      !loggedInUser.data ||
      !connectionData.data
    )
      return;
    return loggedInUser.data.id === connectionData.data.requestedBy.id;
  }, [loggedInUser, connectionData]);

  const handleSendConnection = async () => {
    if (!loggedInUser?.data) return;
    await sendConnectionInvite({
      addressedTo: Number(userId),
      requestedBy: loggedInUser.data.id,
    }).unwrap();
    toast.success("Invitation to connect sent!");
  };

  const handleUpdateConnection = async (status: ConnectionStatusEnum) => {
    if (!connectionData || !connectionData.data) return;
    // Accept or decline a request
    await updateConnectionInvite({
      status,
      connectionId: connectionData.data?.id,
    });
    toast.success("Connection " + status);
  };

  const handleInitateChat = async () => {
    if (!loggedInUser || !loggedInUser.data) return;
    const response = await initateChat({
      receiverId: Number(userId),
      senderId: loggedInUser.data.id,
    }).unwrap();
    if (response.data?.channelId) {
      navigate(APP_URL.CHAT + "/" + response.data.channelId);
    }
  };

  if (!loggedInUser || !targetUser || !loggedInUser.data || !targetUser.data)
    return <></>;

  return (
    <>
      {!connectionData?.data ? (
        <Button
          className="text-xl mt-8"
          size={"lg"}
          variant={"default"}
          onClick={handleSendConnection}
        >
          Connect <PlugZap className="ml-2" />
        </Button>
      ) : (
        <>
          {connectionData.data?.status === ConnectionStatusEnum.PENDING && (
            <>
              {didCurrentUserInvite ? (
                <span className="text-center text-xl mt-4">
                  Invitation to connect is still pending...
                </span>
              ) : (
                <div>
                  <div className="text-center text-xl mt-2">
                    <span className="font-satoshi text-primary cursor-pointer">
                      @{targetUser?.data.userName}{" "}
                    </span>
                    is trying to connect
                  </div>
                  <div className="flex flex-row items-center justify-center">
                    <Button
                      className="text-xl mt-8 mr-2"
                      size={"lg"}
                      variant={"secondary"}
                      onClick={() =>
                        handleUpdateConnection(ConnectionStatusEnum.ACCEPTED)
                      }
                    >
                      Accept <UserCheck className="ml-2" />
                    </Button>
                    <Button
                      className="text-xl mt-8"
                      size={"lg"}
                      variant={"destructive"}
                      onClick={() =>
                        handleUpdateConnection(ConnectionStatusEnum.DECLINED)
                      }
                    >
                      Decline <MessageSquareX className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {connectionData.data?.status === ConnectionStatusEnum.ACCEPTED && (
            <Button
              className="text-xl mt-8"
              size={"lg"}
              variant={"default"}
              onClick={handleInitateChat}
            >
              Chat now <PlugZap className="ml-2" />
            </Button>
          )}

          {connectionData.data?.status === ConnectionStatusEnum.DECLINED && (
            <span>
              {didCurrentUserInvite ? (
                <span>Your invite has been declined.</span>
              ) : (
                <span>You have declined the request.</span>
              )}
            </span>
          )}
        </>
      )}
    </>
  );
};

export default InviteControl;

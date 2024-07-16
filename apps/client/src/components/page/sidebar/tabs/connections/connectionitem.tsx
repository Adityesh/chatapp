import UserListItem from "@/components/common/userlistitem";
import { useGetLoggedInUserQuery } from "@/store/slice/apiSlice";
import { GetConnectionsItem } from "@repo/shared";
import { FC, useMemo } from "react";

const ConnectionItem: FC<{ connection: GetConnectionsItem; index: number }> = ({
  connection,
  index,
}) => {
  const { data: loggedInUser } = useGetLoggedInUserQuery(null);
  if (!loggedInUser || !loggedInUser.data) return <></>;

  const connectedWith = useMemo(() => {
    if (!loggedInUser || !loggedInUser.data) return;
    const { id: loggedInUserId } = loggedInUser.data;
    const { requestedBy, addressedTo } = connection;
    return requestedBy.id === loggedInUserId ? addressedTo : requestedBy;
  }, [connection, loggedInUser.data]);

  if (!connectedWith) return;

  return <UserListItem user={connectedWith} index={index} />;
};

export default ConnectionItem;

import { useParams } from "react-router-dom";
import {
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
} from "@/store/api/userApi.ts";
import UserConnection from "@/components/UserConnection";
import { useGetConnectionWithUserQuery } from "@/store/api/connectionApi.ts";

export default function User() {
  const params = useParams();
  const userId = params["id"];
  const { data: user } = useGetUserByIdQuery({
    id: Number(userId),
  });
  const { data: connection } = useGetConnectionWithUserQuery({
    id: Number(userId),
  });
  const { data: currentUser } = useGetCurrentUserQuery();
  if (!user || !user.data || !connection || !currentUser || !currentUser.data)
    return null;
  return (
    <UserConnection
      user={user.data}
      connection={connection.data}
      currentUser={currentUser.data}
    />
  );
}

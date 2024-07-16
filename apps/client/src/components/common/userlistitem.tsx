import { getNameInitials } from "@/utils";
import { BaseUserResult } from "@repo/shared";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserListItem: FC<{ user: BaseUserResult; index: number }> = ({
  user,
  index,
}) => {
  const navigate = useNavigate();

  const handleOpenUser = () => {
    navigate("/chat/init/" + user.id);
  };
  
  return (
    <div
      className={`w-full cursor-pointer items-center justify-start p-2 flex ${index % 2 == 0 && "bg-muted-foreground"}`}
      key={user.id}
      onClick={handleOpenUser}
    >
      <Avatar>
        <AvatarImage src={user.avatarUrl || ""} alt={"@" + user.userName} />
        <AvatarFallback>{getNameInitials(user.fullName)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col ml-2">
        <span>{user.fullName}</span>
        <span className="text-muted text-sm hover:text-primary">
          {"@" + user.userName}
        </span>
      </div>
    </div>
  );
};

export default UserListItem;

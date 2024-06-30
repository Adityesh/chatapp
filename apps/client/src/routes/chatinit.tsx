import InviteControl from "@/components/page/chat/invitecontrol";
import UserHeader from "@/components/page/chat/userheader";
import { useParams } from "react-router-dom";

const ChatInit = () => {
  const { id } = useParams();

  if (!id || isNaN(Number(id))) {
    return <div>User id not valid</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <UserHeader userId={Number(id)} />
      <InviteControl userId={Number(id)} />
    </div>
  );
};

export default ChatInit;

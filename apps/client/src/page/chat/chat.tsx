import { useParams } from "react-router-dom";
import ChatWindow from "@/components/ChatWindow";

export default function Chat() {
  const params = useParams();
  const channelId = params["id"];

  if (!channelId) return null;

  return <ChatWindow channelId={Number(channelId)} />;
}

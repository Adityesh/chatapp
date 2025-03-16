import { useDocumentTitle } from "usehooks-ts";
import ChatItemRow from "@/components/AppSidebar/AppSidebarContent/Tabs/ChatItemRow";

export default function Chats() {
  useDocumentTitle("Chats");
  return (
    <div className={"w-full"}>
      <ChatItemRow status={"online"} />
      <ChatItemRow status={"offline"} />
      <ChatItemRow status={"away"} />
      <ChatItemRow status={"invisible"} />
      <ChatItemRow status={"online"} />
      <ChatItemRow status={"offline"} />
      <ChatItemRow status={"away"} />
      <ChatItemRow status={"invisible"} />
      <ChatItemRow status={"online"} />
      <ChatItemRow status={"offline"} />
      <ChatItemRow status={"away"} />
      <ChatItemRow status={"invisible"} />
    </div>
  );
}

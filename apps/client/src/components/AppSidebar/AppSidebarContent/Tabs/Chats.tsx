import ChatItemRow from "@/components/common/ChatItemRow";

export default function Chats() {
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

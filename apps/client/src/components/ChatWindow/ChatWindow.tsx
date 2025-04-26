import ChatInput from "@/components/ChatWindow/ChatInput";
import ChatMessages from '@/components/ChatWindow/ChatMessages';

export type ChatWindowProps = {
  channelId: number;
};

export default function ChatWindow({ channelId }: ChatWindowProps) {
  return (
    <div className={"h-[calc(100%-5rem)] w-full text-white px-4 py-4 flex flex-col justify-around"}>
      <ChatMessages channelId={channelId} />
      <ChatInput channelId={channelId} />
    </div>
  );
}

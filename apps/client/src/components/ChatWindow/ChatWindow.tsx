import {
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useGetAllMessagesInfiniteQuery,
} from "@/store/api/messageApi.ts";
import { useState } from "react";
import { GetMessagesRequest } from "shared";

export type ChatWindowProps = {
  channelId: number;
};

export default function ChatWindow({ channelId }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [createMessage] = useCreateMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const { data, fetchNextPage } = useGetAllMessagesInfiniteQuery(
    {
      channelId,
      limit: 5,
    } as GetMessagesRequest,
    {
      selectFromResult: ({ data, ...rest }) => {
        if (!data || !data.pages)
          return {
            ...rest,
            data: [],
          };
        const items = data.pages
          .flatMap((page) => page?.data?.data)
          .filter((item) => item !== undefined);

        return {
          ...rest,
          data: items,
        };
      },
    },
  );

  // const { ref } = useIntersectionObserver({
  //   threshold: 0.8,
  //   onChange: (isIntersecting) =>
  //     isIntersecting && fetchNextPage(),
  // });

  const handleCreateMessage = async () => {
    await createMessage({
      channelId,
      content: message,
    });
  };

  const handleEditMessage = async (messageId: number) => {
    await editMessage({
      messageId,
      content: message,
    });
  };

  const handleDeleteMessage = async (messageId: number) => {
    await deleteMessage({
      channelId,
      messageId,
    });
  };

  return (
    <div className={"h-full w-full text-white"}>
      Chat Window Component
      <input
        type={"text"}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder={"Send Message"}
      />
      <button onClick={handleCreateMessage}>Send Message</button>
      {data.map((message) => {
        return (
          <div className={"text-red my-7"} key={message.id}>
            <span>{message.content}</span>

            <button onClick={() => handleEditMessage(message.id)}>
              Edit Message
            </button>
            <button onClick={() => handleDeleteMessage(message.id)}>
              Delete Message
            </button>
          </div>
        );
      })}
      <button onClick={fetchNextPage}>Next Page</button>
    </div>
  );
}

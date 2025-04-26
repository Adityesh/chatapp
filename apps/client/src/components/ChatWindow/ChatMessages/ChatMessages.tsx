import MessageItem from "@/components/ChatWindow/ChatMessages/MessageItem";
import { useGetAllMessagesInfiniteQuery } from "@/store/api/messageApi.ts";
import { GetMessagesRequest } from "shared";
import { useGetCurrentUserQuery } from "@/store/api/userApi.ts";
import { Virtuoso } from "react-virtuoso";

export type ChatMessagesProps = {
  channelId: number;
};

export default function ChatMessages({ channelId }: ChatMessagesProps) {
  const { data: currentUser } = useGetCurrentUserQuery();
  const {
    data,
    hasPreviousPage,
    fetchPreviousPage,
    fetchNextPage,
    hasNextPage,
  } = useGetAllMessagesInfiniteQuery(
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
          .filter((item) => item !== undefined)
          .reverse();

        return {
          ...rest,
          data: items,
        };
      },
    },
  );
  if (!currentUser || !currentUser.data) return null;

  return (
    <>
      <Virtuoso
        className="flex flex-col justify-end"
        totalCount={data.length}
        initialTopMostItemIndex={data.length - 1}
        alignToBottom
        itemContent={(index) => (
          <MessageItem message={data[index]} currentUser={currentUser.data} />
        )}
      />

      <button onClick={fetchNextPage}>Next : {hasNextPage.toString()}</button>
      <button onClick={fetchPreviousPage}>
        Previous : {hasPreviousPage.toString()}
      </button>
    </>
  );
}

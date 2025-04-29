import { FC, useMemo, memo } from "react";
import { useAppSelector } from "@/hooks/useStore.ts";
import { useGetAllMessagesInfiniteQuery } from "@/store/api/messageApi.ts";
import { GetMessagesRequest } from "shared";

export type ChatActionViewProps = {
  channelId: number;
};

const ActionView: FC<ChatActionViewProps> = ({ channelId }) => {
  const drafts = useAppSelector((state) => state.chat.drafts);
  const channelDraft = drafts[channelId];
  const action = channelDraft?.action || undefined;

  const { data: actionMessage } = useGetAllMessagesInfiniteQuery(
    {
      channelId,
      limit: 5,
    } as GetMessagesRequest,
    {
      selectFromResult: ({ data, ...rest }) => {
        if (!data || !data.pages)
          return {
            ...rest,
            data: undefined,
          };
        const actionMessage = data.pages
          .flatMap((page) => page?.data?.data)
          .find((m) => m.id === channelDraft?.messageId);

        return {
          ...rest,
          data: actionMessage,
        };
      },
    },
  );

  const renderAction = useMemo(() => {
    if (!actionMessage) return null;
    switch (action) {
      case "EDIT":
        return <span>Editing</span>;
      case "REPLY":
        return (
          <div
            className={`mb-2 border-l-4 border-l-primary bg-gray-400 mx-1 rounded-lg  flex-col items-start justify-start`}
          >
            <span className={"font-poppins-bold text-xs px-2"}>
              @{actionMessage?.sender?.userName}
            </span>
            <div className={"mt-1 font-satoshi px-2"}>
              {actionMessage.content}
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [action, actionMessage]);

  if (!actionMessage) return null;

  return <div>{renderAction}</div>;
};

export default memo(ActionView);

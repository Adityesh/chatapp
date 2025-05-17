import { FC, useMemo, memo } from "react";
import { useAppSelector } from "@/hooks/useStore.ts";
import { useGetAllMessagesInfiniteQuery } from "@/store/api/messageApi.ts";
import { GetMessagesRequest } from "shared";
import { useFileInputResult } from "@/hooks/useFileInput.ts";
import { CircleMinus } from "lucide-react";

export type ChatActionViewProps = {
  channelId: number;
  files: ReturnType<useFileInputResult["showFilePreview"]>;
  deleteFile: useFileInputResult["deleteFile"];
};

const ActionView: FC<ChatActionViewProps> = ({
  channelId,
  files,
  deleteFile,
}) => {
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

  return (
    <div className={"absolute bottom-10 w-full"}>
      {files.length > 0 && (
        <div
          className={
            "flex items-center justify-start mb-2 border-l-4 py-4 border-l-primary bg-gray-400 mx-1 rounded-lg"
          }
        >
          {files.map(({ preview }, index) => {
            return (
              <div className={"relative ml-4"} key={index}>
                <CircleMinus
                  size={"20"}
                  color={"red"}
                  onClick={() => deleteFile(index)}
                  className={
                    "absolute right-[-18px] top-[-10px] cursor-pointer"
                  }
                />
                <img
                  className={"h-18"}
                  src={preview}
                  alt={"preview-img" + index}
                />
              </div>
            );
          })}
        </div>
      )}
      {renderAction}
    </div>
  );
};

export default memo(ActionView);

import { BaseMessageDto } from "shared";
import { AppDispatch, RootState } from "@/types/store.types.ts";
import { messageApi } from "@/store/api/messageApi.ts";

export function insertMessageCache(
  message: BaseMessageDto,
  channelId: number,
  dispatch: AppDispatch,
  rootState: RootState,
) {
  const params = messageApi.util.selectCachedArgsForQuery(
    rootState,
    "getAllMessages",
  );
  const cacheKey = params.find((s) => s.channelId === channelId);
  if (!cacheKey) return;

  dispatch(
    messageApi.util.updateQueryData("getAllMessages", cacheKey, (draft) => {
      const lastPage = draft.pages.at(0);
      if (lastPage) {
        lastPage.data.data.unshift(message);
      }
    }),
  );
}

export function editMessageCache(editMessage: BaseMessageDto, messageId: number, dispatch: AppDispatch, rootState: RootState) {
  const params = messageApi.util.selectCachedArgsForQuery(
    rootState,
    "getAllMessages",
  );
  const cacheKey = params.find(
    (s) => s.channelId === editMessage.channel.id,
  );
  if (!cacheKey) return;
  dispatch(
    messageApi.util.updateQueryData(
      "getAllMessages",
      cacheKey,
      (draft) => {
        if (!editMessage) return;
        const allMessages = draft.pages.flatMap((p) => p.data.data);
        allMessages.forEach((message) => {
          if (message.id === messageId) {
            Object.assign(message, editMessage);
          }
        });
      },
    ),
  );
}

export function deleteMessageCache(messageId: number, channelId: number, dispatch: AppDispatch, rootState: RootState) {
  const params = messageApi.util.selectCachedArgsForQuery(
    rootState,
    "getAllMessages",
  );
  const cacheKey = params.find((s) => s.channelId === channelId);
  if (!cacheKey) return;
  dispatch(
    messageApi.util.updateQueryData(
      "getAllMessages",
      cacheKey,
      (draft) => {
        draft.pages.forEach((page) => {
          const messages = page.data.data;
          const deleteIndex = messages.findIndex(
            (m) => m.id === messageId,
          );
          if (deleteIndex >= 0) {
            messages.splice(deleteIndex, 1);
          }
        });
      },
    ),
  );
}

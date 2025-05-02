import { Middleware } from "@reduxjs/toolkit";
import { BroadcastMessageToChannelEvent, SocketEvents } from "shared";
import SocketSingleton from "@/utils/socket.ts";
import { INIT_SOCKET, JOIN_CHANNEL } from "@/store/slice/socketSlice.ts";
import {
  deleteMessageCache,
  editMessageCache,
  insertMessageCache,
} from "@/utils/api.ts";
import { RootState } from "@/types/store.types.ts";

const socketMiddleware: Middleware = ({ dispatch, getState }) => {
  let socket: SocketSingleton["socket"];
  return (next) => (action) => {
    if (INIT_SOCKET.match(action)) {
      if (!socket && typeof window !== "undefined") {
        socket = SocketSingleton.getInstance();
        socket.on(
          SocketEvents.BROADCAST_MESSAGE_TO_CHANNEL,
          ({
            message,
            channelId,
            actionType,
            messageId,
          }: BroadcastMessageToChannelEvent) => {
            switch (actionType) {
              case "edit":
                if (message) {
                  editMessageCache(
                    message,
                    message.id,
                    dispatch,
                    getState() as RootState,
                  );
                }
                break;
              case "delete":
                if (messageId) {
                  deleteMessageCache(
                    messageId,
                    channelId,
                    dispatch,
                    getState() as RootState,
                  );
                }
                break;
              default:
                if (message) {
                  insertMessageCache(
                    message,
                    channelId,
                    dispatch,
                    getState() as RootState,
                  );
                }
                break;
            }
          },
        );
      }
    }

    if (JOIN_CHANNEL.match(action) && socket) {
      socket.emit(SocketEvents.JOIN_CHANNEL, action.payload);
    }

    next(action);
  };
};

export default socketMiddleware;

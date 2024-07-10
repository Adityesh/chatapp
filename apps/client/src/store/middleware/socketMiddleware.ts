import { Middleware } from "@reduxjs/toolkit";
import { SocketEvents } from "../../../../../packages/shared/src/enums/socket.enum";
import SocketFactory from "../SocketFactory";
import {
  INIT_SOCKET,
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  MARK_MESSAGE_AS_READ,
  SEND_MESSAGE,
  SET_USER_TYPING,
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
  USER_TYPING,
} from "../slice/socketSlice";
import { baseApi } from "../slice/apiSlice";
import { MarkMessageAsReadEventReturn, UserTypingEvent } from "@repo/shared";

const socketMiddleware: Middleware = (store) => {
  let socket: SocketFactory["socket"];

  return (next) => (action) => {
    // Middleware logic for the `initSocket` action
    if (INIT_SOCKET.match(action)) {
      if (!socket && typeof window !== "undefined") {
        // Client-side-only code
        // Create/ Get Socket Socket
        socket = SocketFactory.getInstance().socket;

        socket.on(SocketEvents.CONNECT, () => {
          store.dispatch(SOCKET_CONNECTED());
        });

        socket.on(SocketEvents.ERROR, (message) => {
          console.error(message);
        });

        socket.on(SocketEvents.DISCONNECT, () => {
          store.dispatch(SOCKET_DISCONNECTED());
        });

        socket.on(SocketEvents.USER_JOINED_CHANNEL, (msg) => console.log(msg));
        socket.on(SocketEvents.USER_LEFT_CHANNEL, (msg) => console.log(msg));

        socket.on(SocketEvents.RECEIVE_MESSAGE, (payload) => {
          const { channelId, ...savedMessage } = payload;
          const params = baseApi.util.selectCachedArgsForQuery(
            store.getState(),
            "getMessages",
          );
          const selectParams = params.find((p) => p.channelId === channelId);
          if (!selectParams) return;

          store.dispatch<any>(
            baseApi.util.updateQueryData(
              "getMessages",
              selectParams,
              (draft) => {
                if (savedMessage && savedMessage) {
                  draft.data?.items.push(savedMessage);
                }
              },
            ),
          );
        });

        socket.on(SocketEvents.USER_TYPING, (data: UserTypingEvent) => {
          store.dispatch(SET_USER_TYPING(data));
        });

        socket.on(
          SocketEvents.MARK_MESSAGE_READ,
          ({
            channelId,
            messageStatusId,
            readAt,
            messageId,
          }: MarkMessageAsReadEventReturn) => {
            const params = baseApi.util.selectCachedArgsForQuery(
              store.getState(),
              "getMessages",
            );
            const selectParams = params.find((p) => p.channelId === channelId);
            if (!selectParams) return;

            store.dispatch<any>(
              baseApi.util.updateQueryData(
                "getMessages",
                selectParams,
                (draft) => {
                  const allMessages = draft.data?.items;
                  allMessages?.forEach((message) => {
                    if (message.id === messageId) {
                      const messageStatus = message.messageStatus.find(
                        (ms) => ms.id === messageStatusId,
                      );
                      if (!messageStatus) return;
                      messageStatus.readAt = readAt;
                    }
                  });
                },
              ),
            );
          },
        );
      }
    }

    if (JOIN_CHANNEL.match(action) && socket) {
      socket.emit(SocketEvents.JOIN_CHANNEL, action.payload.id);
    }

    if (LEAVE_CHANNEL.match(action) && socket) {
      socket.emit(SocketEvents.LEAVE_CHANNEL, action.payload.id);
    }

    if (SEND_MESSAGE.match(action) && socket) {
      const { payload } = action;
      socket.emit(SocketEvents.SEND_MESSAGE, payload);
    }

    if (USER_TYPING.match(action) && socket) {
      const { payload } = action;
      socket.emit(SocketEvents.USER_TYPING, payload);
    }

    if (MARK_MESSAGE_AS_READ.match(action) && socket) {
      const { payload } = action;
      socket.emit(SocketEvents.MARK_MESSAGE_READ, payload);
    }

    next(action);
  };
};

export default socketMiddleware;

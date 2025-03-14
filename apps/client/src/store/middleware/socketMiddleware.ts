import { Middleware } from "@reduxjs/toolkit";
import { SocketEvents } from "shared";
import SocketSingleton from "@/types/socket.types.ts";
import {
  INIT_SOCKET,
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from "@/store/slice/socketSlice.ts";

const socketMiddleware: Middleware = (store) => {
  let socket: SocketSingleton["socket"];
  return (next) => (action) => {
    // Middleware logic for the `initSocket` action
    if (INIT_SOCKET.match(action)) {
      if (!socket && typeof window !== "undefined") {
        // Client-side-only code
        // Create/ Get Socket
        socket = SocketSingleton.getInstance().socket;

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
      }
    }

    if (JOIN_CHANNEL.match(action) && socket) {
      socket.emit(SocketEvents.JOIN_CHANNEL, action.payload.id);
    }

    if (LEAVE_CHANNEL.match(action) && socket) {
      socket.emit(SocketEvents.LEAVE_CHANNEL, action.payload.id);
    }

    next(action);
  };
};

export default socketMiddleware;

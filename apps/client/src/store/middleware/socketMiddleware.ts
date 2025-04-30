import { Middleware } from "@reduxjs/toolkit";
import { SocketEvents } from "shared";
import SocketSingleton from "@/types/socket.types.ts";
import { JOIN_CHANNEL, LEAVE_CHANNEL } from "@/store/slice/socketSlice.ts";

const socketMiddleware: Middleware = () => {
  const socket = SocketSingleton.getInstance();
  return (next) => (action) => {
    // Middleware logic for the `initSocket` action

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

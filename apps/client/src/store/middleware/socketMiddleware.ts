import { Middleware } from "@reduxjs/toolkit";

import SocketFactory from "../SocketFactory";

import { Socket } from "socket.io-client";
import {
  INIT_SOCKET,
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from "../slice/socketSlice";

enum SocketEvents {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}

const socketMiddleware: Middleware = (store) => {
  let socket: Socket;

  return (next) => (action) => {
    if (INIT_SOCKET.match(action)) {
      if (!socket && typeof window !== "undefined") {
        socket = SocketFactory.getInstance().socket;

        socket.on(SocketEvents.CONNECT, () => {
          store.dispatch(SOCKET_CONNECTED());
        });

        socket.on(SocketEvents.DISCONNECT, () => {
          store.dispatch(SOCKET_DISCONNECTED());
        });
      }
    }
    next(action);
  };
};

export default socketMiddleware;

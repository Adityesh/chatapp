import { io, Socket } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000";

class SocketConnection {
  public socket: Socket;

  constructor() {
    this.socket = io(SOCKET_URL);
  }
}

let socketConnection: Socket | undefined;

/**
 * SocketFactory class will return only create a single socket connection and return
 * it on subsequent requests, making sure a single instance is used through out the application.
 */
export default class SocketFactory {
  public static create(): Socket {
    if (!socketConnection) return new SocketConnection().socket;
    return socketConnection;
  }
}

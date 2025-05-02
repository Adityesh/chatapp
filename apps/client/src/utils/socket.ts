import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_SOCKET_URL;

class SocketSingleton {
  public socket: Socket;
  private static instance: SocketSingleton;

  private constructor() {
    const socketEndpoint = SOCKET_URL;
    if (!socketEndpoint) {
      throw new Error("SOCKET_URL is not defined");
    }

    this.socket = io(socketEndpoint, {
      withCredentials: true, // Ensure credentials are used for CORS
      autoConnect: false,
    });
  }

  public static getInstance() {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new SocketSingleton();
    }
    return SocketSingleton.instance.socket;
  }
}

export default SocketSingleton;

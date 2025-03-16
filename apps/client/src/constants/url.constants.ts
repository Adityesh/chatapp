export const AUTH_CONTROLLER = {
  LOGIN_LOCAL: "/auth/login",
  REGISTER_LOCAL: "/auth/register",
  LOGOUT: "/auth/logout",
};

export const USER_CONTROLLER = {
  GET_USER_BY_ID: "/user/{0}",
  GET_USERS: "/user",
};

export const CHAT_CONTROLLER = {
  INITATE_CHAT: "/chat/init",
  CHAT_DETAILS: "/chat/details",
  MESSAGE: "/chat/message/",
  CHANNELS: "/chat/channels",
  CREATE_CHANNEL : "/chat/channel/create"
};

export const CONNECTIONS_CONTROLLER = {
  GET_CONNECTIONS : "/connection/all"
}

export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
  PATCH = "PATCH",
}

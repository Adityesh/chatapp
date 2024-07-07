export const AUTH_CONTROLLER = {
  LOGIN_LOCAL: "/auth/local/login",
  REGISTER_LOCAL: "/auth/local/register",
  LOGOUT: "/auth/logout",
};

export const USER_CONTROLLER = {
  SEARCH_USERS: "/user/search",
  GET_USER: "/user",
  CONNECTION_INVITE: "/user/connection",
  GET_CONNECTION_WITH_USER: "/user/connection/",
};

export const CHAT_CONTROLLER = {
  INITATE_CHAT: "/chat/init",
  CHAT_DETAILS: "/chat/details",
  MESSAGE: "/chat/message/",
  CHANNELS : "/chat/channels"
};

export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
  PATCH = "PATCH",
}

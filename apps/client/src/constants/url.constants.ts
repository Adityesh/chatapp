export const AUTH_CONTROLLER = {
  LOGIN_LOCAL: "/auth/login",
  REGISTER_LOCAL: "/auth/register",
  LOGOUT: "/auth/logout",
};

export const USER_CONTROLLER = {
  GET_USER_BY_ID: "/user/{userId}",
  GET_USERS: "/user",
  GET_CURRENT_USER: "/user/current"
};

export const CONNECTIONS_CONTROLLER = {
  GET_CONNECTION : "/connection/{userId}",
  CREATE_CONNECTION : "/connection",
  UPDATE_CONNECTION : "/connection",
  GET_ALL_CONNECTIONS : "/connection",
  DELETE_CONNECTION : "/connection/{connectionId}",
}

export const CHANNEL_CONTROLLER = {
  GET_CHANNELS : "/channel"
}

export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
  PATCH = "PATCH",
}

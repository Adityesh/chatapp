import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  tagTypes: [
    "loginUser",
    "registerUser",
    "logoutUser",
    "getConnectionWithUser",
    "getConnections",
    "getCurrentUser",
    "getUserById",
    "getUsers",
    "getMessages",
    "getChannels",
    "getChannelById",
  ],
  endpoints: () => ({}),
});

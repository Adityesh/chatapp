import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import socketMiddleware from "./middleware/socketMiddleware";
import authReducer from "./slice/authSlice";
import navigationReducer from "./slice/navigationSlice";
import socketReducer from "./slice/socketSlice";
import chatReducer from "./slice/chatSlice";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { baseApi } from "@/store/api/baseApi.ts";

export const store = configureStore({
  reducer: {
    socket: socketReducer,
    auth: authReducer,
    navigation: navigationReducer,
    chat: chatReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      baseApi.middleware,
      socketMiddleware,
      errorMiddleware,
    ]),
});

// configure listeners using the provided defaults
setupListeners(store.dispatch);

import { configureStore } from "@reduxjs/toolkit";
import socketReducer from "./slice/socketSlice";
import socketMiddleware from "./middleware/socketMiddleware";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./slice/apiSlice";

export const store = configureStore({
  reducer: {
    socket: socketReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([baseApi.middleware, socketMiddleware]),
});

// configure listeners using the provided defaults
setupListeners(store.dispatch);

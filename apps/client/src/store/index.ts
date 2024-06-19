import { configureStore } from "@reduxjs/toolkit";
import socketReducer from "./slice/socketSlice";
import socketMiddleware from "./middleware/socketMiddleware";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});

// configure listeners using the provided defaults
setupListeners(store.dispatch);

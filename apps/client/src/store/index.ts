import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import socketMiddleware from "./middleware/socketMiddleware";
import { baseApi } from "./slice/apiSlice";
import authReducer from "./slice/authSlice";
import navigationReducer from "./slice/navigationSlice";
import socketReducer from "./slice/socketSlice";

export const store = configureStore({
  reducer: {
    socket: socketReducer,
    auth: authReducer,
    navigation: navigationReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([baseApi.middleware, socketMiddleware]),
});

// configure listeners using the provided defaults
setupListeners(store.dispatch);

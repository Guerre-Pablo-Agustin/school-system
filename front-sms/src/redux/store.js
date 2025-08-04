import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

//slice
import userReducer from "./features/userSlice";

//services
import { authApi } from "./services/authApi";


export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware]),
});

setupListeners(store.dispatch);

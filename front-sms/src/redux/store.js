import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

//slice
import userReducer from "./features/userSlice";

//services
import { authApi } from "./services/authApi";
import { clasesApi } from "./services/clasesApi";
import { materiasApi } from "./services/materiasApi";


export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [clasesApi.reducerPath]: clasesApi.reducer,
    [materiasApi.reducerPath]: materiasApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, clasesApi.middleware, materiasApi.middleware]),
});

setupListeners(store.dispatch);

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

//slice
import userReducer from "./features/userSlice";

//services
import { authApi } from "./services/authApi";
import { clasesApi } from "./services/clasesApi";
import { materiasApi } from "./services/materiasApi";
import { alumnosApi } from "./services/alumnosApi";
import { notasApi } from "./services/notasApi";



export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [clasesApi.reducerPath]: clasesApi.reducer,
    [materiasApi.reducerPath]: materiasApi.reducer,
    [alumnosApi.reducerPath]: alumnosApi.reducer,
    [notasApi.reducerPath]: notasApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, clasesApi.middleware, materiasApi.middleware, alumnosApi.middleware, notasApi.middleware]),
});

setupListeners(store.dispatch);

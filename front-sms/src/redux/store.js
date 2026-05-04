import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

//slice
import userReducer from "./features/userSlice";

//services
import { authApi } from "./services/authApi";
import { clasesApi } from "./services/clasesApi";
import { materiasApi } from "./services/asignatura.Api";
import { alumnosApi } from "./services/alumnosApi";
import { notasApi } from "./services/notasApi";
import { ciclosApi } from "./services/ciclosApi";
import { gradosApi } from "./services/gradosApi";
import { seccionesApi } from "./services/seccionesApi";



export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [clasesApi.reducerPath]: clasesApi.reducer,
    [materiasApi.reducerPath]: materiasApi.reducer,
    [alumnosApi.reducerPath]: alumnosApi.reducer,
    [notasApi.reducerPath]: notasApi.reducer,
    [ciclosApi.reducerPath]: ciclosApi.reducer,
    [gradosApi.reducerPath]: gradosApi.reducer,
    [seccionesApi.reducerPath]: seccionesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, clasesApi.middleware, materiasApi.middleware, alumnosApi.middleware, notasApi.middleware, ciclosApi.middleware, gradosApi.middleware, seccionesApi.middleware]),
});

setupListeners(store.dispatch);

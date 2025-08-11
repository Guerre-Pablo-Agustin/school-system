import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logoutUser, setUserToken } from "../features/userSlice";
import { store } from "../store";
import { User } from "../../../types/Usuario.type";

type RootState = ReturnType<typeof store.getState>;

const backendUrl = process.env.NEXT_PUBLIC_API_ROUTElOCAL;

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
}

interface getUsersResponse {
  message: string;
  data: User[];

}

interface UserResponse {
  message: string;
  data: User;
  error?: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.usertoken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  const status = (result.error as FetchBaseQueryError)?.status;

  console.log("Resultado de la query original:", result);

  if (result.error && [401, 403].includes(status as number)) {
    console.log("Intentando refrescar el token...");

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    console.log("Resultado del refresh:", refreshResult);

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as { accessToken: string };

      console.log("Nuevo accessToken:", accessToken);

      api.dispatch(setUserToken(accessToken));

      result = await baseQuery(args, api, extraOptions);
      console.log("Resultado después de refrescar:", result);
    } else {
      console.warn("No se pudo refrescar el token. Cerrando sesión.");
      api.dispatch(logoutUser());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    //login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    //logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    //refreshToken
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

    //traer todos los usuarios
    getUsers: builder.query<getUsersResponse, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),

    //traer un usuario por su id
    getUserById: builder.query<UserResponse, string>({
      query: (id) => {
        console.log("ID del usuario:", id);
       return {
        url: `/users/${id}`,
        method: "GET"
      }
      },
    }),

    //actualizar un usuario
    updateUser: builder.mutation<UserResponse, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => {
        console.log("🛠️ Enviando usuario desde mutation:", data);
        return {
          url: `/users/${id}`,
          method: "PUT",
          body: data,
        };
      },
    }),

    //crear un usuario
    createUser: builder.mutation<UserResponse, Partial<User>>({
      query:(data)=>{
        console.log("🛠️ Enviando usuario desde mutation:",data); // 👈 log
        return {
          url:"users",
          method:"POST",
          body:data,
        }
      },
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useRefreshTokenMutation, 
  useGetUserByIdQuery, 
  useUpdateUserMutation, 
  useCreateUserMutation, 
  useGetUsersQuery 
} = authApi;

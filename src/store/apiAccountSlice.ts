import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiAccountSlice = createApi({
  reducerPath: "apiAccount",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://altairis-server.onrender.com/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
    }),
    registrationProfile: builder.mutation({
      query: (newUser) => ({
        url: "register",
        method: "POST",
        body: newUser,
      }),
    }),
    loginProfile: builder.mutation({
      query: (user) => ({
        url: "login",
        method: "POST",
        body: user,
      }),
    }),
    logoutProfile: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: "delete-account",
        method: "DELETE",
      }),
    }),
    uploadAvatar: builder.mutation({
      query: (avatar) => {
        const formData = new FormData();
        formData.append("avatar", avatar);

        return {
          url: "upload-avatar",
          method: "PATCH",
          body: formData,
        };
      },
    }),
    updateEmail: builder.mutation({
      query: (email: { email: string }) => {
        return {
          url: "update-email",
          method: "PATCH",
          body: email,
        };
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "refresh-token",
        method: "POST",
      }),
    }),
  }),
});

export default apiAccountSlice;
export const {
  useGetProfileQuery,
  useRegistrationProfileMutation,
  useLoginProfileMutation,
  useLogoutProfileMutation,
  useDeleteAccountMutation,
  useUploadAvatarMutation,
  useUpdateEmailMutation,
} = apiAccountSlice;

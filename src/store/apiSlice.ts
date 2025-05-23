import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
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
    updateStatus: builder.mutation({
      query: (status: string) => ({
        url: "update-status",
        method: "PATCH",
        body: { status },
      }),
    }),
    createPost: builder.mutation({
      query: ({ image, description, date }) => {
        const formData = new FormData();
        formData.append("media", image);
        formData.append("description", description);
        formData.append("date", date);

        return {
          url: "create-post",
          method: "POST",
          body: formData,
        };
      },
    }),
    getPosts: builder.query({
      query: (all) => `/posts?page=${all.page}&limit=${all.limit}`,
    }),
    deletePost: builder.mutation({
      query: (id: string) => ({
        url: "delete-post",
        method: "DELETE",
        body: { id },
      }),
    }),
    getForeignUserProfile: builder.query({
      query: (id: string) => `user-profile/${id}`,
    }),
    getChats: builder.query({
      query: () => "chats",
      keepUnusedDataFor: 0,
    }),
    sendMessage: builder.mutation({
      query: ({ message, userId }: { message: string; userId: string }) => ({
        url: "send-message",
        method: "POST",
        body: { message, userId },
      }),
    }),
  }),
});

export default apiSlice;
export const {
  useGetProfileQuery,
  useRegistrationProfileMutation,
  useLoginProfileMutation,
  useDeleteAccountMutation,
  useUploadAvatarMutation,
  useUpdateEmailMutation,
  useUpdateStatusMutation,
  useCreatePostMutation,
  useGetPostsQuery,
  useDeletePostMutation,
  useGetForeignUserProfileQuery,
  useGetChatsQuery,
  useSendMessageMutation,
} = apiSlice;

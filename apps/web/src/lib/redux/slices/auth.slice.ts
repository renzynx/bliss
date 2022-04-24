import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserResponse, Stats, PaginationPayload } from '@bliss/shared-types';
import {
  ChangePasswordPayLoad,
  LoginPayload,
  RegisterPayload,
  ShareXConfig,
} from '#lib/types';
import { File, Invite, User } from '@prisma/client';

export const auth = createApi({
  reducerPath: 'auth',
  tagTypes: ['Auth', 'File', 'Invite'],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    me: builder.query<{ user: User }, void>({
      providesTags: ['Auth'],
      query: () => ({
        url: '/auth/me',
        credentials: 'include',
      }),
    }),
    login: builder.mutation<UserResponse, LoginPayload>({
      query: (payload) => ({
        url: '/auth/login',
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<UserResponse, RegisterPayload>({
      query: (payload) => ({
        url: '/auth/register',
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        credentials: 'include',
      }),
    }),
    changePassword: builder.mutation<UserResponse, ChangePasswordPayLoad>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        credentials: 'include',
        body: data,
      }),
    }),
    files: builder.query<
      PaginationPayload<File>,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/auth/files?page=${page}&limit=${limit}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['File'],
    }),
    deleteFile: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (slug) => ({
          url: `/delete/${slug}`,
          method: 'GET',
          credentials: 'include',
        }),
        invalidatesTags: ['File'],
      }
    ),
    stats: builder.query<Stats, void>({
      query: () => ({
        url: '/auth/stats',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    updateSlug: builder.mutation<User, string>({
      query: (slug) => ({
        url: '/auth/slug',
        method: 'POST',
        credentials: 'include',
        body: { slug },
      }),
    }),
    resetToken: builder.mutation<{ token: string }, void>({
      query: () => ({
        url: '/auth/reset-token',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    getConfig: builder.mutation<ShareXConfig, void>({
      query: () => ({
        url: '/auth/sharex',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    getInvites: builder.query<{ invites: Invite[] }, void>({
      query: () => ({
        url: '/auth/invite',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Invite'],
    }),
    createInvite: builder.mutation<string, void>({
      query: () => ({
        url: '/auth/create-invite',
        method: 'GET',
        credentials: 'include',
      }),
      invalidatesTags: ['Invite'],
    }),
  }),
});

export const {
  useMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useFilesQuery,
  useStatsQuery,
  useDeleteFileMutation,
  useUpdateSlugMutation,
  useResetTokenMutation,
  useChangePasswordMutation,
  useGetConfigMutation,
  useGetInvitesQuery,
  useCreateInviteMutation,
} = auth;

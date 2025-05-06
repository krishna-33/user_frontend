import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const VITE_BE_URL = import.meta.env.VITE_BE_URL;

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: VITE_BE_URL }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({ endpoint = '', authToken = '', page = 1, limit = 10 }) => {
                return {
                  url: `/${endpoint}?page=${page}&limit=${limit}`,
                  headers: {
                    'Authorization': `Bearer ${authToken}`
                  },
                };
              },
            providesTags: ["User"]
        }),
        
        postApi: builder.mutation({
            query: ({ endpoint = "", body = {}, authToken = '' }) => ({
              url: `${endpoint}`,
              method: "POST",
              headers: {
                'Authorization': `Bearer ${authToken}`
              },
              body,
            }),
          }),

          updateUserById: builder.mutation({
            query: ({  endpoint = "" , authToken = '', body = {},}) => {
              debugger
              return {
                url: `${endpoint}`,
                method: "PATCH",
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                },
                body
              }
            },
          }),
          
          getUserById: builder.query({
            query: ({ id, authToken }) => ({
              url: `users/${id}`,
              headers: {
                'Authorization': `Bearer ${authToken}`,
              },
            }),
            providesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
          }),

          deleteById: builder.mutation({
            query: ({ id, authToken }) => ({
              url: `users/${id}`,
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }),
            invalidatesTags: (result, error, arg) => [
              { type: 'User' },
              { type: 'User', id: arg.id },
            ],
          }),
        
    }),
})

export const { useGetUsersQuery, useLazyGetUsersQuery, usePostApiMutation, useUpdateUserByIdMutation, useGetUserByIdQuery, useDeleteByIdMutation } = api
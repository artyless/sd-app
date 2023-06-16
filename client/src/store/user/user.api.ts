import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IAuth} from '../../models/query'
import {IUser} from '../../models/user'

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/user'
    }),
    tagTypes: ['User'],
    endpoints: build => ({
        editUser: build.mutation<IUser, IUser>({
            query: (args) => ({
                url: '/',
                method: 'PUT',
                body: {},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            transformResponse: (response: { user: IUser }) => response.user,
            invalidatesTags: ['User']
        }),
        getUser: build.query<IUser, IAuth>({
            query: (args) => ({
                url: '/',
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            transformResponse: (response: { user: IUser }) => response.user,
            providesTags: result => ['User']
        })
    })
})

export const {useGetUserQuery, useEditUserMutation} = userAPI

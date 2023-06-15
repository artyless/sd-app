import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IAuth} from '../../models/query'
import {TypeServerUser} from '../../types/serverTypes'
import {IUser} from '../../models/user'

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/user'
    }),
    tagTypes: ['User'],
    endpoints: build => ({
        editUser: build.mutation<TypeServerUser, IUser>({
            query: (args) => ({
                url: '/',
                method: 'PUT',
                body: {},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            invalidatesTags: ['User']
        }),
        getUser: build.query<TypeServerUser, IAuth>({
            query: (args) => ({
                url: '/',
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            providesTags: result => ['User']
        })
    })
})

export const {useGetUserQuery, useEditUserMutation} = userAPI

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IUserData} from '../../../../models/user'

export const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/auth'
    }),
    endpoints: build => ({
        login: build.mutation<IUserData, { email: string, password: string }>({
            query: (args) => ({
                url: '/login',
                method: 'POST',
                body: args
            })
        }),
        register: build.mutation<IUserData, IUserData>({
            query: (args) => ({
                url: '/register',
                method: 'POST',
                body: args
            })
        })
    })
})

export const {useLoginMutation, useRegisterMutation} = authAPI

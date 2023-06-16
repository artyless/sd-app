import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IAuth} from '../../models/query'

export const searchAPI = createApi({
    reducerPath: 'searchAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/search'
    }),
    endpoints: build => ({
        search: build.query<any, any>({
            query: (args) => ({
                url: `/${args.query}`,
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            // transformResponse: (response: { message: string }) => response.message,
        }),
        edit: build.mutation<string, IAuth>({
            query: (args) => ({
                url: '/edit',
                method: 'POST',
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            transformResponse: (response: { message: string }) => response.message,
        })
    })
})

export const {useSearchQuery, useEditMutation} = searchAPI

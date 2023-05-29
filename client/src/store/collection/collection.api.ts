import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const user = localStorage.getItem('userData')
let token = ''

// TODO local storage не обновляется
if (user) {
    token = JSON.parse(user).token
}

export const collectionAPI = createApi({
    reducerPath: 'collectionAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/collection'
    }),
    tagTypes: ['Collection'],
    endpoints: build => ({
        // типы
        createCollection: build.mutation<any, any>({
            query: (args) => ({
                url: '/',
                method: 'POST',
                body: args,
                headers: {Authorization: `Bearer ${token}`}
            }),
            invalidatesTags: ['Collection']
        }),
        // типы
        getCollections: build.query<any, any>({
            query: () => ({
                url: '/',
                headers: {Authorization: `Bearer ${token}`}
            }),
            providesTags: result => ['Collection']
        }),
        // типы
        deleteCollection: build.mutation<any, any>({
            query: (args) => ({
                url: '/',
                method: 'DELETE',
                body: args,
                headers: {Authorization: `Bearer ${token}`}
            }),
            invalidatesTags: ['Collection']
        })
    })
})

export const {useCreateCollectionMutation, useGetCollectionsQuery, useDeleteCollectionMutation} = collectionAPI

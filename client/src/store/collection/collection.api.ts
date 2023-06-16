import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IAuth, IMutationCollection} from '../../models/query'
import {ICollection} from "../../models/collection"

export const collectionAPI = createApi({
    reducerPath: 'collectionAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/collection'
    }),
    tagTypes: ['Collection'],
    endpoints: build => ({
        createCollection: build.mutation<string, IMutationCollection>({
            query: (args) => ({
                url: '/',
                method: 'POST',
                body: {userId: args.userId, collectionName: args.collectionName},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            transformResponse: (response: { message: string }) => response.message,
            invalidatesTags: ['Collection']
        }),
        getCollections: build.query<ICollection[], IAuth>({
            query: (args) => ({
                url: '/',
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            transformResponse: (response: { collections: ICollection[] }) => response.collections,
            providesTags: result => ['Collection']
        }),
        deleteCollection: build.mutation<string, IMutationCollection>({
            query: (args) => ({
                url: '/',
                method: 'DELETE',
                body: {userId: args.userId, collectionName: args.collectionName},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            transformResponse: (response: { message: string }) => response.message,
            invalidatesTags: ['Collection']
        })
    })
})

export const {useCreateCollectionMutation, useGetCollectionsQuery, useDeleteCollectionMutation} = collectionAPI

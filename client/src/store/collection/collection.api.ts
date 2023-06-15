import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IAuth, IMutationCollection} from '../../models/query'
import {TypeServerCollections, TypeServerResponse} from '../../types/serverTypes'

export const collectionAPI = createApi({
    reducerPath: 'collectionAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/collection'
    }),
    tagTypes: ['Collection'],
    endpoints: build => ({
        createCollection: build.mutation<TypeServerResponse, IMutationCollection>({
            query: (args) => ({
                url: '/',
                method: 'POST',
                body: {userId: args.userId, collectionName: args.collectionName},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            invalidatesTags: ['Collection']
        }),
        getCollections: build.query<TypeServerCollections, IAuth>({
            query: (args) => ({
                url: '/',
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            providesTags: result => ['Collection']
        }),
        deleteCollection: build.mutation<TypeServerResponse, IMutationCollection>({
            query: (args) => ({
                url: '/',
                method: 'DELETE',
                body: {userId: args.userId, collectionName: args.collectionName},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            invalidatesTags: ['Collection']
        })
    })
})

export const {useCreateCollectionMutation, useGetCollectionsQuery, useDeleteCollectionMutation} = collectionAPI

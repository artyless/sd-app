import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IMutationSaveImage, IQueryGetImages, IMutationDeleteImage, IMutationChangePublicity} from '../../models/query'
import {TypeServerImages, TypeServerResponse} from '../../types/serverTypes'

export const imageAPI = createApi({
    reducerPath: 'imageAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/image'
    }),
    tagTypes: ['Image'],
    endpoints: build => ({
        saveImage: build.mutation<TypeServerResponse, IMutationSaveImage>({
            query: (args) => ({
                url: '/',
                method: 'POST',
                body: {
                    userId: args.userId,
                    imageStr: args.imageStr,
                    prompt: args.prompt,
                    collectionName: args.collectionName
                },
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            invalidatesTags: ['Image']
        }),
        getImages: build.query<TypeServerImages, IQueryGetImages>({
            query: (args) => ({
                url: `/${args.collectionName}`,
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            providesTags: result => ['Image']
        }),
        deleteImage: build.mutation<TypeServerResponse, IMutationDeleteImage>({
            query: (args) => ({
                url: '/',
                method: 'DELETE',
                body: {id: args.id},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            invalidatesTags: ['Image']
        }),
        changePublicity: build.mutation<TypeServerResponse, IMutationChangePublicity>({
            query: (args) => ({
                url: '/',
                method: 'PUT',
                body: {image: args.image, bucket: args.bucket},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            invalidatesTags: ['Image']
        })
    })
})

export const {useSaveImageMutation, useGetImagesQuery, useDeleteImageMutation, useChangePublicityMutation} = imageAPI

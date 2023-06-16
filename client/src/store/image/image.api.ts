import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IMutationSaveImage, IQueryGetImages, IMutationDeleteImage, IMutationChangePublicity} from '../../models/query'
import {IImageData} from '../../models/image'

export const imageAPI = createApi({
    reducerPath: 'imageAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/image'
    }),
    tagTypes: ['Image'],
    endpoints: build => ({
        saveImage: build.mutation<string, IMutationSaveImage>({
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
            transformResponse: (response: { message: string }) => response.message,
            invalidatesTags: ['Image']
        }),
        getImages: build.query<IImageData[], IQueryGetImages>({
            query: (args) => ({
                url: `/${args.collectionName}`,
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            transformResponse: (response: { images: IImageData[] }) => response.images,
            providesTags: result => ['Image']
        }),
        deleteImage: build.mutation<string, IMutationDeleteImage>({
            query: (args) => ({
                url: '/',
                method: 'DELETE',
                body: {id: args.id},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            transformResponse: (response: { message: string }) => response.message,
            invalidatesTags: ['Image']
        }),
        changePublicity: build.mutation<string, IMutationChangePublicity>({
            query: (args) => ({
                url: '/',
                method: 'PUT',
                body: {image: args.image, bucket: args.bucket},
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            transformResponse: (response: { message: string }) => response.message,
            invalidatesTags: ['Image']
        })
    })
})

export const {useSaveImageMutation, useGetImagesQuery, useDeleteImageMutation, useChangePublicityMutation} = imageAPI

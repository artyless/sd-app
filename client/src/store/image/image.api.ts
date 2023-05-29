import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const user = localStorage.getItem('userData')
let token = ''

if (user) {
    token = JSON.parse(user).token
}

export const imageAPI = createApi({
    reducerPath: 'imageAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/image'
    }),
    tagTypes: ['Image'],
    endpoints: build => ({
        saveImage: build.mutation<any, any>({
            query: (args) => ({
                url: '/',
                method: 'POST',
                body: args,
                headers: {Authorization: `Bearer ${token}`}
            }),
            invalidatesTags: ['Image']
        }),
        getImages: build.query<any, any>({
            query: (collectionName) => ({
                url: `/${collectionName}`,
                headers: {Authorization: `Bearer ${token}`}
            }),
            providesTags: result => ['Image']
        }),
        // deleteImage: build.mutation<any, any>({
        //     query: (args) => ({
        //         url: '/',
        //         method: 'DELETE',
        //         body: args,
        //         headers: {Authorization: `Bearer ${token}`}
        //     }),
        //     invalidatesTags: ['Image']
        // })
    })
})

export const {useSaveImageMutation, useGetImagesQuery} = imageAPI

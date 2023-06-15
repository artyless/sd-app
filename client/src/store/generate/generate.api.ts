import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {IMutationGenerate} from '../../models/query'
import {IGeneratedResult} from '../../models/generate'

export const generateAPI = createApi({
    reducerPath: 'generateAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/sd'
    }),
    tagTypes: ['Image'],
    endpoints: build => ({
        generateImage: build.mutation<IGeneratedResult, IMutationGenerate>({
            query: (args) => ({
                url: '/txt2img',
                method: 'POST',
                body: {
                    userId: args.userId,
                    promptText: args.promptText,
                    imageCount: args.imageCount,
                    imageSize: args.imageSize
                },
                headers: {Authorization: `Bearer ${args.token}`}
            }),
            invalidatesTags: ['Image']
        })
    })
})

export const {useGenerateImageMutation} = generateAPI

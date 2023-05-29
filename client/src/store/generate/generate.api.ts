import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const user = localStorage.getItem('userData')
let token = ''

if (user) {
    token = JSON.parse(user).token
}

export const generateAPI = createApi({
    reducerPath: 'generateAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/sd'
    }),
    tagTypes: ['Image'],
    endpoints: build => ({
        generateImage: build.mutation<any, any>({
            query: (args) => ({
                url: '/txt2img',
                method: 'POST',
                body: args,
                headers: {Authorization: `Bearer ${token}`}
            }),
            invalidatesTags: ['Image']
        })
    })
})

export const {useGenerateImageMutation} = generateAPI

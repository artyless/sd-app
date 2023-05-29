import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const user = localStorage.getItem('userData')
let token = ''

if (user) {
    token = JSON.parse(user).token
}

export const profileAPI = createApi({
    reducerPath: 'profileAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/profile'
    }),
    tagTypes: ['Profile'],
    endpoints: build => ({
        // типы
        editProfile: build.mutation<any, any>({
            query: (args) => ({
                url: '/',
                method: 'PUT',
                body: args,
                headers: {Authorization: `Bearer ${token}`}
            }),
            invalidatesTags: ['Profile']
        }),
        // типы
        getProfile: build.query<any, any>({
            query: () => ({
                url: '/',
                headers: {Authorization: `Bearer ${token}`}
            }),
            providesTags: result => ['Profile']
        })
    })
})

export const {useGetProfileQuery, useEditProfileMutation} = profileAPI

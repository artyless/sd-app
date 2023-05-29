import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {authAPI} from './auth/auth.api'
import {collectionAPI} from './collection/collection.api'
import {profileAPI} from './profile/profile.api'
import {imageAPI} from './image/image.api'
import {generateAPI} from './generate/generate.api'
import {authReducer} from './auth/auth.slice'

const rootReducer = combineReducers({
    [authAPI.reducerPath]: authAPI.reducer,
    [collectionAPI.reducerPath]: collectionAPI.reducer,
    [profileAPI.reducerPath]: profileAPI.reducer,
    [imageAPI.reducerPath]: imageAPI.reducer,
    [generateAPI.reducerPath]: generateAPI.reducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authAPI.middleware,
        collectionAPI.middleware,
        profileAPI.middleware,
        imageAPI.middleware,
        generateAPI.middleware
    )
})

// setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

// export type RootState = ReturnType<typeof rootReducer>
// export type AppStore = ReturnType<typeof store>
// export type AppDispatch = AppStore['dispatch']

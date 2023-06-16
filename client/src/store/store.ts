import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {authAPI} from './auth/auth.api'
import {collectionAPI} from './collection/collection.api'
import {userAPI} from './user/user.api'
import {imageAPI} from './image/image.api'
import {generateAPI} from './generate/generate.api'
import {searchAPI} from './search/search.api'
import {authReducer} from './auth/auth.slice'

const rootReducer = combineReducers({
    [authAPI.reducerPath]: authAPI.reducer,
    [collectionAPI.reducerPath]: collectionAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [imageAPI.reducerPath]: imageAPI.reducer,
    [generateAPI.reducerPath]: generateAPI.reducer,
    [searchAPI.reducerPath]: searchAPI.reducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authAPI.middleware,
        collectionAPI.middleware,
        userAPI.middleware,
        imageAPI.middleware,
        generateAPI.middleware,
        searchAPI.middleware
    )
})

// setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

// export type RootState = ReturnType<typeof rootReducer>
// export type AppStore = ReturnType<typeof store>
// export type AppDispatch = AppStore['dispatch']

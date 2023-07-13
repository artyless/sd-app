import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IUser} from '../../models/user'

// add localstorage

interface AuthState {
    user: IUser | null
    isLoading: boolean
    error: string
}

// const storedUserData = localStorage.getItem('userData')
// const initialState: AuthState = {
//     user: storedUserData ? JSON.parse(storedUserData) : '',
//     isLoading: false,
//     error: ''
// }

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('userData') ?? 'null'),
    isLoading: false,
    error: ''
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addToLocalStorage(state, action: PayloadAction<IUser>) {
            state.user = action.payload
            localStorage.setItem('userData', JSON.stringify(state.user))
        },
        removeFromLocalStorage(state) {
            state.user = null
            localStorage.setItem('userData', JSON.stringify(state.user))
        }
    }
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer

import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IUser} from '../../models/user'

// add localstorage

interface AuthState {

}

// const initialState: AuthState = {
//
// }

const initialState = {
    user: JSON.parse(localStorage.getItem('userData') ?? ''),
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
            state.user = ''
            localStorage.setItem('userData', JSON.stringify(state.user))
        }
    }
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer

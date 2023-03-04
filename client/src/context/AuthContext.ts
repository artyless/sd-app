import {createContext} from 'react'
import {IContext} from '../models'

export const AuthContext = createContext<IContext>({
    token: null,
    userId: null,
    userName: null,
    userEmail: null,
    login: () => {
    },
    logout: () => {
    },
    isAuthenticated: false
})

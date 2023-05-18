import {createContext} from 'react'
import {IContext} from '../models'

export const AuthContext = createContext<IContext>({
    token: '',
    id: null,
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    createdAt: '',
    login: () => {
    },
    logout: () => {
    },
    isAuthenticated: false
})

import {createContext} from 'react'
import {IContext} from '../../../models/user'

export const AuthContext = createContext<IContext>({
    token: '',
    id: -1,
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    createdAt: new Date,
    login: () => {
    },
    logout: () => {
    },
    isAuthenticated: false
})

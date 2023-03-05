import {createContext} from 'react'
import {IContext} from '../models'

export const AuthContext = createContext<IContext>({
    token: '',
    id: null,
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    sex: 'male' || 'female' || '',
    dob: '',
    login: () => {
    },
    logout: () => {
    },
    isAuthenticated: false
})

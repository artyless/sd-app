import {useState, useCallback, useEffect} from 'react'
import {IUserData} from '../models'

const STORAGE_NAME = 'userData'


// Так нормально??
export const useAuth = (): {
    token: string,
    userData: IUserData,
    login: (jwtToken: string, id: number, userName: string, firstName: string, lastName: string, email: string, sex: 'male' | 'female' | '', dob: string) => void,
    logout: () => void,
    ready: boolean
} => {
    const [userData, setUserData] = useState<IUserData>({
        id: null,
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        sex: '',
        dob: ''
    })
    const [token, setToken] = useState<string>('')
    const [ready, setReady] = useState<boolean>(false)

    const login = useCallback((
        jwtToken: string,
        id: number,
        userName: string,
        firstName: string,
        lastName: string,
        email: string,
        sex: 'male' | 'female' | '',
        dob: string
    ): void => {
        setUserData({
            id: id,
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            sex: sex,
            dob: dob
        })
        setToken(jwtToken)

        localStorage.setItem(STORAGE_NAME, JSON.stringify({
            token: jwtToken,
            id: id,
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            sex: sex,
            dob: dob,
            isAuthenticated: true
        }))
    }, [])

    const logout = useCallback((): void => {
        setUserData({
            id: null,
            userName: '',
            firstName: '',
            lastName: '',
            email: '',
            sex: '',
            dob: ''
        })

        localStorage.removeItem(STORAGE_NAME)
    }, [])

    useEffect(() => {
        const localData: string | null = localStorage.getItem(STORAGE_NAME)

        if (!localData) {
            setReady(true)
            return
        }

        const data = JSON.parse(localData)

        if (data && data.token) {
            login(data.token, data.id, data.userName, data.firstName, data.lastName, data.email, data.sex, data.dob)
        }

        setReady(true)
    }, [login])

    return {token, userData, login, logout, ready}
}

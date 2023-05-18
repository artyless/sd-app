import {useState, useCallback, useEffect} from 'react'
import {IUserData} from '../models'

const STORAGE_NAME = 'userData'

export const useAuth = (): {
    token: string,
    userData: IUserData,
    login: (jwtToken: string, id: number, userName: string, firstName: string, lastName: string, email: string, createdAt: string) => void,
    logout: () => void,
    ready: boolean
} => {
    const [userData, setUserData] = useState<IUserData>({
        id: null,
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        createdAt: ''
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
        createdAt: string
    ): void => {
        setUserData({
            id: id,
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            createdAt: createdAt
        })
        setToken(jwtToken)

        localStorage.setItem(STORAGE_NAME, JSON.stringify({
            token: jwtToken,
            id: id,
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            createdAt: createdAt,
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
            createdAt: ''
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
            login(data.token, data.id, data.userName, data.firstName, data.lastName, data.email, data.createdAt)
        }

        setReady(true)
    }, [login])

    return {token, userData, login, logout, ready}
}

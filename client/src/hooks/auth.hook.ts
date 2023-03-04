import {useState, useCallback, useEffect} from 'react'
import {IUserData} from '../models'

const STORAGE_NAME = 'userData'


// Так нормально??
export const useAuth = (): {
    token: string | null,
    userData: IUserData,
    login: (jwtToken: string, userId: number, userName: string, userEmail: string) => void,
    logout: () => void,
    ready: boolean
} => {
    const [userData, setUserData] = useState<IUserData>({
        userId: null,
        userName: null,
        userEmail: null
    })
    const [token, setToken] = useState<string | null>(null)
    const [ready, setReady] = useState<boolean>(false)

    const login = useCallback((jwtToken: string, userId: number, userName: string, userEmail: string): void => {
        setUserData({
            userId: userId,
            userName: userName,
            userEmail: userEmail
        })
        setToken(jwtToken)

        localStorage.setItem(STORAGE_NAME, JSON.stringify({
            token: jwtToken, userId: userId, userName: userName, userEmail: userEmail, isAuthenticated: true
        }))
    }, [])

    const logout = useCallback((): void => {
        setUserData({
            userId: null,
            userName: null,
            userEmail: null
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
            login(data.token, data.userId, data.userName, data.userEmail)
        }

        setReady(true)
    }, [login])

    return {token, userData, login, logout, ready}
}

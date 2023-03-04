export interface IUser {
    name: string
    email: string
}

export interface IUserData {
    userId: number | null
    userName: string | null
    userEmail: string | null
}

export interface IAuthData {
    token: string
    userCreatedAt: string
    userId: number
    userName: string
    userEmail: string
}

export interface IContext {
    token: string | null
    userId: number | null
    userName: string | null
    userEmail: string | null
    login: (jwtToken: string, userId: number, userName: string, userEmail: string) => void
    logout: () => void
    isAuthenticated: boolean
}

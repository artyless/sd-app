export interface IUserData {
    id: number | null
    userName: string
    firstName: string
    lastName: string
    email: string
    createdAt: string
}

export interface IAuthenticatedUserData extends IUserData {
    token: string
}

// RegistrationPage
export interface IUserRegistrationData {
    userName: string
    firstName: string
    email: string
    password: string
}

// Context
export interface IContext {
    token: string
    id: number | null
    userName: string
    firstName: string
    lastName: string
    email: string
    createdAt: string
    login: (jwtToken: string, id: number, userName: string, firstName: string, lastName: string, email: string, createdAt: string) => void
    logout: () => void
    isAuthenticated: boolean
}

export interface IUserData {
    token?: string
    id?: number
    userName: string
    firstName: string
    lastName?: string
    password?: string
    email: string
    createdAt?: Date
}

// export interface ILoginUserData extends IUserData {
//     token: string
// }

export interface IContext extends IUserData {
    login: (jwtToken: string, id: number, userName: string, firstName: string, lastName: string, email: string, createdAt: Date) => void
    logout: () => void
    isAuthenticated: boolean
}

// export interface IUserRegistrationData {
//     userName: string
//     firstName: string
//     lastName?: string
//     email: string
//     password: string
// }

export interface IUser {
    firstName: string
    email: string
}

export interface IUserData {
    id: number | null
    userName: string
    firstName: string
    lastName: string
    email: string
    sex: "male" | "female" | ""
    dob: string
}

// RegistrationPage
export interface IUserRegistrationData {
    userName: string
    firstName: string
    email: string
    password: string
    sex: 'male' | 'female' | ''
    dob: string
}

export interface IAuthData {
    token: string
    id: number | null
    userName: string
    firstName: string
    lastName: string
    email: string
    sex: 'male' | 'female' | ''
    dob: string
    createdAt: string
}

// Context
export interface IContext {
    token: string
    id: number | null
    userName: string
    firstName: string
    lastName: string
    email: string
    sex: 'male' | 'female' | ''
    dob: string
    login: (jwtToken: string, id: number, userName: string, firstName: string, lastName: string, email: string, sex: 'male' | 'female' | '', dob: string) => void
    logout: () => void
    isAuthenticated: boolean
}

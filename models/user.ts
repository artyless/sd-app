export interface IUser {
    token?: string
    id?: number
    userName: string
    firstName: string
    lastName?: string
    password?: string
    email: string
    createdAt?: Date
}

// export interface ILoginUserData extends IUser {
//     token: string
// }

// export interface IUserRegistrationData {
//     userName: string
//     firstName: string
//     lastName?: string
//     email: string
//     password: string
// }

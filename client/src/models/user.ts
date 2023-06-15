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
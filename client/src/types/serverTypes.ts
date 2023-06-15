import {FetchBaseQueryError} from '@reduxjs/toolkit/dist/query/react'
import {IImageData} from '../models/image'
import {ICollection} from '../models/collection'
import {IUser} from '../models/user'

export type TypeServerResponse = {
    data: {
        message: string
    }
}

export type TypeServerImages = {
    images: IImageData[]
}

export type TypeServerCollections = {
    collections: ICollection[]
}

export type TypeServerUser = {
    user: IUser
}

export type TypeServerError = {
    data: {
        message: string
    }
} & FetchBaseQueryError

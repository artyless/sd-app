import {FetchBaseQueryError} from '@reduxjs/toolkit/dist/query/react'

export type TypeServerError = {
    data: {
        message: string
    }
} & FetchBaseQueryError

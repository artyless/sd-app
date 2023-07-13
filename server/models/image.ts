import {ICollection} from './collection.js'

export interface IImage {
    id: number
    prompt: string
    promptRu: string
    storageAddress: string
    searchId: string | null
    published: boolean
    likeCount: number
    createdAt: Date
    collectionId: number
    userId: number
}

export interface IImageData {
    data: IImage
    imageStr: string
}

export interface IImageCollection extends IImage {
    Collection: Pick<ICollection, 'bucket'>
}

export interface IImageSearch {
    userId: number
    prompt: string
    promptRu: string
    bucket: string
    storageAddress: string
}

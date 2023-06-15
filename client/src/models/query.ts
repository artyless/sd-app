import {IUser} from './user'
import {ICollection} from './collection'
import {IImage, IImageData} from './image'
import {IGenerateParams} from "./generate"

export interface IAuth {
    token: IUser['token']
}

// IMAGE
export interface IMutationSaveImage extends IAuth {
    userId: IUser['id']
    imageStr: IImageData['imageStr']
    prompt: IImage['prompt']
    collectionName: ICollection['title']
}

export interface IQueryGetImages extends IAuth {
    collectionName: ICollection['title']
}

export interface IMutationDeleteImage extends IAuth {
    id: IImage['id']
}

export interface IMutationChangePublicity extends IAuth {
    image: IImage
    bucket: ICollection['bucket']
}

// COLLECTION
export interface IMutationCollection extends IAuth {
    userId: IUser['id']
    collectionName: ICollection['title']
}

// GENERATE
export interface IMutationGenerate extends IAuth {
    userId: IUser['id']
    promptText: IGenerateParams['prompt']
    imageCount: IGenerateParams['n_iter']
    imageSize: IGenerateParams['width']
}

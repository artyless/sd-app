import {v4 as uuidv4} from 'uuid'

export const generateUniqueFileName = (fileName: string): string => {
    const preparedStr = fileName.replace(' ', '').toLowerCase()
    const uniqueStr = uuidv4()
    return `${preparedStr}-${uniqueStr}`
}

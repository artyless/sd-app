import {useCallback} from 'react'

export const useMessage = () => {
    return useCallback((text: string) => {
        if (text) {
            alert(text)
        }
    }, [])
}

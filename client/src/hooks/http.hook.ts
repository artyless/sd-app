import {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    // Исправить типы Typescript !!!!!
    const request = useCallback(async <T>(
        url: string,
        method: 'GET' | 'POST' = 'GET',
        // body: Record<string, any> | null = null,
        body: any | null = null,
        headers: Record<string, string> = {}
    ): Promise<T> => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            const response = await fetch(url, {method, body, headers})
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong')
            }

            setLoading(false)

            return data
        } catch (e: any) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {request, loading, error, clearError}
}

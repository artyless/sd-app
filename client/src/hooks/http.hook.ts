import {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const request = useCallback(async <T>(
        url: string,
        method: 'GET' | 'POST' | 'DELETE' = 'GET',
        // body: Record<string, any> | null = null,
        body: any | null = null,
        headers: Record<string, string> = {}
    ) => {
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
        } catch (err: any) {
            setLoading(false)
            setError(err.message)
            throw err
        }
    }, [])

    const clearError = useCallback(() => setError(''), [])

    return {request, loading, error, clearError}
}

import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'
import {IAuthData} from '../models'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const {request, loading, error, clearError} = useHttp()
    const message = useMessage()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setForm({...form, [event.target.id]: event.target.value})
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form}) as IAuthData
            auth.login(data.token, data.userId, data.userName, data.userEmail)
        } catch (e) {
        }
    }

    return (
        <div>
            <h1>Auth</h1>

            <div>
                <input
                    placeholder="Email"
                    id="email"
                    type="email"
                    onChange={changeHandler}
                />
                <input
                    placeholder="Password"
                    id="password"
                    type="password"
                    onChange={changeHandler}
                />
            </div>

            <div>
                <button
                    onClick={loginHandler}
                    disabled={loading}
                >
                    Login
                </button>
                <a href="/register">Registration</a>
            </div>
        </div>
    )
}

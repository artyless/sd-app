import React, {useEffect, useState} from 'react'
import {useMessage} from '../hooks/message.hook'
import {Link} from 'react-router-dom'
import {useLoginMutation} from '../store/auth/auth.api'
import {useActions} from '../hooks/actions'
import {TypeServerError} from '../types/serverError'

export const AuthPage = () => {
    const [login, {isLoading, error}] = useLoginMutation()
    const {addToLocalStorage} = useActions()
    const message = useMessage()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    // добавить проверку на корректность form

    const loginHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        try {
            const response = await login({...form})

            if ('data' in response) {
                addToLocalStorage(response.data)
            }
        } catch (err) {
            console.error('ERROR: ', err)
        }
    }

    useEffect(() => {
        if (error) {
            const serverError = error as TypeServerError
            message(serverError.data.message)
        }
    }, [error])

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setForm({...form, [event.target.id]: event.target.value})
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
                    disabled={isLoading}
                >
                    Login
                </button>
                <Link to="/register">Registration</Link>
            </div>
        </div>
    )
}

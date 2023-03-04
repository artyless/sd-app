import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'
import {IAuthData} from '../models'

export const RegistrationPage = () => {
    const auth = useContext(AuthContext)
    const {request, loading, error, clearError} = useHttp()
    const message = useMessage()
    const [form, setForm] = useState({
        name: '',
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

    const registerHandler = async () => {
        try {
            await request('/api/auth/register', 'POST', {...form})
        } catch (e) {
        }
    }

    return (
        <div>
            <h1>Registration</h1>

            <div>
                <input
                    placeholder="Name"
                    id="name"
                    type="text"
                    onChange={changeHandler}
                />
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
                <input
                    placeholder="Repeat password"
                    id="password"
                    type="password"
                    onChange={changeHandler}
                />

                <div>
                    Пол?
                    <input type="checkbox"/>
                    <input type="checkbox"/>
                </div>
                
                <div>
                    date of birth
                    <input type="date"/>
                </div>
            </div>

            <div>
                {/*<button*/}
                {/*    onClick={loginHandler}*/}
                {/*    disabled={loading}*/}
                {/*>*/}
                {/*    Login*/}
                {/*</button>*/}
                <button
                    onClick={registerHandler}
                    disabled={loading}
                >
                    Registration
                </button>
                <a href="/login">Return</a>
            </div>
        </div>
    )
}

import React, {useEffect, useState} from 'react'
import {useMessage} from '../hooks/message.hook'
import {IUserData} from '../../../models/user'
import {Link} from 'react-router-dom'
import {useRegisterMutation} from '../store/auth/auth.api'
import {TypeServerError} from "../types/serverError"

export const RegistrationPage = () => {
    const [register, {isLoading, error}] = useRegisterMutation()
    const message = useMessage()
    const [form, setForm] = useState<IUserData>({
        userName: '',
        firstName: '',
        email: '',
        password: ''
    })
    // const [isRegistrationDataOkay, setIsRegistrationDataOkay] = useState<boolean>(true)

    useEffect(() => {
        if (error) {
            const serverError = error as TypeServerError
            message(serverError.data.message)
        }
    }, [error])

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setForm({...form, [event.target.id]: event.target.value})
        // for (const key in form) {
        //     if (form[key]) {
        //         setIsRegistrationDataOkay(true)
        //         return
        //     }
        // }
        // setIsRegistrationDataOkay(false)
    }

    const registerHandler = async () => {
        try {
            const response = await register({...form})

            // TODO
            // ТУТ ПОЛЬЗОВАТЕЛЯ ДОЛЖНО ЗАКИДЫВАТЬ В СИСТЕМУ И У НЕГО УЖЕ БУДЕТ ID
            // if(data.message === 'User created') {
            //     await request('/api/collection/create', 'POST', {
            //         id: auth.id,
            //         collectionName: 'Saved'
            //     }, {Authorization: `Bearer ${auth.token}`})
            // }
        } catch (err) {
            console.error('ERROR: ', err)
        }
    }

    return (
        <div>
            <h1>Registration</h1>

            <div>
                <input
                    placeholder="Username"
                    id="userName"
                    type="text"
                    onChange={changeHandler}
                />
                <input
                    placeholder="First name"
                    id="firstName"
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
                    id="repeatPassword"
                    type="password"
                    onChange={changeHandler}
                />
            </div>

            <div>
                <button
                    onClick={registerHandler}
                    disabled={isLoading}
                >
                    Registration
                </button>
                <Link to="/login">Return</Link>
            </div>
        </div>
    )
}

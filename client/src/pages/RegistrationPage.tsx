import React, {useEffect, useState} from 'react'
import {useMessage} from '../hooks/message.hook'
import {IUser} from '../models/user'
import {Link} from 'react-router-dom'
import {useRegisterMutation} from '../store/auth/auth.api'
import {TypeServerError} from '../types/serverTypes'

export const RegistrationPage = () => {
    const [register, {isLoading, error}] = useRegisterMutation()
    const message = useMessage()
    const [form, setForm] = useState<IUser>({
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
        <div className='container center'>
            <div className="wrapper">
                <div className="center-vertical">
                    <h1 className="margin-bottom-40">Sign Up</h1>
                </div>

                <div>
                    <input
                        placeholder="Username"
                        id="userName"
                        type="text"
                        onChange={changeHandler}
                        className='input'
                    />
                    <input
                        placeholder="First name"
                        id="firstName"
                        type="text"
                        onChange={changeHandler}
                        className='input'
                    />
                    <input
                        placeholder="Email"
                        id="email"
                        type="email"
                        onChange={changeHandler}
                        className='input'
                    />
                    <input
                        placeholder="Password"
                        id="password"
                        type="password"
                        onChange={changeHandler}
                        className='input'
                    />
                    <input
                        placeholder="Repeat password"
                        id="repeatPassword"
                        type="password"
                        onChange={changeHandler}
                        className='input'
                    />
                    <div className="margin-bottom-20"></div>
                </div>

                <div>
                    <button
                        onClick={registerHandler}
                        disabled={isLoading}

                        className='button large'
                    >
                        Sign Up
                    </button>
                    <div className="margin-bottom-10"></div>
                    <div className="horizontal-line"></div>
                    <div className="margin-bottom-10"></div>
                    <div className="center-vertical">
                        <Link to="/login">I already have account</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'
import {IUserRegistrationData} from '../models'
import {Link} from 'react-router-dom'

export const RegistrationPage = () => {
    const auth = useContext(AuthContext)
    const {request, loading, error, clearError} = useHttp()
    const message = useMessage()
    const [form, setForm] = useState<IUserRegistrationData>({
        userName: '',
        firstName: '',
        email: '',
        password: '',
        sex: '',
        dob: ''
    })
    // const [isRegistrationDataOkay, setIsRegistrationDataOkay] = useState<boolean>(true)

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

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
            console.log({...form})
            const data = await request('/api/auth/register', 'POST', {...form})
        } catch (e) {
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

                <div>
                    Sex:
                    <input id="sex" type="radio" name="sex" value="male" onChange={changeHandler}/>
                    Male
                    <input id="sex" type="radio" name="sex" value="female" onChange={changeHandler}/>
                    Female
                    <input id="sex" type="radio" name="sex" value="" onChange={changeHandler}/>
                    Do not specify
                </div>

                <div>
                    Date of birth:
                    <input id="dob" type="date" onChange={changeHandler}/>
                </div>
            </div>

            <div>
                <button
                    onClick={registerHandler}
                    disabled={loading}
                >
                    Registration
                </button>
                <Link to="/login">Return</Link>
            </div>
        </div>
    )
}

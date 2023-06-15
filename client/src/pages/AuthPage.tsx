import React, {useEffect, useState} from 'react'
import {useMessage} from '../hooks/message.hook'
import {Link} from 'react-router-dom'
import {useLoginMutation} from '../store/auth/auth.api'
import {useActions} from '../hooks/actions'
import {TypeServerError} from '../types/serverTypes'
import {validateEmail, validatePassword} from '../utils/validators'
import '../styles/scss/index.scss'
import '../styles/scss/layout.scss'
import '../styles/scss/button.scss'
import '../styles/scss/input.scss'

export const AuthPage = () => {
    const [login, {isLoading, error}] = useLoginMutation()
    const {addToLocalStorage} = useActions()
    const message = useMessage()
    const [isFirstLoginAttempt, setIsFirstLoginAttempt] = useState<boolean>(true)
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true)
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const loginHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (isFirstLoginAttempt) {
            setIsFirstLoginAttempt(false)
            setIsEmailValid(validateEmail(form.email))
            setIsPasswordValid(validatePassword(form.password))
        }

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

        if (!isFirstLoginAttempt) {
            console.log(form)
            setIsEmailValid(validateEmail(form.email))
            setIsPasswordValid(validatePassword(form.password))
        }
    }

    return (
        <div className="container center">
            <div className="wrapper">
                <div className="center-vertical">
                    <h1 className="margin-bottom-40">Sign In</h1>
                </div>

                <div>
                    <input
                        placeholder="Email"
                        id="email"
                        type="email"
                        onChange={changeHandler}
                        className={isEmailValid ? 'input' : 'input error'}
                        disabled={isLoading}
                    />
                    {/*{!validateEmail(form.email) && <p className="error-message">Enter valid email</p>}*/}

                    <input
                        placeholder="Password"
                        id="password"
                        type="password"
                        onChange={changeHandler}
                        className={isPasswordValid ? 'input' : 'input error'}
                        disabled={isLoading}
                    />
                    {/*{!validatePassword(form.password) && <p className='error-message'>Enter password longer 6 symbols</p>}*/}
                    <div className="margin-bottom-20"></div>
                </div>

                <div>
                    <button
                        onClick={loginHandler}
                        disabled={isLoading}
                        className="button large"
                    >
                        Sign In
                    </button>
                    <div className="margin-bottom-10"></div>
                    <div className="horizontal-line"></div>
                    <div className="margin-bottom-10"></div>
                    <div className="center-vertical">
                        <Link to="/register">I don't have account</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

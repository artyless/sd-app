import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

const STORAGE_NAME = 'userData'

export const ProfilePage = () => {
    const auth = useContext(AuthContext)
    const {request, loading, error, clearError} = useHttp()
    const message = useMessage()
    const [isEdit, setIsEdit] = useState<boolean>(false)

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    // ИЛИ ИСПОЛЬЗОВАТЬ IUserData
    const [form, setForm] = useState({
        userName: `${auth.userName}`,
        firstName: `${auth.firstName}`,
        lastName: `${auth.lastName}`,
        email: `${auth.email}`,
        sex: `${auth.sex}`,
        dob: `${auth.dob}`
        // createdAt: `${auth.createdAt}`
    })

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setForm({...form, [event.target.id]: event.target.value})
    }

    const editUserProfile = async () => {
        try {
            const data: any = await request('/api/profile/', 'POST', {id: auth.id, ...form}, {Authorization: `Bearer ${auth.token}`})
            if (data) {
                auth.userName = data.userName
                auth.firstName = data.firstName
                auth.lastName = data.lastName
                auth.email = data.email
                auth.sex = data.sex
                auth.dob = data.dob

                localStorage.setItem(STORAGE_NAME, JSON.stringify({
                    token: auth.token,
                    id: auth.id,
                    userName: data.userName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    sex: data.sex,
                    dob: data.dob,
                    isAuthenticated: true
                }))
                setIsEdit(false)
            }
        } catch (e) {
        }
    }

    return (
        <div>
            <h1>Profile</h1>
            <div>
                <div>
                    <p><b>Username:</b></p>
                    {
                        isEdit ?
                            <input
                                type="text"
                                id="userName"
                                value={form.userName}
                                disabled={loading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{auth.userName}</div>
                    }
                </div>

                <div>
                    <p><b>First name:</b></p>
                    {
                        isEdit ?
                            <input
                                type="text"
                                id="firstName"
                                value={form.firstName}
                                disabled={loading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{auth.firstName}</div>
                    }
                </div>

                <div>
                    <p><b>Last name:</b></p>
                    {
                        isEdit ?
                            <input
                                type="text"
                                id="lastName"
                                value={form.lastName}
                                disabled={loading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{auth.lastName}</div>
                    }
                </div>

                <div>
                    <p><b>Email:</b></p>
                    {
                        isEdit ?
                            <input
                                type="email"
                                id="email"
                                value={form.email}
                                disabled={loading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{auth.email}</div>
                    }
                </div>

                <div>
                    <p><b>Sex:</b></p>
                    {
                        isEdit ?
                            <>
                                <input
                                    type="radio"
                                    id="sex"
                                    name="sex"
                                    value="male"
                                    disabled={loading}
                                    onChange={changeHandler}
                                />
                                <input
                                    type="radio"
                                    id="sex"
                                    name="sex"
                                    value="female"
                                    disabled={loading}
                                    onChange={changeHandler}
                                />
                                <input
                                    type="radio"
                                    id="sex"
                                    name="sex"
                                    value=""
                                    disabled={loading}
                                    onChange={changeHandler}
                                />
                            </>
                            :
                            <div>{auth.sex}</div>
                    }
                </div>

                <div>
                    <p><b>Date of birth:</b></p>
                    {
                        isEdit ?
                            <input
                                type="date"
                                id="dob"
                                value={form.dob}
                                disabled={loading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{auth.dob}</div>
                    }
                </div>

                <div>
                    <p><b>Created at:</b></p>
                    {/*<div>{auth.createdAt}</div>*/}
                </div>
            </div>


            <div>
                <button onClick={() => setIsEdit(prev => !prev)}>
                    {
                        isEdit ?
                            'Cancel'
                            :
                            'Edit data'
                    }
                </button>
                {
                    isEdit &&
                  <button onClick={editUserProfile}>Change data</button>
                }
                {/*{isEdit && <button onClick={changePasswordHandler}>Change password</button>}*/}
            </div>
        </div>
    )
}

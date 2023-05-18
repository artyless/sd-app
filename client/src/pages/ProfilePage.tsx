import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {IUserData} from "../models"

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

    const [userData, setUserData] = useState<IUserData>({
        id: auth.id,
        userName: `${auth.userName}`,
        firstName: `${auth.firstName}`,
        lastName: `${auth.lastName}`,
        email: `${auth.email}`,
        createdAt: `${auth.createdAt}`
    })

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserData({...userData, [event.target.id]: event.target.value})
    }

    const editUserProfile = async () => {
        try {
            const data: any = await request('/api/profile/', 'POST', {...userData}, {Authorization: `Bearer ${auth.token}`})
            if (data) {
                auth.userName = data.userName
                auth.firstName = data.firstName
                auth.lastName = data.lastName
                auth.email = data.email

                localStorage.setItem(STORAGE_NAME, JSON.stringify({
                    token: auth.token,
                    id: auth.id,
                    userName: data.userName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    createdAt: data.createdAt,
                    isAuthenticated: true
                }))
                setIsEdit(false)
            }
        } catch (e) {
        }
    }

    return (
        <div>

            <div>
                <div>
                    <p><b>Username:</b></p>
                    {
                        isEdit ?
                            <input
                                type="text"
                                id="userName"
                                value={auth.userName}
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
                                value={auth.firstName}
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
                                value={auth.lastName}
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
                                value={auth.email}
                                disabled={loading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{auth.email}</div>
                    }
                </div>

                <div>
                    <p><b>Created at:</b></p>
                    <div>{auth.createdAt}</div>
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

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
        name: `${auth.userName}`,
        email: `${auth.userEmail}`
    })

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setForm({...form, [event.target.id]: event.target.value})
    }

    const editUserProfile = async () => {
        try {
            const data:any = await request('/api/profile/', 'POST', {userId: auth.userId, ...form}, {Authorization: `Bearer ${auth.token}`})
            if (data) {
                auth.userName = data.userName
                auth.userEmail = data.userEmail

                localStorage.setItem(STORAGE_NAME, JSON.stringify({
                    token: auth.token,
                    userId: auth.userId,
                    userName: data.userName,
                    userEmail: data.userEmail,
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
                    <p><b>Name:</b></p>
                    {
                        isEdit ?
                            <input
                                type="text"
                                id="name"
                                value={form.name}
                                disabled={loading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{auth.userName}</div>
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
                            <div>{auth.userEmail}</div>
                    }
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

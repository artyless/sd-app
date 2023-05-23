import React, {useContext, useEffect, useRef, useState} from 'react'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {IUserData} from '../models'
import '../styles/css/pop-up.css'
import '../styles/css/collection.css'

const STORAGE_NAME = 'userData'

export const ProfilePage = () => {
    const auth = useContext(AuthContext)
    const {request, loading, error, clearError} = useHttp()
    const message = useMessage()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [collections, setCollections] = useState<any>('')
    const [collectionName, setCollectionName] = useState<string>('')
    const [images, setImages] = useState<any>('')
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false)
    const popupRef = useRef(null)

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        const handleGetCollections = async () => {
            try {
                const response: any = await request('/api/collection/', 'GET', null, {Authorization: `Bearer ${auth.token}`})

                if (response) {
                    setCollections(response.data)
                }
            } catch (e) {
            }
        }

        handleGetCollections().then()
    }, [])

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

    const createCollection = async () => {
        try {
            const data = await request('/api/collection/create', 'POST', {
                id: auth.id,
                collectionName: collectionName
            }, {Authorization: `Bearer ${auth.token}`})
            console.log(data)
        } catch (e) {
        }
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

    const handleGetImages = async (collection: string) => {
        try {
            const response: any = await request('/api/image/', 'POST', {
                id: auth.id,
                collectionName: collection
            }, {Authorization: `Bearer ${auth.token}`})

            if (response) {
                setImages(response.images)
            }
        } catch (e) {
        }
    }

    const openPopup = () => {
        setIsPopUpOpen(true)
    }

    const closePopup = () => {
        setIsPopUpOpen(false)
    }

    const changeCollectionHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setCollectionName(event.target.value)
    }

    const deleteCollection = async (collection: string) => {
        try {
            const response = await request('/api/collection/delete', 'POST', {
                    id: auth.id,
                    collectionName: collection
                },
                {Authorization: `Bearer ${auth.token}`})
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
            </div>

            <div>
                <button onClick={openPopup}>OPEN POP UP</button>
                {
                    isPopUpOpen &&
                  <div className={`popup ${isPopUpOpen ? 'open' : ''}`} ref={popupRef}>
                    <div>
                      <span>TITLE</span>
                      <input
                        type="text"
                        id="collection"
                        disabled={loading}
                        onChange={changeCollectionHandler}
                      />
                    </div>
                    <button onClick={createCollection}>CREATE COLLECTION</button>
                    <button onClick={closePopup}>CLOSE POP UP</button>
                  </div>
                }
            </div>

            <div>
                {collections && collections.map((collection: any, index: number) => (
                    <div key={index} className="collection">
                        <div onClick={() => handleGetImages(collection.title)}>{collection.title}</div>
                        <div>{collection.amountImages > 0 ? collection.amountImages : 0}</div>
                        <button onClick={() => deleteCollection(collection.title)}>Delete</button>
                    </div>
                ))}
            </div>

            <div>
                {images && images.map((img:any) => (
                        <img key={img.data.id} src={`data:image/png;base64,${img.imageStr}`} alt="Generated image"/>
                    )
                )}
            </div>
        </div>
    )
}

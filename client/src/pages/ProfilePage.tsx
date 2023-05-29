import React, {useEffect, useRef, useState} from 'react'
import {useMessage} from '../hooks/message.hook'
import {IUserData} from '../../../models/user'
import '../styles/css/pop-up.css'
import '../styles/css/collection.css'
import {
    useCreateCollectionMutation,
    useDeleteCollectionMutation,
    useGetCollectionsQuery
} from '../store/collection/collection.api'
import {useAppSelector} from '../hooks/redux'
import {useGetProfileQuery} from '../store/profile/profile.api'
import {useGetImagesQuery} from '../store/image/image.api'

export const ProfilePage = () => {
    const {user} = useAppSelector(state => state.auth)
    const message = useMessage()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [collections, setCollections] = useState<any>('')
    const [collectionName, setCollectionName] = useState<string>('')
    const [images, setImages] = useState<any>('')
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false)
    const popupRef = useRef(null)

    const [createCollection] = useCreateCollectionMutation()
    const [deleteCollection, {isLoading, error}] = useDeleteCollectionMutation()
    const {data: imagesResponse} = useGetImagesQuery('Saved')
    const {data: profileResponse} = useGetProfileQuery('')
    const {data: collectionResponse} = useGetCollectionsQuery('')

    useEffect(() => {
        if (collectionResponse) {
            setCollections(collectionResponse.data)
        }

        if (profileResponse) {

        }

        if (imagesResponse) {
            setImages(imagesResponse.images)
        }
    }, [collectionResponse, profileResponse, imagesResponse])

    const [userData, setUserData] = useState<IUserData>({
        id: user.id,
        userName: `${user.userName}`,
        firstName: `${user.firstName}`,
        lastName: `${user.lastName}`,
        email: `${user.email}`,
        createdAt: user.createdAt
    })

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserData({...userData, [event.target.id]: event.target.value})
    }

    const createCollectionHandler = async () => {
        try {
            // const data = await request('/api/collection/', 'POST', {
            //     id: auth.id,
            //     collectionName: collectionName
            // }, {Authorization: `Bearer ${auth.token}`})

            const response = await createCollection({id: user.id, collectionName: collectionName})
        } catch (err) {
            console.error('ERROR: ', err)
        }
    }

    const editUserProfile = async () => {
        try {
            // const data: any = await request('/api/profile/', 'POST', {...userData}, {Authorization: `Bearer ${auth.token}`})
            // if (data) {
            //     auth.userName = data.userName
            //     auth.firstName = data.firstName
            //     auth.lastName = data.lastName
            //     auth.email = data.email
            //
            //     localStorage.setItem(STORAGE_NAME, JSON.stringify({
            //         token: auth.token,
            //         id: auth.id,
            //         userName: data.userName,
            //         firstName: data.firstName,
            //         lastName: data.lastName,
            //         email: data.email,
            //         createdAt: data.createdAt,
            //         isAuthenticated: true
            //     }))
            //     setIsEdit(false)
            // }
        } catch (err) {
        }
    }

    const handleGetImages = async (collection: string) => {
        try {
            // const response: any = await request(`/api/image/${encodeURIComponent(collection)}`, 'GET', null, {Authorization: `Bearer ${user.token}`})

            // if (response) {
            //     setImages(response.images)
            // }
        } catch (err) {
            console.error('ERROR: ', err)
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

    const deleteCollectionHandler = async (collection: string) => {
        try {
            const response = await deleteCollection({
                id: user.id,
                collectionName: collection
            })
        } catch (err) {
            console.error('ERROR: ', err)
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
                                value={user.userName}
                                disabled={isLoading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{user.userName}</div>
                    }
                </div>

                <div>
                    <p><b>First name:</b></p>
                    {
                        isEdit ?
                            <input
                                type="text"
                                id="firstName"
                                value={user.firstName}
                                disabled={isLoading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{user.firstName}</div>
                    }
                </div>

                <div>
                    <p><b>Last name:</b></p>
                    {
                        isEdit ?
                            <input
                                type="text"
                                id="lastName"
                                value={user.lastName}
                                disabled={isLoading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{user.lastName}</div>
                    }
                </div>

                <div>
                    <p><b>Email:</b></p>
                    {
                        isEdit ?
                            <input
                                type="email"
                                id="email"
                                value={user.email}
                                disabled={isLoading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{user.email}</div>
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
                        disabled={isLoading}
                        onChange={changeCollectionHandler}
                      />
                    </div>
                    <button onClick={createCollectionHandler}>CREATE COLLECTION</button>
                    <button onClick={closePopup}>CLOSE POP UP</button>
                  </div>
                }
            </div>

            <div>
                {collections && collections.map((collection: any, index: number) => (
                    <div key={index} className="collection">
                        <div onClick={() => handleGetImages(collection.title)}>{collection.title}</div>
                        <div>{collection.amountImages > 0 ? collection.amountImages : 0}</div>
                        <button onClick={() => deleteCollectionHandler(collection.title)}>Delete</button>
                    </div>
                ))}
            </div>

            <div>
                {images && images.map((img: any) => (
                        <img key={img.data.id} src={`data:image/png;base64,${img.imageStr}`} alt="Generated image"/>
                    )
                )}
            </div>
        </div>
    )
}

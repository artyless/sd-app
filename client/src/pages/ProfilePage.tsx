import React, {useEffect, useRef, useState} from 'react'
import {useMessage} from '../hooks/message.hook'
import {useActions} from '../hooks/actions'
import {
    useCreateCollectionMutation,
    useDeleteCollectionMutation,
    useGetCollectionsQuery
} from '../store/collection/collection.api'
import {useAppSelector} from '../hooks/redux'
import {useGetUserQuery} from '../store/user/user.api'
import {useChangePublicityMutation, useDeleteImageMutation, useGetImagesQuery} from '../store/image/image.api'
import {IUser} from '../models/user'
import {IImage, IImageData} from '../models/image'
import {ICollection} from '../models/collection'
import '../styles/css/pop-up.css'
import '../styles/css/collection.css'

export const ProfilePage = () => {
    const {user} = useAppSelector(state => state.auth)
    const message = useMessage()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [collections, setCollections] = useState<ICollection[]>()
    const [collectionName, setCollectionName] = useState<ICollection['title']>('')
    const [images, setImages] = useState<IImageData[]>()
    const [userInfo, setUserInfo] = useState<IUser>()
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false)
    const popupRef = useRef(null)
    const [gridType, setGridType] = useState<'grid3' | 'grid4'>('grid3')

    const {data: imagesResponse} = useGetImagesQuery({collectionName: 'Saved', token: user.token})
    const {data: userResponse} = useGetUserQuery({token: user.token})
    const {data: collectionResponse, refetch: refetchCollections} = useGetCollectionsQuery({token: user.token})
    const [createCollection] = useCreateCollectionMutation()
    const [deleteCollection, {isLoading, error}] = useDeleteCollectionMutation()
    const [deleteImage, {isSuccess: isDeleteSuccess}] = useDeleteImageMutation()
    const [changePublicity] = useChangePublicityMutation()
    const {removeFromLocalStorage} = useActions()

    useEffect(() => {
        if (collectionResponse) {
            setCollections(collectionResponse)
        }

        if (userResponse) {
            setUserInfo(userResponse)
        }

        if (imagesResponse) {
            setImages(imagesResponse)
        }

        if (isDeleteSuccess) {
            refetchCollections()
        }
    }, [collectionResponse, userResponse, imagesResponse, isDeleteSuccess])

    const [userData, setUserData] = useState<IUser>({
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

    const handleGridTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGridType(event.target.value as 'grid3' | 'grid4')
    }

    const createCollectionHandler = async () => {
        try {
            const response = await createCollection({
                userId: user.id,
                collectionName: collectionName,
                token: user.token
            })
        } catch (err) {
            console.error('ERROR: ', err)
        }
    }

    const editUserProfile = async () => {
        try {
            // const data = await request('/api/profile/', 'POST', {...userData}, {Authorization: `Bearer ${auth.token}`})
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
            // const response = await request(`/api/image/${encodeURIComponent(collection)}`, 'GET', null, {Authorization: `Bearer ${user.token}`})

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
                userId: user.id,
                collectionName: collection,
                token: user.token
            })
        } catch (err) {
            console.error('ERROR: ', err)
        }
    }

    const deleteImageHandler = async (id: number) => {
        try {
            const response = await deleteImage({id: id, token: user.token})
        } catch (err) {
            console.error('ERROR: ', err)
        }
    }

    const publicityHandler = async (image: IImage, bucket: string) => {
        try {
            const response = await changePublicity({image, bucket, token: user.token})
        } catch (err) {
            console.error('ERROR: ', err)
        }
    }

    return (
        <div className="container">
            {
                userInfo &&
              <div>
                <div>
                    {
                        isEdit ?
                            <input
                                className="input"
                                type="text"
                                id="userName"
                                value={userInfo.userName}
                                disabled={isLoading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{userInfo.userName}</div>
                    }
                </div>

                <div>
                    {
                        isEdit ?
                            <input
                                className="input"
                                type="text"
                                id="firstName"
                                value={userInfo.firstName}
                                disabled={isLoading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{userInfo.firstName}</div>
                    }
                </div>

                <div>
                    {
                        isEdit ?
                            <input
                                className="input"
                                type="text"
                                id="lastName"
                                value={userInfo.lastName}
                                disabled={isLoading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{userInfo.lastName}</div>
                    }
                </div>

                <div>
                    {
                        isEdit ?
                            <input
                                className="input"
                                type="email"
                                id="email"
                                value={userInfo.email}
                                disabled={isLoading}
                                onChange={changeHandler}
                            />
                            :
                            <div>{userInfo.email}</div>
                    }
                </div>

                <div>
                  <p><b>You with us XX days already</b></p>
                    {/*<div>{userInfo.createdAt}</div>*/}
                </div>
              </div>
            }

            <div>
                <button className="button" onClick={() => setIsEdit(prev => !prev)}>
                    {
                        isEdit ?
                            'Cancel'
                            :
                            'Edit data'
                    }
                </button>
                {
                    isEdit &&
                  <button className="button" onClick={editUserProfile}>Change data</button>
                }
            </div>

            <button onClick={() => removeFromLocalStorage()} className="button">
                Logout
                <svg className="test" fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1"
                     xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                     viewBox="0 0 490.3 490.3" xmlSpace="preserve">
                    <g>
                        <g>
                            <path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3
			s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6
			c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1
			C27.9,58.95,0,86.75,0,121.05z"/>
                            <path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9
			c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63
			C380.6,325.15,380.6,332.95,385.4,337.65z"/>
                        </g>
                    </g>
                </svg>
            </button>

            <div>
                <button onClick={openPopup}>Create collection</button>
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
                {collections && collections.map((collection: ICollection, index: number) => (
                    <div key={index} className="collection">
                        <div onClick={() => handleGetImages(collection.title)}>{collection.title}</div>
                        <div>{collection.amountImages > 0 ? collection.amountImages : 0}</div>
                        {/*<button onClick={() => deleteCollectionHandler(collection.title)}>Delete</button>*/}
                    </div>
                ))}
            </div>

            <div className="grid-type-selector">
                <label>
                    <input
                        type="radio"
                        value="grid3"
                        checked={gridType === 'grid3'}
                        onChange={handleGridTypeChange}
                    />
                    3
                </label>
                <label>
                    <input
                        type="radio"
                        value="grid4"
                        checked={gridType === 'grid4'}
                        onChange={handleGridTypeChange}
                    />
                    4
                </label>
            </div>

            <div className={`image-grid ${gridType}`}>
                {images && collections && images.map((img: IImageData) => (
                    <div key={img.data.id} className="image-grid-item">
                        <img src={`data:image/png;base64,${img.imageStr}`} alt="image"/>
                        <div className="image-overlay">
                            <p>{img.data.prompt}</p>
                            {
                                img.data.published ?
                                    <div>public</div>
                                    :
                                    <div>private</div>
                            }
                            <button className="button"
                                    onClick={() => publicityHandler(img.data, collections[0].bucket)}>Publish
                            </button>
                            <button className="like-button">Download</button>
                            <button className="like-button" onClick={() => deleteImageHandler(img.data.id)}>Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

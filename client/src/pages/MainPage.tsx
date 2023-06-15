import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react'
import {useAppSelector} from '../hooks/redux'
import {ScrollToTopButton} from '../components/ScrollToTop'
import {useGetImagesQuery, useSaveImageMutation} from '../store/image/image.api'
import {useHttp} from "../hooks/http.hook"
import {IImageData} from '../models/image'
import '../styles/css/search.css'
import '../styles/css/grid-type-selector.css'
import '../styles/css/image-grid.css'
import '../styles/css/index.css'

export const MainPage = () => {
    const {user} = useAppSelector(state => state.auth)
    const [images, setImages] = useState<IImageData[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [gridType, setGridType] = useState<'grid3' | 'grid4'>('grid3')
    const [saveImage] = useSaveImageMutation()
    // TODO выполнять только при первой загрузке страницы
    const {data: imagesResponse} = useGetImagesQuery({collectionName: '', token: user.token})

    useEffect(() => {
        if (imagesResponse) {
            setImages(imagesResponse.images)
        }
    }, [imagesResponse])

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    const handleGridTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGridType(event.target.value as 'grid3' | 'grid4')
    }

    const handleLike = (id: number) => {
        // Обработка нажатия на кнопку лайка
    }

    const {request} = useHttp()

    const search = async () => {
        try {
            const response = await request(`/api/search/${searchQuery}`, 'GET')
            setImages(response.images)
        } catch {
        }
    }

    const addSearch = async () => {
        try {
            const response = await request('/api/search/edit', 'POST', {userId: user.id, imageStr: searchQuery})
        } catch {
        }
    }

    const saveImageHandler = async (imageStr: string, prompt: string, collectionName: string) => {
        try {
            const response = await saveImage({
                userId: user.id,
                imageStr: imageStr,
                prompt: prompt,
                collectionName: collectionName,
                token: user.token
            })
        } catch (e) {
        }
    }


    return (
        <div className="container">
            <form className="form-container" onSubmit={handleSearchSubmit}>
                <input
                    className="input medium"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Enter query"
                />
                <button className="button height" type="submit" onClick={search}>Search</button>
                {/*<button className="button" type="submit" onClick={addSearch}>Добавить</button>*/}
            </form>

            <ScrollToTopButton/>

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
                {images.map((image: IImageData) => (
                    <div key={image.data.id || image.data.userId} className="image-grid-item">
                        <img src={`data:image/png;base64,${image.imageStr}`} alt={image.data.prompt}/>
                        <div className="image-overlay">
                            <p>{image.data.prompt}</p>
                            <button className="like-button">Like</button>
                            <button className="button"
                                    onClick={() => saveImageHandler(image.imageStr, image.data.prompt, 'Saved')}>Save
                            </button>
                            <button className="like-button">Download</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

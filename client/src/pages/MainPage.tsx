import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react'
import ScrollToTop from '../components/ScrollToTop'
import '../styles/css/search.css'
import '../styles/css/grid-type-selector.css'
import '../styles/css/image-grid.css'
import '../styles/css/index.css'

interface Image {
    id: number
    url: string
}

export const MainPage = () => {
    const [images, setImages] = useState<Image[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [gridType, setGridType] = useState<'grid3' | 'grid4'>('grid3')

    useEffect(() => {
        // Здесь вы можете выполнить запрос на сервер для получения изображений
        // и обновить состояние images с полученными данными
        // Например:
        // axios.get('/images')
        //   .then((response) => {
        //     setImages(response.data);
        //   })
        //   .catch((error) => {
        //     // Обработка ошибок
        //   });

        const fakeImageData: Image[] = [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1661956602139-ec64991b8b16?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=965&q=80'
            },
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1684242269917-afdd589f20bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
            },
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1683488780112-f47a64de5d15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
            },
            {
                id: 4,
                url: 'https://plus.unsplash.com/premium_photo-1681584472258-6ef06bfa771c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2342&q=80'
            },
            {
                id: 5,
                url: 'https://images.unsplash.com/photo-1684077140580-cd2cb0987ef2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2662&q=80'
            },
            {
                id: 6,
                url: 'https://plus.unsplash.com/premium_photo-1682965455028-e5231430b7ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
            },
            {
                id: 7,
                url: 'https://images.unsplash.com/photo-1682772226815-e13ffc0a3bc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80'
            },
            {
                id: 8,
                url: 'https://images.unsplash.com/photo-1684093024930-30262615211b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2298&q=80'
            },
            {
                id: 9,
                url: 'https://images.unsplash.com/photo-1683009427660-b38dea9e8488?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80'
            },
            {
                id: 10,
                url: 'https://images.unsplash.com/photo-1684166251886-5c4fbb1d3c5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'
            },
            {
                id: 11,
                url: 'https://images.unsplash.com/photo-1674574124473-e91fdcabaefc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'
            },
            {
                id: 12,
                url: 'https://images.unsplash.com/photo-1684158902786-f00474d2f6a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
            },
            // ... и так далее
        ]
        setImages(fakeImageData)
    }, [])

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
    }

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    const handleGridTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGridType(event.target.value as 'grid3' | 'grid4')
    }

    const handleLike = (id:number) => {
        // Обработка нажатия на кнопку лайка
    };

    return (
        <div className="container">
            <form className="form-container" onSubmit={handleSearchSubmit}>
                <input
                    className="input"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Введите запрос"
                />
                <button className="button" type="submit">Найти</button>
            </form>

            <ScrollToTop/>

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
                {images.map((image: Image) => (
                    <div key={image.id} className="image-grid-item">
                        <img src={image.url} alt={`Image ${image.id}`} />
                        <div className="image-overlay">
                            <p>{image.url}</p>
                            <button className="like-button">Like</button>
                            <button className="like-button">Save</button>
                            <button className="like-button">Download</button>
                        </div>
                    </div>
                ))}
            </div>


            {/*<div className={`image-grid ${gridType}`}>*/}
            {/*    {images.map((image:Image) => (*/}
            {/*        <img key={image.id} src={image.url} alt={`Image ${image.id}`} className="image-grid-item"/>*/}
            {/*    ))}*/}
            {/*</div>*/}
        </div>
    )
}

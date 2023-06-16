import React, {ChangeEvent, useEffect, useState} from 'react'
import {useAppSelector} from '../hooks/redux'
import {useGetCollectionsQuery} from '../store/collection/collection.api'
import {useGenerateImageMutation} from '../store/generate/generate.api'
import {useSaveImageMutation} from '../store/image/image.api'
import {SaveButton} from '../components/SaveButton'
import '../styles/css/index.css'
import '../styles/css/generate-page.css'
import '../styles/css/image-grid.css'
import {ICollection} from '../models/collection'
import {IImageData} from '../models/image'
import {IGeneratedResult, IGenerateParams} from '../models/generate'

enum ImageSize {
    SMALL = 512,
    MEDIUM = 1024,
    LARGE = 2056
}

type ImageCount = 1 | 2 | 4 | 8 | 12 | 16

export const GeneratePage = () => {
    const {user, isLoading} = useAppSelector(state => state.auth)
    const [generateImage, {isLoading: isLoadingImage}] = useGenerateImageMutation()
    const [saveImage] = useSaveImageMutation()
    const {data: collectionResponse} = useGetCollectionsQuery({token: user.token})

    const [collections, setCollections] = useState<ICollection[]>()
    const [collectionName, setCollectionName] = useState<ICollection['title']>('')
    const [promptText, setPromptText] = useState<string>('')
    const [imageCount, setImageCount] = useState<ImageCount>(1)
    const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.SMALL)
    const [images, setImages] = useState<IImageData['imageStr'][]>()
    const [parameters, setParameters] = useState<IGenerateParams>()
    const [gridType, setGridType] = useState<'grid1' | 'grid2' | 'grid4'>('grid1')

    useEffect(() => {
        if (collectionResponse) {
            setCollections(collectionResponse)
        }
    }, [collectionResponse])

    const handlePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPromptText(event.target.value)
    }

    const handleImageCountChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const val = Number(event.target.value)
        setImageCount(val as ImageCount)

        if (val === 1) {
            setGridType('grid1')
        }
        if (val === 2) {
            setGridType('grid2')
        } else {
            setGridType('grid4')
        }
    }

    const handleImageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setImageSize(Number(event.target.value) as ImageSize)
    }

    const handleGenerateImage = async () => {
        try {
            const response = await generateImage({
                userId: user.id,
                promptText: promptText,
                imageCount: imageCount,
                imageSize: imageSize,
                token: user.token
            })

            if ('data' in response) {
                setImages(response.data.images)
                setParameters(response.data.parameters)
            }
        } catch (e) {
        }
    }

    function convertFromBase64(base64String: string) {
        const dataUrl = `data:image/png;base64,${base64String}`

        return (
            <img src={dataUrl} alt="Generated image"/>
        )
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

    const handleDownloadImage = (imageStr: string, prompt: string) => {
        const dataUrl = `data:image/png;base64,${imageStr}`
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = prompt
        a.click()
    }

    const handleSelect = (id: number) => {
        console.log('Выбран элемент:', id)
    }

    return (
        <div className="container center-content">
            <div>
                <div className="center-vertical">
                    <input
                        id="prompt"
                        type="text"
                        placeholder="What to imagine"
                        disabled={isLoading}
                        value={promptText}
                        className="input medium"
                        onChange={handlePromptChange}
                    />
                </div>

                <div className="margin-bottom-10"></div>

                {/*<div className="center-vertical">*/}
                {/*    /!*<label htmlFor="imageCount">How much</label>*!/*/}
                {/*    <select id="imageCount" disabled={isLoading} className="select" value={imageCount}*/}
                {/*            onChange={handleImageCountChange}>*/}
                {/*        <option value={1}>1</option>*/}
                {/*        <option value={2}>2</option>*/}
                {/*        <option value={4}>4</option>*/}
                {/*        <option value={8}>8</option>*/}
                {/*        <option value={12}>12</option>*/}
                {/*        <option value={16}>16</option>*/}
                {/*    </select>*/}
                {/*</div>*/}

                <div className="margin-bottom-30"></div>

                <div className="center-vertical">
                    <input className="custom-range" type="range" min="1" max="3" step="1"/>
                </div>

                <div className="margin-bottom-30"></div>

                <div className="center-vertical">
                    <input type="range" min="1" max="6" step="1"/>
                </div>

                <div className="margin-bottom-10"></div>

                {/*<div className="center-vertical">*/}
                {/*    /!*<label htmlFor="imageSize">What size</label>*!/*/}
                {/*    <select id="imageSize" disabled={isLoading} className="select" value={imageSize}*/}
                {/*            onChange={handleImageSizeChange}>*/}
                {/*        <option value={ImageSize.SMALL}>512x512</option>*/}
                {/*        <option value={ImageSize.MEDIUM}>1024x1024</option>*/}
                {/*    </select>*/}
                {/*</div>*/}


                {/*<label>*/}
                {/*    <input*/}
                {/*        type="radio"*/}
                {/*        value="grid3"*/}
                {/*        // checked={gridType === 'grid3'}*/}
                {/*        // onChange={handleImageSizeChange}*/}
                {/*    />*/}
                {/*    SMALL*/}
                {/*</label>*/}
                {/*<label>*/}
                {/*    <input*/}
                {/*        type="radio"*/}
                {/*        value="grid4"*/}
                {/*        // checked={gridType === 'grid4'}*/}
                {/*        // onChange={handleImageSizeChange}*/}
                {/*    />*/}
                {/*    MEDIUM*/}
                {/*</label>*/}
                {/*<label>*/}
                {/*    <input*/}
                {/*        type="radio"*/}
                {/*        value="grid4"*/}
                {/*        // checked={gridType === 'grid4'}*/}
                {/*        // onChange={handleImageSizeChange}*/}
                {/*    />*/}
                {/*    LARGE*/}
                {/*</label>*/}


                <div className="margin-bottom-30"></div>

                <div className="center-vertical">
                    <button className="button medium" disabled={isLoading} onClick={handleGenerateImage}>Imagine
                    </button>
                </div>

                <div className="margin-bottom-50"></div>

                {isLoadingImage && <progress/>}

                <div className={`image-grid ${gridType}`}>
                    {images && parameters && images.map((img, index) => (
                        <div key={index} className="image-grid-item">
                            {convertFromBase64(img)}
                            <div className="image-overlay">
                                {collections && <SaveButton collections={collections} selected={handleSelect}/>}
                                <button className="button" disabled={isLoading}
                                        onClick={() => saveImageHandler(img, parameters.prompt, 'Saved')}>Save
                                </button>

                                <button className="button" onClick={() =>
                                    handleDownloadImage(img, parameters.prompt)
                                }>Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

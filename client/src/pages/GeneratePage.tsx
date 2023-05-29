import {ChangeEvent, useState} from 'react'
import {useAppSelector} from '../hooks/redux'
import {useGenerateImageMutation} from '../store/generate/generate.api'
import {useSaveImageMutation} from '../store/image/image.api'
import '../styles/css/index.css'
import '../styles/css/generate-page.css'
import '../styles/css/image-grid.css'

export const GeneratePage = () => {
    const {user, isLoading} = useAppSelector(state => state.auth)
    const [generateImage, {isLoading: isLoadingImage}] = useGenerateImageMutation()
    const [saveImage] = useSaveImageMutation()

    const [promptText, setPromptText] = useState('')
    const [imageCount, setImageCount] = useState(1)
    const [imageSize, setImageSize] = useState('512')
    const [images, setImages] = useState<any>('')
    const [parameters, setParameters] = useState<any>('')

    const handlePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPromptText(event.target.value)
    }

    const handleImageCountChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setImageCount(parseInt(event.target.value))
    }

    const handleImageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setImageSize(event.target.value)
    }

    const handleGenerateImage = async () => {
        try {
            const response = await generateImage({
                id: user.id,
                promptText,
                imageCount,
                imageSize
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

    const handleSaveImage = async (imageStr: string, prompt: string, collectionName: string) => {
        try {
            const response = await saveImage({
                id: user.id,
                imageStr,
                prompt,
                collectionName
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

    return (
        <div className="container center-content">
            <div>
                <div>
                    <label htmlFor="prompt">Что создать:</label>
                    <input
                        id="prompt"
                        type="text"
                        disabled={isLoading}
                        value={promptText}
                        className="input"
                        onChange={handlePromptChange}
                    />
                </div>

                <div>
                    <label htmlFor="imageCount">Количество изображений:</label>
                    <select id="imageCount" disabled={isLoading} className="select" value={imageCount}
                            onChange={handleImageCountChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="12">12</option>
                        <option value="16">16</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="imageSize">Размер изображений:</label>
                    <select id="imageSize" disabled={isLoading} className="select" value={imageSize}
                            onChange={handleImageSizeChange}>
                        <option value="512">512x512</option>
                        <option value="1024">1024x1024</option>
                    </select>
                </div>

                <button className="button" disabled={isLoading} onClick={handleGenerateImage}>GENERATE</button>

                {isLoadingImage && 'loading...'}

                {images && images.map((img: string, index: number) => (
                    <div key={index} className="image-grid-item">
                        {convertFromBase64(img)}
                        <div className="image-overlay">
                            <button className="button" disabled={isLoading}
                                    onClick={() => handleSaveImage(img, parameters.prompt, 'Saved')}>Save
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
    )
}

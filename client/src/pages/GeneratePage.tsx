import React, {ChangeEvent, useState, useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from "../context/AuthContext"

export const GeneratePage = () => {
    const [promptText, setPromptText] = useState('')
    const [imageCount, setImageCount] = useState(1)
    const [imageSize, setImageSize] = useState('512')

    const auth = useContext(AuthContext)
    const {request, loading, error, clearError} = useHttp()

    const handlePromptChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPromptText(event.target.value)
    }

    const handleImageCountChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setImageCount(parseInt(event.target.value))
    }

    const handleImageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setImageSize(event.target.value)
    }

    const handleGenerateImages = async () => {
        try {
            const data = await request('/api/sd/txt2img', 'POST', {
                promptText,
                imageCount,
                imageSize
            }, {Authorization: `Bearer ${auth.token}`})
            console.log('IMAGE:', data)
        } catch (e) {
        }
    }

    return (
        <div>
            <h1>Генерация изображений</h1>
            <div>
                <label htmlFor="prompt">Что создать:</label>
                <input
                    id="prompt"
                    type="text"
                    value={promptText}
                    onChange={handlePromptChange}
                />
            </div>
            <div>
                <label htmlFor="imageCount">Количество изображений:</label>
                <select id="imageCount" value={imageCount} onChange={handleImageCountChange}>
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
                <select id="imageSize" value={imageSize} onChange={handleImageSizeChange}>
                    <option value="512">512x512</option>
                    <option value="1024">1024x1024</option>
                </select>
            </div>
            <button onClick={handleGenerateImages}>СОЗДАТЬ</button>
        </div>
    )
}

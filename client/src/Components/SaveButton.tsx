import React, {useState} from 'react'
import {ICollection} from '../models/collection'
import '../styles/scss/ButtonWithPopup.scss'

interface props {
    collections: ICollection[]
    selected: (id: number) => void
}

export const SaveButton: React.FC<props> = ({collections, selected}) => {
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    return (
        <div className="button-with-popup">
            <button
                className="button-with-popup__button"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                Save
            </button>
            {isHovered && (
                <ul className="button-with-popup__popup">
                    {collections.map((collection: ICollection) => (
                        <li key={collection.id} onClick={() => selected(collection.id)}>
                            {collection.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

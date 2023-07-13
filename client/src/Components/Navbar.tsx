import React from 'react'
import {NavLink} from 'react-router-dom'
import {Generate} from './Generate'
import '../styles/css/navbar.css'

export const Navbar = () => {
    return (
        <div className="navbar margin-bottom-50">
            <ul>
                <li><NavLink to="/main">Main</NavLink></li>
                <li><NavLink to="/generate">Generate</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
                {/*<li><NavLink to="/help">How to use</NavLink></li>*/}
                {/*<Generate />*/}
            </ul>
        </div>
    )
}

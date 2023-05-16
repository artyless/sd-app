import {useContext} from 'react'
import {NavLink} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import '../styles/css/navbar.css'

export const Navbar = () => {
    const {logout} = useContext(AuthContext)

    return (
        <div className='navbar'>
            <ul>
                <li><NavLink to="/main">Main</NavLink></li>
                <li><NavLink to="/generate">Generate</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><a href="/" onClick={logout}>Logout</a></li>
            </ul>
        </div>
    )
}

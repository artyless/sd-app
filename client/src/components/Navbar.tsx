import {useContext} from 'react'
import {NavLink} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

export const Navbar = () => {
    const {logout} = useContext(AuthContext)

    return (
        <div>
            <ul>
                <li><NavLink to="/main">Main</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><a href="/" onClick={logout}>Logout</a></li>
            </ul>
        </div>
    )
}

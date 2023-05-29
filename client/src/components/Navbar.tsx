import {useContext} from 'react'
import {NavLink} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import {Generate} from './Generate'
import '../styles/css/navbar.css'
import {useActions} from '../hooks/actions'

export const Navbar = () => {
    // const {logout} = useContext(AuthContext)
    const {removeFromLocalStorage} = useActions()

    return (
        <div className='navbar'>
            <ul>
                <li><NavLink to="/main">Main</NavLink></li>
                <li><NavLink to="/generate">Generate</NavLink></li>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><NavLink to="/help">How to use</NavLink></li>
                <Generate />
                {/*<li><a href="/" onClick={logout}>Logout</a></li>*/}
                <li><a href="/" onClick={() => removeFromLocalStorage()}>Logout</a></li>
            </ul>
        </div>
    )
}

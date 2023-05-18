import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import {useAuth} from './hooks/auth.hook'
import {AuthContext} from './context/AuthContext'
import './App.css'
import {Navbar} from './components/Navbar'
import {Loader} from './components/Loader'


function App() {
    const {login, logout, token, userData, ready} = useAuth()
    const isAuthenticated: boolean = !!token
    const routes = useRoutes(isAuthenticated)

    const {id, userName, firstName, lastName, email, createdAt} = userData

    if (!ready) {
        return <Loader />
    }

    // Почему мы храним данные в authHook, в authContext и в LocalStorage.........
    return (
        <AuthContext.Provider value={{
            token, id, userName, firstName, lastName, email, createdAt, login, logout, isAuthenticated
        }}>
            <Router>
                <div>
                    {isAuthenticated && <Navbar />}
                    {routes}
                </div>
            </Router>
        </AuthContext.Provider>
    )
}

export default App

// TODO
//

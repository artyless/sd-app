import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import './App.css'
import {Navbar} from './components/Navbar'
import {Loader} from './components/Loader'
import {useAppSelector} from './hooks/redux'

function App() {
    const {user, isLoading} = useAppSelector(state => state.auth)
    const isAuthenticated: boolean = !!user.token

    const routes = useRoutes(isAuthenticated)

    if (isLoading) {
        return <Loader />
    }

    return (
        <Router>
            <div>
                {isAuthenticated && <Navbar />}
                {routes}
            </div>
        </Router>
    )
}

export default App

import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {MainPage} from './pages/MainPage'
import {ProfilePage} from './pages/ProfilePage'
import {RegistrationPage} from './pages/RegistrationPage'
import {GeneratePage} from './pages/GeneratePage'

export const useRoutes = (isAuthenticated: boolean) => {
    return isAuthenticated ?
        <Routes>
            <Route path="/main" element={<MainPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/generate" element={<GeneratePage/>}/>
            <Route path="*" element={<Navigate to="/main"/>}/>
        </Routes>
        :
        <Routes>
            <Route path="/auth" element={<AuthPage/>}/>
            <Route path="/register" element={<RegistrationPage/>}/>
            <Route path="*" element={<Navigate to="/auth"/>}/>
        </Routes>
}

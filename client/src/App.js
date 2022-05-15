import React from 'react'
import { Routes, Route } from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import 'react-notifications/lib/notifications.css';
import PrivateRoutes from './components/PrivateRoutes'
import PersistLogin from './components/PersistLogin'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Profile from './pages/Profile/Profile'
import ProfileEdit from './pages/Profile/ProfileEdit'
import Layout from './components/Layout';

const PUBLIC_ROUTES = ['/', '/login', '/register']

function App() {
  
  return (
      <Routes>
        <Route element={<PersistLogin  publicRoutes={PUBLIC_ROUTES}/>}>
         {/** Public routes */}
         <Route path="/" element={<Layout />}>
          <Route exact path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<ProfileEdit />} />
            </Route>
          </Route>
      </Route>
    </Routes>
  )
}

export default App
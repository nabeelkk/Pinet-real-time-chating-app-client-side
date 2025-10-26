import React from 'react'
import {Routes,Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import { Toaster } from "react-hot-toast"
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'


const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="bg-[url('assets/bgimg.jpg')] bg-contain">
      <Toaster />
      <Routes>
        <Route path='/' element={ authUser ? <Home /> : <Navigate  to='/login' />} />
        <Route path='/profile' element={ authUser ? <Profile /> : <Navigate to='/login' />} />
        <Route path='/login' element = { !authUser ? <Login /> : <Navigate to='/' />} />
      </Routes>
    </div>
  )
}

export default App
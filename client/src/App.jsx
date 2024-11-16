import React, { useState, useEffect } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import userService from './server/userService'
import { login, logout } from './app/slices/authSlice'
import { Header, Footer } from './components'
import { Outlet, useNavigate } from 'react-router-dom'

function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    userService.getCurrentUser()
      .then((userData) => {
        if (userData && userData.status === 200) {
          dispatch(login({ userData: userData.data.data }))
        }
        else{
          dispatch(logout())
        }
      })
      .catch((error) => {
        console.log("App :: useEffect :: error :: ", error)
      })
      .finally(() => setLoading(false))
  })

  return !loading ? (
    <>
      <Header />
      <main className='main'>
        <Outlet />
      </main>
      <Footer />
    </>
  ) : (
    <div className="App">
      <h1>Loading...</h1>
    </div>
  )
}

export default App

import React from 'react'
import { useDispatch } from 'react-redux'
import userService from '../../server/userService'
import { logout } from '../../app/slices/authSlice'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()  // Move useNavigate outside of handleLogout

    const handleLogout = () => {
        userService.logoutUser()
            .then((response) => {
                if (response.status === 200) {
                    dispatch(logout())
                    navigate('/auth/login')  // Use navigate here after dispatching logout
                }
            })
            .catch((error) => {
                console.log("LogoutBtn :: handleLogout :: error :: ", error)
            })
    }

    return (
        <button 
            onClick={handleLogout} 
            className='bg-black text-white px-5 py-2 rounded-xl hover:bg-white hover:text-black duration-200 inline-block'
        >
            Logout
        </button>
    )
}

export default LogoutBtn

import React from 'react'
import { useDispatch } from 'react-redux'
import userService from '../../server/userService'
import { logout } from '../../app/slices/authSlice'

function LogoutBtn() {

    const dispatch = useDispatch()

    const handleLogout = () => {
        userService.logoutUser()
            .then((response) => {
                if (response.status === 200) {
                    dispatch(logout())
                }
            })
            .catch((error) => {
                console.log("LogoutBtn :: handleLogout :: error :: ", error)
            })
    }

    return (
        <button onClick={handleLogout} className='bg-black text-white px-5 py-2 rounded-xl hover:bg-white hover:text-black hover:px-4 hover:py-2 duration-200 inline-block'>
            Logout
        </button>
    )
}

export default LogoutBtn

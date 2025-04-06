import React from 'react'
import { useDispatch } from 'react-redux'
import userService from '../../server/userService'
import { logout } from '../../app/slices/authSlice'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        userService.logoutUser()
            .then((response) => {
                if (response.status === 200) {
                    dispatch(logout())
                    navigate('/auth/login')
                }
            })
            .catch((error) => {
                console.log("LogoutBtn :: handleLogout :: error :: ", error)
            })
    }

    return (
        <button
            onClick={handleLogout}
            style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '0.5rem 1.25rem',
                borderRadius: '0.75rem',
                transition: 'all 0.2s ease-in-out',
                display: 'inline-block',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = 'black';
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
            }}
        >
            Logout
        </button>

    )
}

export default LogoutBtn

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as authLogin } from '../../app/slices/authSlice.js'
import { Input } from '../index.js'
import { useDispatch } from 'react-redux'
import userService from '../../server/userService.js'
import { useForm } from 'react-hook-form'
import './LoginComponent.css'
import WhiteMail from '../../assets/WhiteMail.webp'
import WhiteUser from '../../assets/WhiteUser.webp'

function LoginComponent() {
    const [error, setError] = useState('') // State for managing error messages
    const { register, handleSubmit } = useForm() // Hook form for form handling
    const dispatch = useDispatch() // Redux dispatch function to trigger actions
    const navigate = useNavigate() // React Router hook for navigation

    // Function to handle the login process
    const login = async (data) => {
        setError('') // Clear previous error messages
        try {
            const { username, email, password } = data // Destructure the input data

            // Validate inputs: Ensure username or email is provided
            if (username.length === 0 && email.length === 0) {
                setError('Please enter either username or email')
                return
            }

            if (username.length > 0 && email.length > 0) {
                setError('Please enter only one: either username or email')
                return
            }

            // Validate password input
            if (password.length === 0) {
                setError('Password is required')
                return
            }

            // Attempt to login with the user service
            const response = await userService.loginUser({ ...data })

            // Check if the response is successful (status 200)
            if (response && response.status === 200) {
                dispatch(authLogin({ userData: response.data.data.user })) // Dispatch login action with user data
                navigate('/')  // Navigate to home page after successful login
            } else {
                // Handle different error responses based on status code
                switch (response.status) {
                    case 404:
                        setError('User not found')
                        break
                    case 401:
                        setError('Invalid credentials')
                        break
                    default:
                        setError('Something went wrong')
                }
            }
        } catch (error) {
            // Catch any errors during the login process
            setError(error.message || 'An error occurred during login')
        }
    }

    // JSX for rendering the login form
    return (
        <form onSubmit={handleSubmit(login)} className='loginForm'>
            <p className='text-white text-4xl'>Login</p>

            {/* User input fields for username or email */}
            <div className='usermail'>
                <Input
                    label="Username: "
                    placeholder="Username"
                    type="text"
                    img={WhiteUser}
                    {...register("username")} // Register username input with react-hook-form
                />
                <p className='text-white'>OR</p>
                <Input
                    label="Email: "
                    placeholder="Email"
                    type="email"
                    img={WhiteMail}
                    {...register("email", {
                        validate: (value) =>
                            !value ||
                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                            "Email address must be a valid address", // Validate email format
                    })}
                />
            </div>

            {/* Password input field */}
            <Input
                label="Password: "
                type="Password"
                placeholder="Password"
                {...register("password", { required: true })} // Register password field with required validation
            />

            {/* Display error message if any */}
            <p className="text-red-500">{error}</p>

            {/* Submit button */}
            <button className='LoginButton' type="submit">
                Login
            </button>
        </form>
    )
}

export default LoginComponent

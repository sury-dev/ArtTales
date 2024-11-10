import React, { useState } from 'react'
import userService from '../../server/userService'
import { Link, useNavigate } from 'react-router-dom'
import { login, logout } from '../../app/slices/authSlice.js'
import { Button, Input, Logo } from '../index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function SignupComponent() {

    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()

    const create = async (data) => {
        setError("")
        try {
            //can check for errors here
            const userData = await userService.createUser({...data, avatar: data.avatar, coverImage: data?.coverImage})
            if (userData && userData.status === 201) {
                console.log("userData :: status ::", userData.status)
                navigate('/login')
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>

                        <Input
                            label="Avatar :"
                            type="file"
                            className="mb-4"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("avatar", { required: true })}
                        />
                        <Input
                            label="Cover Image :"
                            type="file"
                            className="mb-4"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("coverImage")}
                        />
                        <Input
                            label="First Name: "
                            placeholder="Enter your First name"
                            {...register("firstName", {
                                required: true,
                            })}
                        />
                        <Input
                            label="last Name: "
                            placeholder="Enter your full name"
                            {...register("lastName", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Username: "
                            placeholder="Enter your username"
                            {...register("username", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Input
                            label="PhoneNumber: "
                            type="text"
                            placeholder="Enter your phoneNumber"
                            {...register("phoneNumber", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Date Of Birth: "
                            type="date"
                            placeholder="Enter your DOB"
                            {...register("dateOfBirth", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Profession: "
                            type="text"
                            placeholder="Enter your profession"
                            {...register("profession", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Bio: "
                            type="text"
                            placeholder="Enter your bio"
                            {...register("bio", {
                                required: true,
                            })}
                        />
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default SignupComponent

import React, { useState } from 'react'
import userService from '../../server/userService'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Logo } from '../index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import './SignupComponent.css'

function SignupComponent() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const { register, handleSubmit, getValues } = useForm()

    
    const [step1error, setStep1Error] = useState("")
    const [step2error, setStep2Error] = useState("")
    const [step3error, setStep3Error] = useState("")
    
    const [step, setStep] = useState(1)
    
    const checkError = () => {
        const { firstName, lastName, email, dateOfBirth, phoneNumber, profession, username, password, confirmPassword, avatar, coverImage, bio } = getValues()
        if (step === 1) {
            if(firstName.length == 0){
                setStep1Error('First Name is required')
                return true
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(email.length == 0){
                setStep1Error('Email is required')
                return true
            }
            if (!emailRegex.test(email)) {
                setStep1Error('Please enter a valid email address');
                return true;
            }
            if(dateOfBirth.length == 0){
                setStep1Error('Date of Birth is required')
                return true
            }
            if(phoneNumber.length > 0){
                if(phoneNumber.length != 10){
                    setStep1Error('Phone Number must be 10 digits')
                    return true
                }
            }
            return false
        } else if (step === 2) {
            if (username.length == 0 || password.length == 0 || confirmPassword.length == 0) {
                setStep2Error("Please fill all the fields")
                return true
            }
            if (password !== confirmPassword) {
                setStep2Error("Passwords do not match")
                return true
            }
            return false
        }
        return false
    }

    const create = async (data) => {
        setError("")
        try {
            // Can check for errors here
            if(data.avatar.length == 0){
                setStep3Error('Avatar is required')
                return
            }
            const userData = await userService.createUser({
                ...data,
                avatar: data.avatar,
                coverImage: data?.coverImage,
            })
            if (userData && userData.status === 201) {
                console.log("userData :: status ::", userData.status)
                navigate('/auth/login')
            }
            else{
                const regex = /Error:\s*(.*?)(<br>|<\/pre>)/;
                const match = userData.data.match(regex);
                setError(match[1]);
            }
        } catch (error) {
            setError(error.message)
        }
    }

    const nextStep = () => {
        if (checkError()) return ;
        if (step < 3) {
            setStep(step + 1)
        }
    }

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    return (
        <form onSubmit={handleSubmit(create)} className='bg-black signupLogin'>
            <p className='text-white text-4xl'>Sign Up</p>
            <p className='text-red-600'>{error}</p>
                {/* Step 1 */}
                {step === 1 && (
                    <>
                        <Input
                            label="First Name: "
                            placeholder="First Name"
                            {...register("firstName", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Last Name: "
                            placeholder="Last Name"
                            {...register("lastName", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Email"
                            type="email"
                            img='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADL0lEQVR4nO2cMW4TQRhGB1CqIEoQFQ0lARpCboCgSJqcgUgUIGi4gSkTqKFKWrgAHYeAyAUIxAGAgLAoeGhgIi3rtT0znt2Z3XxPsmQpHu/4e//s2hP7N0YIIYQQQgghhBBCCCGEEMIYA6wA28AB8A74jqhz5LI5cFmtJCkeYAsYTx1OLMJmtrVM8KeBJwsPI+bxGxjZLGMEKPx0jGJOO9ZelZ/ALrAOrAYbHTjAqstmz2VVxWa5GXLBrZ/zPwJXWn8VAwFYAz7VMhx7XZjdFbxe+Qo/TsKkluW2z0D7NqrKbujBxT+Ap7Us980igMPaoBsLB4lGgJu1LA99BtkPFFXOLhwkGrHZ1bI88hn0HwsHiLR5SkBaJCAzEtB3AcCpTmY6QGx2KQS8Bi51MuMBYTNz2QUL+NAg4Ruwo9XgXfU7LrMpfJ7g1qzBWg1xVR8kwOOJfgCPo/a4h131d+cUbpgAn6Wk1eBVrFPZmVC0GqKr/g1weWkBIQczJwQCTtFJBMQceIgQUYhJBcROYggQWXzJBSw7ob7BkgXXmoAUkyudFEUWLAC4A3x2t9sJJtq7T9EkfAu+7FbE+5O2Gkh8ao0REDag5RfQFW0VUOcC2nwxbdFm0WQR0JfVQAeFklVAyauBjooju4DSVgMdF0QxAkpYDWQogqIE5AqCjOKLFNBlKGQ+9RUroO2AKOTiX7yANsLKXfW9ExCwp3QPOGNmYP/mHlPMv1F7JcBzI+wt8BC4DpxzN3v/kfuZaFEbgr0TEPIVD0+ybnv0VoDnaphHEdvgvRZwDHAReAH88gjePua5HWMKYBACjgEuAA+AV+5Xh1/czd5/CdwHzpuCGJSAPiIBmZGAzEhAZiQgMxKQGQnIjARkRgIyIwE9FFDf+FKzjkjcVnmVrzHtatZjJ3DSATZi2tXUGzbtdTLbAQI8i2nY1NSybK2TGQ8I4Fpsy7JZTfskwRPganTTvjltKyeuB5o9r+nC3Nwda8OddibRbSsrT6jGrbkat1ZaF48aVoLoonVxRcSmmndHMQ4+7QS0r693VhT8zcR+Z2k/aft6IYQQQgghhBBCCCGEEEKYvvMH3T7Sc+Xa4fgAAAAASUVORK5CYII='
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                },
                            })}
                        />
                        <Input
                            label="Date Of Birth: "
                            type="date"
                            {...register("dateOfBirth", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Phone Number: "
                            type="text"
                            placeholder="Phone Number"
                            img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7ElEQVR4nO2WTStFURSGTzIwkKQbSTLQnRj5DyZKSoYiEyZ0lRI/wEQMFCYy8wOIGCgUQkmSG5ky83FHvsV9tLOOVjp7X/fapwy8w7Pfvd73rLM+ThD8468CaAG2gEfgHcgCt0Bb3MIJYB87jJGuOMXvldgpMAgkgXrgUp6bjCTjMLAhAq9Ae8R5CZARTjoOA3cSfMjBaVYZavBtIEQiB+9KeNO+DWQlcG0O3qHwlnwbeJbA3Q5OEfAgvDHfBk4l8KqDMyecN6DCt4ExCf5kOW/7qhKY9SpuAJRKjxv0Bt8ATCoD1iz9CsCuCNxYzpeViQNTE74NJFU3DFg4OhPncZjYkOCmK0otnBFl4lA9LwdGgQVgqqBhBZQBLxJ828EbVibWRNB0x3ekzS7J10S/CuAazRMRgmaFHwHX6pkp7o58TWyqy00O3qISmtc1IbsjXGDZqCVnBVCs3sJsyEYHdwbotJyZLXohcTJ2xQgAlWpLvroy4YLZL2GKCm3Ne/U5hguIURfez9uAyoQuqh1bi+Yo6sgxn09NhIUZzonUD++eyJ3dn6k5APSpOYFkpsfBb1VcP3/VfA6rdTW2w/5fMf8TQI0st5Qye+xFPKJA99QWtcH8xFQHcYHPtx0HzqQ2skp4G6iKTfwfwS/wAXRzo0r7n0EZAAAAAElFTkSuQmCC"
                            {...register("phoneNumber", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Profession: "
                            type="text"
                            placeholder="Profession"
                            {...register("profession", {
                                required: true,
                            })}
                        />
                        <p className='text-red-600'>{step1error}</p> {/*Step 1 error message */}
                    </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <>
                        <Input
                            label="Username: "
                            placeholder="Username"
                            img ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC+0lEQVR4nO2ZXYgNYRjHhyXL+srK2vZSStpww9qUK7lhKZtwIdImqU3ROi7EhfWRfBVaN0gUu1frI5+bJXGDrBS5RihLWTc2/PTWM3m8zs6Zc+adOVPmV29NZ973//yfMzPvp+dlZGQkDjAH2A10A4+kmOtdwGwv7QALgIcU5gHQ6KUNYBiQA34Snl/AAdPWSwvAyTwm7wHbgdVSzPV9uac57qUBYLNl7DkwL6B+A/DCarMpWdcWQA0woAz1AmNDtBsnT8fnKzDFKxfAUWXmHVBdRNvJwHvV/nC8boc2MlzMl/x6WK/l27J8+DJW+HwHJpSgMREYVDqz4nEbbGK5MvAsgk6f0lnm1mU4Ay3KwO0IOneUTotbl+EMNCsDjyPoPFU6K9y6DGfAjAc+pguuLEFjNPBN6cyNx22wiZHAZ2ViZQkaq1T7fmBEPG4LGzmrjLws5qmYusBr1f50vG6DzUy3us/zZnwJOQZdsLrvacm4HtrUfv7mCjA1oH4tcM1q056s6zwAFcB1y5j5gDvMuADUSzHXp6yPG0mqwksDwCjgHMVz0fRcXgoXVxtkzlSIN8A6L80AY2Qh1Qm8kjFmQK4vyb10PYWMjIw/AE3AZeBJQqUbWOq5BNhL+djjKolGyk+Di0SOKcE+ecUWxVyaZH/M54iLRMzA5pOLLBg+bk7F7XQh2KUE25y4DBe3TcXtciF4RgkedOIyXNxDrhMx5xw+N5y4DBf3poq704XgQiX4A5jhxGlwzJnqiMLErHE1PTczVx9zkFPlxHH+eFVywuVzy6X4Eqtfvxu0nI0Qp1Z29H3MfkC96yB6PPG3bzaa1aED7UrR6rdi7HDj/t+dD7PmtvkgU5j5xay9Za1vZg37gI95dNudJ2EZWGNtzGk+AT3mOA1oBdbL1mqzXLfKvZ48/77PF2BtrEmoZOqAE3l2RKJgtIxmXSJJWAlVA9vkA9UbdWEZlI5jKzDJSwPmoAdYDGyRb+mqJOivL3rltw6pY+qOL7fvjIz/hd+YZAl+gSRdbAAAAABJRU5ErkJggg=="

                            {...register("username", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Confirm Password"
                            {...register("confirmPassword", {
                                required: true,
                            })}
                        />
                        <p className='text-red-600'>{step2error}</p> {/*Step 2 error message */}
                    </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <>
                        <Input
                            label="Avatar: "
                            type="file"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("avatar")}
                        />
                        <Input
                            label="Cover Image: "
                            type="file"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("coverImage")}
                        />
                        <textarea
                            placeholder="Enter your bio"
                            {...register("bio")}
                            rows={4}
                            className="textArea"
                        ></textarea>
                        <p className='text-red-600'>{step3error}</p> {/*Step 1 error message */}
                    </>
                )}

                <div className="signupButtonSet">
                    {/* Next or Finish Button */}
                    {step < 3 ? (
                        <button type="button" onClick={nextStep} className="signButton">
                            Next
                        </button>
                    ) : (
                        <button type="submit" className="signButton">
                            Finish
                        </button>
                    )}
                    {/* Previous Button */}
                    {step > 1 && (
                        <button type="button" onClick={prevStep} className="signButton">
                            Previous
                        </button>
                    )}
                </div>
        </form>
    )
}

export default SignupComponent

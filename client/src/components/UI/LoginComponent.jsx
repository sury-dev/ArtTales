import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../../app/slices/authSlice.js'
import { Logo, Button, Input } from '../index.js'
import { useDispatch } from 'react-redux'
import userService from '../../server/userService.js'
import { useForm } from 'react-hook-form'
import './LoginComponent.css'

function LoginComponent() {

    const [error, setError] = useState('')

    const { register, handleSubmit, getValues } = useForm()
    const dispatch = useDispatch()

    const login = async (data) => {
        setError('')
        try {
            //can perform checking here
            const { username, email, password } = getValues()

            if (username.length == 0  && email.length == 0) {
                setError('Please enter either username or email')
                return
            }

            if(username.length > 0  && email.length > 0){
                setError('Please enter only one : either username or email')
                return
            }

            if(password.length == 0){
                setError('Password is required')
                return
            }

            const response = await userService.loginUser({ ...data })
            if (response && response.status === 200) {
                dispatch(authLogin(response.data))
                navigate('/')
            }
            else {
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
            setError(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(login)} className='loginForm'>
            <p className='text-white text-4xl'>Login</p>
            <div className='usermail'>
                <Input
                    label="Username: "
                    placeholder="Username"
                    type="text"
                    img ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC+0lEQVR4nO2ZXYgNYRjHhyXL+srK2vZSStpww9qUK7lhKZtwIdImqU3ROi7EhfWRfBVaN0gUu1frI5+bJXGDrBS5RihLWTc2/PTWM3m8zs6Zc+adOVPmV29NZ973//yfMzPvp+dlZGQkDjAH2A10A4+kmOtdwGwv7QALgIcU5gHQ6KUNYBiQA34Snl/AAdPWSwvAyTwm7wHbgdVSzPV9uac57qUBYLNl7DkwL6B+A/DCarMpWdcWQA0woAz1AmNDtBsnT8fnKzDFKxfAUWXmHVBdRNvJwHvV/nC8boc2MlzMl/x6WK/l27J8+DJW+HwHJpSgMREYVDqz4nEbbGK5MvAsgk6f0lnm1mU4Ay3KwO0IOneUTotbl+EMNCsDjyPoPFU6K9y6DGfAjAc+pguuLEFjNPBN6cyNx22wiZHAZ2ViZQkaq1T7fmBEPG4LGzmrjLws5qmYusBr1f50vG6DzUy3us/zZnwJOQZdsLrvacm4HtrUfv7mCjA1oH4tcM1q056s6zwAFcB1y5j5gDvMuADUSzHXp6yPG0mqwksDwCjgHMVz0fRcXgoXVxtkzlSIN8A6L80AY2Qh1Qm8kjFmQK4vyb10PYWMjIw/AE3AZeBJQqUbWOq5BNhL+djjKolGyk+Di0SOKcE+ecUWxVyaZH/M54iLRMzA5pOLLBg+bk7F7XQh2KUE25y4DBe3TcXtciF4RgkedOIyXNxDrhMx5xw+N5y4DBf3poq704XgQiX4A5jhxGlwzJnqiMLErHE1PTczVx9zkFPlxHH+eFVywuVzy6X4Eqtfvxu0nI0Qp1Z29H3MfkC96yB6PPG3bzaa1aED7UrR6rdi7HDj/t+dD7PmtvkgU5j5xay9Za1vZg37gI95dNudJ2EZWGNtzGk+AT3mOA1oBdbL1mqzXLfKvZ48/77PF2BtrEmoZOqAE3l2RKJgtIxmXSJJWAlVA9vkA9UbdWEZlI5jKzDJSwPmoAdYDGyRb+mqJOivL3rltw6pY+qOL7fvjIz/hd+YZAl+gSRdbAAAAABJRU5ErkJggg=="
                    {...register("username")}
                />
                <p className='text-white'>OR</p>
                <Input
                    label="Email: "
                    placeholder="Email"
                    type="email"
                    img='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADL0lEQVR4nO2cMW4TQRhGB1CqIEoQFQ0lARpCboCgSJqcgUgUIGi4gSkTqKFKWrgAHYeAyAUIxAGAgLAoeGhgIi3rtT0znt2Z3XxPsmQpHu/4e//s2hP7N0YIIYQQQgghhBBCCCGEEMIYA6wA28AB8A74jqhz5LI5cFmtJCkeYAsYTx1OLMJmtrVM8KeBJwsPI+bxGxjZLGMEKPx0jGJOO9ZelZ/ALrAOrAYbHTjAqstmz2VVxWa5GXLBrZ/zPwJXWn8VAwFYAz7VMhx7XZjdFbxe+Qo/TsKkluW2z0D7NqrKbujBxT+Ap7Us980igMPaoBsLB4lGgJu1LA99BtkPFFXOLhwkGrHZ1bI88hn0HwsHiLR5SkBaJCAzEtB3AcCpTmY6QGx2KQS8Bi51MuMBYTNz2QUL+NAg4Ruwo9XgXfU7LrMpfJ7g1qzBWg1xVR8kwOOJfgCPo/a4h131d+cUbpgAn6Wk1eBVrFPZmVC0GqKr/g1weWkBIQczJwQCTtFJBMQceIgQUYhJBcROYggQWXzJBSw7ob7BkgXXmoAUkyudFEUWLAC4A3x2t9sJJtq7T9EkfAu+7FbE+5O2Gkh8ao0REDag5RfQFW0VUOcC2nwxbdFm0WQR0JfVQAeFklVAyauBjooju4DSVgMdF0QxAkpYDWQogqIE5AqCjOKLFNBlKGQ+9RUroO2AKOTiX7yANsLKXfW9ExCwp3QPOGNmYP/mHlPMv1F7JcBzI+wt8BC4DpxzN3v/kfuZaFEbgr0TEPIVD0+ybnv0VoDnaphHEdvgvRZwDHAReAH88gjePua5HWMKYBACjgEuAA+AV+5Xh1/czd5/CdwHzpuCGJSAPiIBmZGAzEhAZiQgMxKQGQnIjARkRgIyIwE9FFDf+FKzjkjcVnmVrzHtatZjJ3DSATZi2tXUGzbtdTLbAQI8i2nY1NSybK2TGQ8I4Fpsy7JZTfskwRPganTTvjltKyeuB5o9r+nC3Nwda8OddibRbSsrT6jGrbkat1ZaF48aVoLoonVxRcSmmndHMQ4+7QS0r693VhT8zcR+Z2k/aft6IYQQQgghhBBCCCGEEEKYvvMH3T7Sc+Xa4fgAAAAASUVORK5CYII='
                    {...register("email", {
                        validate: (value) =>
                            !value || // If no value is entered, skip validation
                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                            "Email address must be a valid address",
                    })}
                />
            </div>

            <Input
                label="Password: "
                type="Password"
                placeholder="Password"
                {...register("password", {
                    required: true,
                })}
            />
            <p className="text-red-500">{error}</p>
            <button className='LoginButton'
                type="submit"
            >Login</button>
        </form>
    )

}

export default LoginComponent

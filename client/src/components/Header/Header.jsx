import React from 'react'
import { Logo, LogoutBtn, Container } from '../'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './Header.css'
import CreatePostBtn from './CreatePostBtn'

function Header() {

    const authStatus = useSelector(state => state.auth.status)

    const navItemsEnd = [
        { name: 'Login', path: '/auth/login', active: !authStatus },
        { name: 'Signup', path: '/auth/signup', active: !authStatus }
    ]

    const navItemsMid = [
        { name: 'Explore', path: '/', active: authStatus },
        { name: 'Search', path: '/1', active: authStatus },
        { name: 'Messages', path: '/2', active: authStatus },
        { name: 'Notifications', path: '/3', active: authStatus }
    ]

    return (
        <nav className='navbar'>
            <div>
                <NavLink to='/'>
                    <Logo width='100px' />
                </NavLink>
            </div>
            <ul className=''>
                {navItemsMid.map((item) => (
                    item.active && (
                        <li key={item.name} className='inline-block mx-2'>
                            <NavLink 
                                to={item.path} 
                                className={({ isActive }) => (isActive ? 'navBtns active' : 'navBtns')}
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    )
                ))}
            </ul>
            <ul className=''>
                {navItemsEnd.map((item) => (
                    item.active && (
                        <li key={item.name} className='inline-block mx-2'>
                            <NavLink 
                                to={item.path} 
                                className={({ isActive }) => (isActive ? 'authBtns active' : 'navBtns')}
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    )
                ))}
                <li  className='inline-block mx-2'>
                    {authStatus && <CreatePostBtn />}
                </li>
                <li  className='inline-block mx-2'>
                    {authStatus && <LogoutBtn />}
                </li>
            </ul>
        </nav>
    )
}

export default Header

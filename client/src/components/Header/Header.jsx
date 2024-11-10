import React from 'react'
import { Logo, LogoutBtn, Container } from '../'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {

    const authStatus = useSelector(state => state.auth.status)

    const navItemsEnd = [
        { name: 'Login', path: '/login', active: !authStatus },
        { name: 'Register', path: '/signup', active: !authStatus },
        { name: 'Profile', path: '/profile', active: authStatus },
        { name: 'Add Post', path: '/add-post', active: authStatus }
    ]

    const navItemsMid = [
        { name: 'Explore', path: '/', active: authStatus }
    ]

    return (
        <header className='flex flex-wrap justify-between items-center h-24'>
            <Container>
                <nav className='flex flex-wrap justify-between items-center my-auto'>
                    <div>
                        <Link to='/'>
                            <Logo width='100px' />
                        </Link>
                    </div>
                    <ul className='flex mx-auto'>
                        {navItemsMid.map((item) => (
                            item.active && (
                                <li key={item.name} className='inline-block mx-2'>
                                    <Link to={item.path} className='text-black hover:text-purple-600'>
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        ))}
                    </ul>
                    <ul className='flex mx-auto'>
                        {navItemsEnd.map((item) => (
                            item.active && (
                                <li key={item.name} className='inline-block mx-2'>
                                    <Link to={item.path} className='text-black hover:text-purple-600'>
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        ))}
                        <li>
                            {authStatus && <LogoutBtn />}
                        </li>
                    </ul>
                </nav>
            </Container>
        </header>
    )
}

export default Header

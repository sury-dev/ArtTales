import React from 'react'
import { Outlet } from 'react-router-dom'
import './Authenticate.css'


function Authenticate() {
    return (
        <div className='authPage'>
            <div className="lightSource1"></div>
            <div className="lightSource2"></div>
            <div className="bigtexts">
                <p>ART</p>
                <p>TALES</p>
            </div>
            <img src="https://res.cloudinary.com/suryansh-cloud/image/upload/v1731262262/qw32yei7vymcmnxaqa3w.png" className='character' alt="" />
            <div className="form">
                <Outlet />
            </div>
        </div>
    )
}

export default Authenticate

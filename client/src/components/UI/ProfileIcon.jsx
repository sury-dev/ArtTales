import React from 'react'
import './ProfileIcon.css'

function ProfileIcon({profileIcon, width="100px"}) {
    return (
        <div  className="profile-container" style={{width: width, minWidth:width}}>
            <img src={profileIcon} alt="profile-icon" />
        </div>
    )
}

export default ProfileIcon

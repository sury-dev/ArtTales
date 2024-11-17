import React from 'react'
import './ProfileIcon.css'

function ProfileIcon({profileIcon, width="100px", radius = "33%"}) {
    return (
        <div  className="profile-container" style={{width: width, minWidth:width, '--radius':radius}}>
            <img src={profileIcon} alt="profile-icon" />
        </div>
    )
}

export default ProfileIcon

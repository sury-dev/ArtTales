import React, { useState, useRef, useEffect } from 'react';
import { ProfileIcon } from '../index.js';
import { useSelector } from 'react-redux';
import LogoutBtn from './LogoutBtn.jsx';
import './ProfileButton.css';

function ProfileButton() {
    const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const headerProfileToggleDropdown = () => {
        setProfileDropdownVisible((prevState) => !prevState);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setProfileDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const userData = useSelector((state) => state.auth.userData);
    console.log("ProfileButton :: userData :: ", userData);

    return (
        <div className="header-profile-wrapper" ref={dropdownRef}>
            <div onClick={headerProfileToggleDropdown}>
                <ProfileIcon profileIcon={userData?.avatar} width="50px" />
            </div>
            {profileDropdownVisible && (
                <div className="header-profile-dropdown">
                    <button className="header-profile-dropdown-item">My Profile</button>
                    <LogoutBtn />
                </div>
            )}
        </div>
    );
}

export default ProfileButton;

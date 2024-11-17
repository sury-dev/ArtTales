import React, { useState, useRef, useEffect } from 'react';
import { ProfileIcon } from '../index.js';
import { useSelector } from 'react-redux';
import LogoutBtn from './LogoutBtn.jsx';
import './ProfileButton.css';
import { useNavigate } from 'react-router-dom';

function ProfileButton() {
    const userData = useSelector((state) => state.auth.userData);
    const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const headerProfileToggleDropdown = () => {
        setProfileDropdownVisible((prevState) => !prevState);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setProfileDropdownVisible(false);
        }
    };

    const navigaeToProfile = () => {
        setProfileDropdownVisible(false);
        navigate(`/user-profile/${userData.username}`);
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="header-profile-wrapper" ref={dropdownRef}>
            <div onClick={headerProfileToggleDropdown}>
                <ProfileIcon profileIcon={userData?.avatar} width="50px" />
            </div>
            {profileDropdownVisible && (
                <div className="header-profile-dropdown">
                    <button className="header-profile-dropdown-item" onClick={navigaeToProfile}>My Profile</button>
                    <LogoutBtn />
                </div>
            )}
        </div>
    );
}

export default ProfileButton;

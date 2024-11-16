import React, { useState } from 'react';
import './CreatePostBtn.css';
import { useNavigate } from 'react-router-dom';

function CreatePostBtn() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [btnRotateStatus, setBtnRotateStatus] = useState('0deg');

    const toggleDropdown = () => {
        setDropdownVisible((prevState) => !prevState);
    };

    return (
        <div className="createPostBtn">
            <button
                className="btn"
                onClick={(e) => {toggleDropdown(); setBtnRotateStatus((prevState) => (prevState === '0deg' ? '45deg' : '0deg'))}}
                style={{ transform: `rotate(${btnRotateStatus})` }}
            >
                +
            </button>
            {dropdownVisible && (
                <div className="dropdown">
                    <button className="dropdown-item">Post an Art</button>
                    <button className="dropdown-item">Post a Tale</button>
                </div>
            )}
        </div>
    );
}

export default CreatePostBtn;

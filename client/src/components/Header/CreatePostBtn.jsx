import React, { useState, useRef, useEffect } from 'react';
import './CreatePostBtn.css';

function CreatePostBtn() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [btnRotateStatus, setBtnRotateStatus] = useState('0deg');
    const btnRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownVisible((prevState) => !prevState);
        setBtnRotateStatus((prevState) => (prevState === '0deg' ? '45deg' : '0deg'));
    };

    const handleClickOutside = (event) => {
        if (btnRef.current && !btnRef.current.contains(event.target)) {
            setDropdownVisible(false);
            setBtnRotateStatus('0deg');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="createPostBtn" ref={btnRef}>
            <button
                className="btn"
                onClick={toggleDropdown}
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

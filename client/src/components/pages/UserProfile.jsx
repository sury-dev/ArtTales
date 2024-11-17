import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserProfile() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.userData);
    const { id } = useParams();
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        if (id === user._id) {
            setEditable(true);
        } else {
            setEditable(false);
        }
    }, [id, user._id]); // Only update when `id` or `user._id` changes

    return (
        <div className='bg-black text-white min-h-screen pt-24'>
            User profile page: {user.username}
            <div>Editable: {editable ? 'Yes' : 'No'}</div>
        </div>
    );
}

export default UserProfile;

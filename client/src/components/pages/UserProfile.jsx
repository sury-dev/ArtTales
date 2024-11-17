import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import userService from '../../server/userService';
import './UserProfile.css';
import { ProfileIcon } from '../index';

function UserProfile() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.userData);
    const { username } = useParams();
    const [editable, setEditable] = useState(false);
    const [userProfile, setUserProfile] = useState();

    useEffect(() => {
        try {
            userService.getUserProfile(username)
                .then((response) => {
                    if (response && response.status === 200) {
                        setUserProfile(response.data.data);
                        console.log(response.data.data);
                        setEditable(userProfile._id === user._id);
                    }
                })
        } catch (error) {
            console.error(error);
        }
    }, [username, user.username]); // Only update when `id` or `user._id` changes

    if (!userProfile) return <div className='bg-black text-white profilePage'>No user with username {username} found.</div>;

    return (
        <div className='bg-black text-white profilePage'>
            <div className="profileBall1"></div>
            <div className="profileBall2"></div>
            <div className="userProfile">
                <div className="detailBox border-white border-2">
                    <div className="upperSection">
                        <div className="profileIconWrapper">
                            <ProfileIcon profileIcon={userProfile.avatar} width="180px" radius='45px' />
                        </div>
                        <div className="profileDetails">
                            <h1>{userProfile.firstName} {userProfile?.lastName}</h1>
                            <h3>@{userProfile.username}</h3>
                            <div className="followDetails">
                                <button className="followButton border-white border-2 text-white hover:bg-white hover:text-black">{userProfile.isFollowing ? "Unfollow" : "Follow"}</button>
                                <div className="numDetails">
                                    <h5>{userProfile.followersCount}</h5>
                                    <h4>Followers</h4>
                                </div>
                                <div className="numDetails">
                                    <h5>{userProfile.followingCount}</h5>
                                    <h4>Following</h4>
                                </div>
                                <div className="numDetails">
                                    <h5>{userProfile.artPostsCount}</h5>
                                    <h4>Arts</h4>
                                </div>
                                <div className="numDetails">
                                    <h5>{userProfile.talePostsCount}</h5>
                                    <h4>Tales</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ctcBtns">
                        <button className='border-white border-2 text-white hover:bg-white hover:text-black'>Message</button>
                        <button className='border-white border-2 text-white hover:bg-white hover:text-black'>Support ( ₹ )</button>
                    </div>
                    <div className="bio">
                        <p>{userProfile.bio} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati consequuntur non inventore repellat. Iste quis architecto, distinctio ipsum reiciendis vel unde voluptatem molestias asperiores aliquid voluptate numquam tempora beatae velit!</p>
                    </div>
                </div>
                <div className="coverImageWrapper border-white border-2">
                    <img src={userProfile.coverImage} alt="Cover Image" />
                </div>
            </div>
        </div>
    );
}

export default UserProfile;

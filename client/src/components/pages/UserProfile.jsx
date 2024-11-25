import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import userService from '../../server/userService';
import artPostService from '../../server/artPostService';
import followService from '../../server/followService';
import './UserProfile.css';
import { ProfileIcon, ArtPostCards } from '../index';

function UserProfile() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.userData);
    const { username } = useParams();
    const [editable, setEditable] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [artPosts, setArtPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleFollow = () => {
        setUserProfile((prevData) => ({
            ...prevData,
            isFollowed: !prevData.isFollowed,
            followersCount: prevData.isFollowed ? prevData.followersCount - 1 : prevData.followersCount + 1,
            followingCount: prevData.isFollowed ? prevData.followingCount - 1 : prevData.followingCount + 1
        }));
        followService.toggleFollow({ id: userProfile._id }).catch((error) => {
            console.log("ArtPostModal :: handleFollow :: error :: ", error);
        });
    }

    const handleCardClick = (post) => {
        setSelectedPost(post);
        navigate(`/user-profile/${username}/artpost/${post._id}`);
    };

    const closeModal = () => {
        setSelectedPost(null);
        navigate(`/user-profile/${username}`);
    };

    const handleDeleteArtPost = (id) => {
        artPostService.deleteArtPost({ id }).then((response) => {
            if (response && response.status === 201) {
                console.log("ArtPostCards :: handleDeleteArtPost :: response :: ", response);
                setArtPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
            }
            else{
                console.log("Could Not delete your post");
            }
        }).catch((error) => {
            console.log("ArtPostCards :: handleDeleteArtPost :: error :: ", error);
        });
    };

    useEffect(() => {
        artPostService
            .getProfileArtPosts({ page: 1, limit: 10, query: '', username })
            .then((postData) => {
                if (postData?.status === 200) {
                    setArtPosts(postData.data.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching art posts:', error);
            });
    }, [username]);

    useEffect(() => {
        userService
            .getUserProfile(username)
            .then((response) => {
                if (response?.status === 200) {
                    setUserProfile(response.data.data);
                    setEditable(response.data.data._id === user?._id);
                }
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }, [username, user?._id]);

    if (!userProfile) {
        return <div className="bg-black text-white profilePage">Loading profile...</div>;
    }

    return (
        <div className="bg-black text-white profilePage">
            <div className="profileBall1"></div>
            <div className="profileBall2"></div>
            <div className="userProfile">
                <div className="detailBox border-white border-2">
                    <div className="upperSection">
                        <div className="profileIconWrapper">
                            <ProfileIcon profileIcon={userProfile.avatar} width="180px" radius="45px" />
                        </div>
                        <div className="profileDetails">
                            <h1>
                                {userProfile.firstName} {userProfile.lastName}
                            </h1>
                            <h3>@{userProfile.username}</h3>
                            <div className="followDetails">
                                <button className="followButton border-white border-2 text-white hover:bg-white hover:text-black" onClick={handleFollow}>
                                    {userProfile.isFollowed ? 'Unfollow' : 'Follow'}
                                </button>
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
                        <button className="border-white border-2 text-white hover:bg-white hover:text-black">Message</button>
                        <button className="border-white border-2 text-white hover:bg-white hover:text-black">
                            Support ( ₹ )
                        </button>
                    </div>
                    <div className="bio">
                        <p>{userProfile.bio}</p>
                    </div>
                </div>
                <div className="coverImageWrapper border-white border-2">
                    <img src={userProfile.coverImage} alt="Cover" />
                </div>
            </div>
            <div className="userPostsTitle">
                <button className='userPostsTitleButton1'>
                    {editable ? 'Your Arts' : 'Arts'}
                </button>
                <button className='userPostsTitleButton2'>
                    {editable ? 'Your Tales' : 'Tales'}
                </button>
            </div>
            <div className="userPosts">
                {artPosts.map((post, index) => (
                    <ArtPostCards key={post._id} {...post} index={index} onClick={() => handleCardClick(post)} id={post._id} editable={editable} handleDeleteArtPost={handleDeleteArtPost}/>
                ))}
            </div>
                <div className='UserProfileOutlet'>
                    <Outlet context={{ closeModal }} />
                </div>
        </div>
    );
}

export default UserProfile;

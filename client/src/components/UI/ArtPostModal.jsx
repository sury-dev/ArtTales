import React, { useState, useEffect, useRef } from 'react';
import './ArtPostModal.css';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import artPostService from '../../server/artPostService';
import commentService from '../../server/commentService';
import followService from '../../server/followService';
import likeService from '../../server/likeService';
import { ArtCommentContainer, ProfileIcon, LikeButton, DeleteButton } from '../index';
import { useSelector } from 'react-redux';

function ArtPostModal() {
    const { closeModal } = useOutletContext();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.userData);

    const { id } = useParams();
    if (!id) return null;

    // State variables
    const [postData, setPostData] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const descriptionRef = useRef(null);


    const handleFollow = () => {
        setPostData((prevData) => ({
            ...prevData,
            owner: {
                ...prevData.owner,
                isFollowed: !prevData.owner.isFollowed,
                followersCount: prevData.owner.isFollowed ? prevData.owner.followersCount - 1 : prevData.owner.followersCount + 1
            }
        }));
        followService.toggleFollow({ id: postData.owner._id }).catch((error) => {
            console.log("ArtPostModal :: handleFollow :: error :: ", error);
        });
    }

    const handleLike = async () => {
        try {
            setPostData((prevData) => ({
                ...prevData,
                isLiked: !prevData.isLiked,
                likesCount: prevData.isLiked ? prevData.likesCount - 1 : prevData.likesCount + 1
            }));
            const like = await likeService.likeArtPost({ id });
            if (like.status !== 200) {
                console.log("ArtPostModal :: handleLike :: error :: ", like);
                setPostData((prevData) => ({
                    ...prevData,
                    isLiked: !prevData.isLiked,
                    likesCount: prevData.isLiked ? prevData.likesCount - 1 : prevData.likesCount + 1
                }));
            }
        } catch (error) {
            console.log("ArtPostModal :: handleLike :: error :: ", error);
        }
    };

    const measureDescriptionHeight = () => {
        return descriptionRef.current ? descriptionRef.current.scrollHeight : 'auto';
    };

    const toggleDescription = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {

        artPostService.getArtPost({ id })
            .then((postData) => {
                if (postData && postData.status === 200) {
                    setPostData(postData.data.data);
                }
            })
            .catch((error) => {
                console.log("ArtPostModal :: useEffect :: error :: ", error);
            });

        artPostService.incrementArtView({ id }).catch((error) => {
            console.log("ArtPostModal :: useEffect :: error :: ", error);
        });
    }, [id]);


    if (!postData) {
        return (
            <div className="artpost-modal-overlay" onClick={closeModal}>
                <div className="artpost-modal justify-center" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={closeModal}>X</button>
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }
    if (postData.isPublished === false && user?._id !== postData.owner._id) {
        return (
            <div className="artpost-modal-overlay" onClick={closeModal}>
                <div className="artpost-modal justify-center" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={closeModal}>X</button>
                    <h2>This post is not published yet</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="artpost-modal-overlay" onClick={closeModal}>
            <div className="artpost-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button text-white bg-black" onClick={closeModal}>X</button>

                <div className="image-container">
                    <img src={postData.artFile} alt={postData.title} />
                </div>

                <div className="details-container">
                    <div className="titleAndLikes">
                        <h2>{postData.title}</h2>
                        <LikeButton isLiked={postData.isLiked} likesCount={postData.likesCount} onLike={handleLike} />
                    </div>

                    <div
                        className="description"
                        ref={descriptionRef}
                        style={{ minHeight: isExpanded ? `${measureDescriptionHeight()}px` : '24px' }}
                        onClick={toggleDescription}
                    >
                        <p>{postData.description}</p>
                    </div>

                    <div className="profile-wrapper">
                        <div className="profile">
                            <div onClick={() => { navigate(`/user-profile/${postData.owner.username}`) }}>
                                <ProfileIcon profileIcon={postData.owner.avatar} width='80px' />
                            </div>
                            <div>
                                <h2>{postData.owner.firstName} {postData?.lastName}</h2>
                                <p onClick={() => { navigate(`/user-profile/${postData.owner.username}`) }}>@{postData.owner.username}</p>
                                <p>{postData.owner.followersCount} Followers</p>
                                {/* <p>{postData._id}</p> */}
                            </div>
                        </div>
                        <button className="follow-button" onClick={handleFollow}>{postData.owner.isFollowed ? "Unfollow" : "Follow"}</button>
                    </div>

                    <div className="divider"></div>

                    {!postData.isPublished && <p>No comments available for unpublished Posts</p>}
                    {postData.isPublished && <ArtCommentContainer id={id} />}

                </div>
            </div>
        </div>
    );
}

export default ArtPostModal;

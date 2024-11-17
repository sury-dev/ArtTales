import React, { useState, useEffect, useRef } from 'react';
import './ArtPostModal.css';
import { useOutletContext, useParams } from 'react-router-dom';
import artPostService from '../../server/artPostService';
import likeService from '../../server/likeService';
import { ArtCommentContainer, ProfileIcon, LikeButton } from '../index';

function ArtPostModal() {
    // Outlet context for handling modal close action
    const { closeModal } = useOutletContext();

    // Retrieve post ID from URL params
    const { id } = useParams();
    if (!id) return null;

    // State variables
    const [postData, setPostData] = useState(null); // Stores post data
    const [isExpanded, setIsExpanded] = useState(false); // Controls description expansion

    // Ref to manage the description element for measuring its height
    const descriptionRef = useRef(null);
    let useEffectRunCount = 1; // Control initial useEffect run

    // Toggle like status and update the likes count
    const handleLike = () => {
        setPostData((prevData) => ({
            ...prevData,
            isLiked: !prevData.isLiked,
            likesCount: prevData.isLiked ? prevData.likesCount - 1 : prevData.likesCount + 1
        }));
        likeService.likeArtPost({ id }).catch((error) => {
            console.log("ArtPostModal :: handleLike :: error :: ", error);
        });
    };

    // Measure description height for conditional expansion
    const measureDescriptionHeight = () => {
        return descriptionRef.current ? descriptionRef.current.scrollHeight : 'auto';
    };

    // Toggle description expansion state
    const toggleDescription = () => {
        setIsExpanded((prev) => !prev);
    };

    // Fetch post data and increment view count on component mount
    useEffect(() => {
        if (useEffectRunCount === 1) {
            useEffectRunCount++;
            return;
        }

        artPostService.getArtPost({ id })
            .then((postData) => {
                if (postData && postData.status === 200) {
                    setPostData(postData.data.data);
                }
            })
            .catch((error) => {
                console.log("ArtPostModal :: useEffect :: error :: ", error);
            });

        // Increment view count
        artPostService.incrementArtView({ id }).catch((error) => {
            console.log("ArtPostModal :: useEffect :: error :: ", error);
        });
    }, [id]);

    // Show loading state if postData is null
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

    // Main modal layout
    return (
        <div className="artpost-modal-overlay" onClick={closeModal}>
            <div className="artpost-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button text-white bg-black" onClick={closeModal}>X</button>
                
                <div className="image-container">
                    <img src={postData.artFile} alt={postData.title} />
                </div>
                
                <div className="details-container">
                    {/* Title and like button */}
                    <div className="titleAndLikes">
                        <h2>{postData.title}</h2>
                        <LikeButton isLiked={postData.isLiked} likesCount={postData.likesCount} onLike={handleLike} />
                    </div>
                    
                    {/* Description with expansion control */}
                    <div
                        className="description"
                        ref={descriptionRef}
                        style={{ minHeight: isExpanded ? `${measureDescriptionHeight()}px` : '24px' }}
                        onClick={toggleDescription}
                    >
                        <p>{postData.description}</p>
                    </div>
                    
                    {/* Profile info and follow button */}
                    <div className="profile-wrapper">
                        <div className="profile">
                            <ProfileIcon profileIcon={postData.owner.avatar} width='80px' />
                            <div>
                                <h2>{postData.owner.firstName} {postData?.lastName}</h2>
                                <p>@{postData.owner.username}</p>
                                <p>{postData.owner.followersCount} Followers</p>
                                <p>{postData._id}</p>
                            </div>
                        </div>
                        {!!postData.isFollowed ? (
                            <button className="follow-button">Unfollow</button>
                        ) : (
                            <button className="follow-button">Follow</button>
                        )}
                    </div>

                    <div className="divider"></div>

                    {/* Comments section */}
                    <ArtCommentContainer id={id} />
                </div>
            </div>
        </div>
    );
}

export default ArtPostModal;

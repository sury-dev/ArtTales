import React, { useEffect, useState } from 'react';
import './ArtPostCards.css';
import artPostService from '../../server/artPostService';
import { LikeButton, ViewButton, CommentButton, DeleteButton } from '../index';
import Loader from './Loader';


function ArtPostCards({
    id = '',
    artFile,
    title,
    description,
    view,
    onClick,
    isLiked,
    likesCount,
    commentsCount,
    isCommented,
    index = 0,
    editable = false,
    handleDeleteArtPost = (id) => { },
}) {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = artFile;
        img.onload = () => setImageLoaded(true);
    }, [artFile]);

    return (
        <div className="card" onClick={onClick} style={{ '--index': index }}>
            {/* Image with loading state */}
            {!imageLoaded && (
                <div className="image-loader" style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {/* Use your OrbitLoader or a simple fallback */}
                    <Loader size={75} />
                </div>
            )}

            <img
                src={artFile}
                loading="lazy"
                alt={title}
                style={imageLoaded ? {} : { display: 'none' }}
                onLoad={() => { setImageLoaded(true) }} // Set imageLoaded to true when the image is loaded}
            />

            <div className="overlay"></div>

            {editable && (
                <div className="edit" onClick={(e) => e.stopPropagation()}>
                    <DeleteButton onDelete={() => handleDeleteArtPost(id)} />
                </div>
            )}

            <div className="card-content">
                <h2>{title}</h2>
                <p>{description}</p>
                <div>
                    <CommentButton
                        isCommented={isCommented}
                        commentsCount={commentsCount}
                        commentIconHeight="25px"
                        fontSize="1.2rem"
                        lineHeight="1.4"
                    />
                    <ViewButton
                        view={view}
                        viewIconHeight="30px"
                        fontSize="1.2rem"
                        lineHeight="1.4"
                    />
                    <LikeButton
                        isLiked={isLiked}
                        likesCount={likesCount}
                        onLike={() => { }}
                        likeIconHeight="25px"
                        fontSize="1.2rem"
                        lineHeight="1.4"
                    />
                </div>
            </div>
        </div>
    );
}

export default ArtPostCards;
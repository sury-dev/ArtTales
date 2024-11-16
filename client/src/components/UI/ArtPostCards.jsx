import React from 'react'
import './ArtPostCards.css'
import { LikeButton, ViewButton, CommentButton } from '../index'

function ArtPostCards({artFile, title, description, view, onClick, isLiked, likesCount, commentsCount, isCommented}) {
    return (
        <div className='card' onClick={onClick}>
            <img src={artFile} loading='lazy' alt={title} />
            <div className="overlay"></div>
            <div className="card-content">
                    <h2>{title}</h2>
                    <p>{description}</p>
                <div>
                    <CommentButton isCommented={isCommented} commentsCount={commentsCount} commentIconHeight="25px" fontSize='1.2rem' lineHeight='1.4'/>
                    <ViewButton view={view} viewIconHeight="30px" fontSize='1.2rem' lineHeight='1.4'/>
                    <LikeButton isLiked={isLiked} likesCount={likesCount} onLike={()=>{}} likeIconHeight="25px" fontSize='1.2rem' lineHeight='1.4'/>
                </div>
            </div>
        </div>
    )
}

export default ArtPostCards

import React from 'react'
import './ArtPostCards.css'
import artPostService from '../../server/artPostService';
import { LikeButton, ViewButton, CommentButton, DeleteButton } from '../index'

function ArtPostCards({ id = '', artFile, title, description, view, onClick, isLiked, likesCount, commentsCount, isCommented, index = 0, editable = false, handleDeleteArtPost=(id)=>{} }) {
    return (
        <div className='card' onClick={onClick} style={{ '--index': index }}>
            <img src={artFile} loading='lazy' alt={title} />
            <div className="overlay"></div>
            {editable && <div className="edit" onClick={(e) => {e.stopPropagation()}}>
                <DeleteButton onDelete={() => {handleDeleteArtPost(id)}} />
            </div>}
            <div className="card-content">
                <h2>{title}</h2>
                <p>{description}</p>
                <div>
                    <CommentButton isCommented={isCommented} commentsCount={commentsCount} commentIconHeight="25px" fontSize='1.2rem' lineHeight='1.4' />
                    <ViewButton view={view} viewIconHeight="30px" fontSize='1.2rem' lineHeight='1.4' />
                    <LikeButton isLiked={isLiked} likesCount={likesCount} onLike={() => { }} likeIconHeight="25px" fontSize='1.2rem' lineHeight='1.4' />
                </div>
            </div>
        </div>
    )
}

export default ArtPostCards

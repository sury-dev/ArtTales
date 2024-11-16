import React from 'react'
import PurpleHeart from '../../assets/PurpleHeart.webp'
import WhiteHeart from '../../assets/WhiteHeart.webp'
import './LikeButton.css'

function LikeButton({ isLiked = false, likesCount = 0, onLike, likeIconHeight = "30px", fontSize = "1.5rem", lineHeight="1.8rem" }) {
    return (
        <div className="likes" onClick={onLike}>
            {isLiked ? <img src={PurpleHeart} alt="Purple Heart" style={{height:likeIconHeight, minWidth:likeIconHeight}} /> : <img src={WhiteHeart} alt="White Heart" style={{height:likeIconHeight}} />}
            <p style={{fontSize:fontSize, lineHeight:lineHeight}}>{likesCount}</p>
        </div>
    )
}

export default LikeButton

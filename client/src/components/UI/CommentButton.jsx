import React from 'react'
import WhiteComment from '../../assets/WhiteComment.webp'
import PurpleComment from '../../assets/PurpleComment.webp'

function CommentButton({ isCommented = false, commentsCount = 0, commentIconHeight = "30px", fontSize = "1.5rem", lineHeight="1.8rem" }) {
    return (
        <div className="views">
            {isCommented ? <img src={PurpleComment} alt="Purple Comment" style={{height:commentIconHeight, minWidth:commentIconHeight}} /> : <img src={WhiteComment} alt="White Comment" style={{height:commentIconHeight, minWidth:commentIconHeight}} />}
            <p style={{fontSize:fontSize, lineHeight:lineHeight}}>{commentsCount}</p>
        </div>
    )
}

export default CommentButton

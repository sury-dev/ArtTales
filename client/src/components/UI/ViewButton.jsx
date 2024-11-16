import React from 'react'
import WhiteView from '../../assets/WhiteView.webp'
import './ViewButton.css'

function ViewButton({ view = 0,  viewIconHeight = "30px", fontSize = "1.5rem", lineHeight="1.8rem" }) {
    return (
        <div className="views">
            <img src={WhiteView} alt="White View" style={{height:viewIconHeight, minWidth:viewIconHeight}} />
            <p style={{fontSize:fontSize, lineHeight:lineHeight}}>{view}</p>
        </div>
    )
}

export default ViewButton

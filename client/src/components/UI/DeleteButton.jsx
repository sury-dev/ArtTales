import React from 'react'
import './DeleteButton.css'
import WhiteTrash from '../../assets/WhiteTrash.webp'

function DeleteButton({ onDelete=(()=>{}), deleteIconHeight = "30px"}) {
    return (
        <button onClick={onDelete}><img src={WhiteTrash} alt="White Trash" className='deleteButton' style={{height: deleteIconHeight, aspectRatio: '1/1'}} /></button>
    )
}

export default DeleteButton

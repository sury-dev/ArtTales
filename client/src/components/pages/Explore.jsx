import React, { useState, useEffect } from 'react'
import artPostService from '../../server/artPostService'
import ArtPostCards from '../UI/ArtPostCards'
import './Explore.css'
import { Outlet, useNavigate } from 'react-router-dom'

function Explore() {

    const [artPosts, setArtPosts] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)
    const navigate = useNavigate()
    useEffect(()=>{
        artPostService.getAllArtPosts({page: 1, limit: 100, query: ''})
            .then((postData) => {
                if(postData && postData.status === 200){
                    setArtPosts(postData.data.data)
                    console.log("Explore :: useEffect :: postData :: ", postData)
                }
            })
            .catch((error) => {
                console.log("Explore :: useEffect :: error :: ", error)
            })
    }, [])

    const handleCardClick = (post) => {
        setSelectedPost(post)
        navigate(`/artpost/${post._id}`)
    }

    const closeModal = () => {
        setSelectedPost(null)
        navigate('/')
    }

    return (
        <div className='explore bg-black text-white'>
            {artPosts.map((post, index) => (
                <ArtPostCards key={post._id} {...post} index={index} onClick={() => handleCardClick(post)} />
            ))}
            {artPosts.map((post, index) => (
                <ArtPostCards key={post._id} {...post} index={index + 11} onClick={() => handleCardClick(post)} />
            ))}
            {artPosts.map((post, index) => (
                <ArtPostCards key={post._id} {...post} index={index + 22} onClick={() => handleCardClick(post)} />
            ))}
            {artPosts.map((post, index) => (
                <ArtPostCards key={post._id} {...post} index={index + 33} onClick={() => handleCardClick(post)} />
            ))}
            <Outlet context={{closeModal}} />
        </div>
    )
}

export default Explore

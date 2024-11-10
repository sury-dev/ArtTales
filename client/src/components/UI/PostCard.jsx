import React from 'react'
import { Link } from 'react-router-dom'

function PostCard({_id, artFile, title, description, view, owner}) {
    return (
        <Link to={`/post/${_id}`}>
            <div className='w-full md:w-1/2 lg:w-1/3 p-4'>
                <div className='bg-white rounded-md shadow-md'>
                    <img src={artFile} alt={title} className='w-full h-48 object-cover rounded-t-md' />
                    <div className='p-4'>
                        <h2 className='text-xl font-semibold'>{title}</h2>
                        <p className='text-gray-600'>{description}</p>
                        <div className='flex justify-between items-center mt-4'>
                            <div className='flex items-center'>
                                <img src={`${artFile}`} />
                            </div>
                            <span className='text-gray-600'>{view} views</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>

    )
}

export default PostCard

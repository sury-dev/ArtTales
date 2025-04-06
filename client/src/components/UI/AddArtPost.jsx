import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Input } from '../index.js'
import artPostService from '../../server/artPostService.js'
import './AddArtPost.css'
import Loader from './Loader.jsx'

function AddArtPost() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [image, setImage] = useState(null);
    const { register, handleSubmit, getValues } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = async (e) => {
        setError("")
        const file = e.target.files[0];
        setImage(file);
    }

    const postArt = async (data) => {
        setError("")
        setIsLoading(true);
        try {
            const obj = { ...data, artFile: image }
            if (!obj.artFile) {
                setError("Please upload an image")
                return
            }
            const response = await artPostService.postArt({ ...obj })

            if (response && response.status === 201) {
                setIsLoading(false)
                navigate('/')
            } else {
                setIsLoading(false)
                setError("Server responded with an error code " + response.status)
            }
        } catch (error) {
            setIsLoading(false);
            setError("Something went wrong while posting your art")
        }
    };

    return (
        <form className='addArtPostForm bg-black' onSubmit={handleSubmit(postArt)}>
            <div className="left">
                <div className="imagePreview">
                    {image ? <img src={URL.createObjectURL(image)} alt='preview' /> : <div className='imagePlaceholder'>Your uploaded image appears here</div>}
                </div>
                {!image ? (<input type="file" accept='image/png, image/jpg, image/jpeg, image/gif' onChange={handleImageUpload} />) : (<button onClick={() => setImage(null)}>Remove</button>)}
            </div>
            <div className="right">
                <div className="rightInputWrapper">
                    <Input type='text' name='title' placeholder='Title' {...register('title')} />
                    <textarea
                        placeholder="Tell about your Art"
                        {...register("description")}
                        rows={6}
                        className="textArea"
                    ></textarea>
                    <div className="isPublished">
                        <select name="isPublished" id="isPublished" {...register('isPublished', { required: true })}>
                            <option value={true}>Publish</option>
                            <option value={false}>Draft</option>
                        </select>
                    </div>
                    <div className="error">{error}</div>
                </div>
                {isLoading && <Loader />}
                <button type="submit">Post</button>
            </div>
            <div className="lightSource3"></div>
            <div className="lightSource4"></div>
        </form>
    )
}

export default AddArtPost

import React, { useState, useCallback, useEffect, useRef } from 'react'
import './CommentsCommentContainer.css'
import { useSelector } from 'react-redux'
import commentService from '../../server/commentService'
import likeService from '../../server/likeService.js'
import { useForm } from 'react-hook-form'
import { ProfileIcon, ArtCommentButton, LikeButton, DeleteButton } from '../index.js'

function CommentsCommentContainer({ id }) {
    // Redux state
    const userData = useSelector((state) => state.auth.userData)

    // Local state
    const [comments, setComments] = useState([])
    const [page, setPage] = useState(0)
    const [moreCommentstoLoad, setMoreCommentstoLoad] = useState(true)
    const [loading, setLoading] = useState(false)
    const [commentExpandState, setCommentExpandState] = useState({})
    const [replyExpandState, setReplyExpandState] = useState(false)

    // Hooks for form handling
    const { register, handleSubmit, reset } = useForm()

    // Refs
    const textareaReference = useRef(null)
    const commentRefs = useRef({})

    // Handlers and functions
    const showReplyBox = () => {
        setReplyExpandState((prev) => !prev)
    }

    const handleDelete = (id) => {
        try {
            commentService.deleteComment({ id }).then((response) => {
                if (response && response.status === 200) {
                    setComments((prevComments) => prevComments.filter((comment) => comment._id !== id))
                }
                else{
                    console.log("Could Not delete your comment");
                }
            })
        } catch (error) {
            console.log("ArtPostModal :: handleDelete :: error :: ", error);
        }
    }

    const sizeFunction = (target) => {
        target.style.height = 'auto'
        target.style.height = target.scrollHeight + 'px'
        textareaReference.current = target
    }

    const measureHeight = (commentId) => {
        const commentElement = commentRefs.current[commentId]
        return commentElement ? commentElement.scrollHeight : 'auto'
    }

    const handleCommentLike = async (commentId) => {
        try {
            // Update like state locally
            const updatedComments = comments.map((comment) => {
                if (comment._id === commentId) {
                    const isLiked = !comment.isLiked
                    const likesCount = isLiked ? comment.likesCount + 1 : comment.likesCount - 1
                    return { ...comment, isLiked, likesCount }
                }
                return comment
            })
            setComments(updatedComments)

            // Send like/unlike request to server
            await likeService.likeComment({ commentId })
        } catch (error) {
            console.log("ArtCommentContainer :: handleCommentLike :: error :: ", error)
        }
    }

    const addComment = useCallback(async (data) => {
        setReplyExpandState(false)
        try {
            data.content = data.content.trim()
            if (!data.content) return
            const response = await commentService.addCommentComment({ id, content: data.content })
            if (response && response.status === 201) {
                setComments((prevComments) => [response.data.data[0], ...prevComments])
                reset()
            }
        } catch (error) {
            console.log("CommentsCommentContainer :: addComment :: error :: ", error)
        }
    }, [id, reset])

    const loadMoreComments = useCallback(() => {
        setPage((prev) => prev + 1)
    }, [])

    const toggleCommentContent = (commentId) => {
        setCommentExpandState((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId],
        }))
    }

    // Fetch comments on component mount or page change
    useEffect(() => {
        const fetchComments = async () => {
            try {
                if (!id || page === 0) return
                const response = await commentService.getCommentsComment({ id, page })
                if (response && response.status === 200) {
                    if (page === 1) {
                        setComments(response.data.data)
                        if (response.data.data.length < 5) setMoreCommentstoLoad(false)
                    } else {
                        setComments((prevComments) => [...prevComments, ...response.data.data])
                        if (response.data.data.length < 5) setMoreCommentstoLoad(false)
                    }
                }
            } catch (error) {
                console.log("CommentsCommentContainer :: fetchComments :: error :: ", error)
            }
        }
        fetchComments()
    }, [id, page])

    if (!id) return null
    if (loading) return <div className='loading'>Loading...</div>

    // JSX
    return (
        <div className='commentsCommentContainer'>
            {!replyExpandState ? (
                <button onClick={showReplyBox}>Reply</button>
            ) : (
                <form className='commentForm' onSubmit={handleSubmit(addComment)}>
                    <div className="comment-container">
                        <ProfileIcon profileIcon={userData.avatar} width="35px" />
                        <ArtCommentButton
                            sizeFunction={sizeFunction}
                            className="comment-input"
                            placeholder="Add a comment"
                            {...register("content")}
                        />
                        <button type="submit" className="comment-submit">Reply</button>
                    </div>
                </form>
            )}
            <div className='comments'>
                {comments.map((comment) => (
                    <div key={comment._id} className="comment-box">
                        <ProfileIcon profileIcon={comment.owner.avatar} className="comment-profile-icon" width="35px" />
                        <div className="comment-content">
                            <div className="comment-first-line">
                                <p className="comment-content-username">@{comment.owner.username}</p>
                                <LikeButton
                                    isLiked={comment.isLiked}
                                    likesCount={comment.likesCount}
                                    fontSize='1.3rem'
                                    lineHeight='1.5rem'
                                    likeIconHeight='25px'
                                    onLike={() => handleCommentLike(comment._id)}
                                />
                                {userData._id === comment.owner._id && (<DeleteButton onDelete={()=>{handleDelete(comment._id)}} deleteIconHeight='25px'/>)}
                                {/* <p>Comment ID : {comment._id}</p> */}
                            </div>
                            <p
                                ref={(el) => commentRefs.current[comment._id] = el}
                                className="comment-content-comment"
                                style={{
                                    height: commentExpandState[comment._id] ? `${measureHeight(comment._id)}px` : '2rem',
                                }}
                                onClick={() => toggleCommentContent(comment._id)}
                            >
                                {comment.content}
                            </p>
                            <CommentsCommentContainer id={comment._id} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="show-hide-comments-comment">
                {moreCommentstoLoad && <button className='loadMoreComments' onClick={loadMoreComments}>Load Comments</button>}
                {page !== 0 && <button className='loadMoreComments' onClick={() => { setPage(0); setComments([]); setMoreCommentstoLoad(true) }}>Hide</button>}
            </div>
        </div>
    )
}

export default CommentsCommentContainer

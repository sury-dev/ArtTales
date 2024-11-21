import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import commentService from '../../server/commentService';
import likeService from '../../server/likeService';
import { ArtCommentButton, ProfileIcon, LikeButton, CommentsCommentContainer, DeleteButton } from '../index';
import './ArtCommentContainer.css';

function ArtCommentContainer({ id }) {
    if (!id) return null;

    // Retrieve user data from Redux store
    const userData = useSelector((state) => state.auth.userData);

    // State variables
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [moreCommentstoLoad, setMoreCommentstoLoad] = useState(true);
    const [numberOfComments, setNumberOfComments] = useState(0);
    const [commentExpandState, setCommentExpandState] = useState({});
    const { register, handleSubmit, reset } = useForm();

    // Refs
    const textareaReference = useRef(null);
    const commentRefs = useRef({});

    // Adds a new comment
    const addComment = useCallback(async (data) => {
        resetSize();
        try {
            data.content = data.content.trim();
            if (!data.content) return;
            const response = await commentService.addArtComment({ id, content: data.content });
            if (response && response.status === 201) {
                setComments((prevComments) => [response.data.data.comments, ...prevComments]);
                reset();
                setNumberOfComments((prev) => prev + 1);
            }
        } catch (error) {
            console.log("ArtCommentContainer :: addComment :: error :: ", error);
        }
    }, [id, reset]);

    // Load more comments when requested
    const loadMoreComments = useCallback(() => {
        setPage((prev) => prev + 1);
    }, []);

    // Toggles expanded state of a comment
    const toggleCommentContent = (commentId) => {
        setCommentExpandState((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId],
        }));
    };

    // Measures height for expanded comment
    const measureHeight = (commentId) => {
        const commentElement = commentRefs.current[commentId];
        return commentElement ? commentElement.scrollHeight : 'auto';
    };

    const handleDelete = (id) => {
        try {
            commentService.deleteComment({ id }).then((response) => {
                if (response && response.status === 200) {
                    setComments((prevComments) => prevComments.filter((comment) => comment._id !== id));
                    setNumberOfComments((prev) => prev - 1);
                }
                else{
                    console.log("Could Not delete your comment");
                }
            })
        } catch (error) {
            console.log("ArtPostModal :: handleDelete :: error :: ", error);
        }
    }

    // Handles like functionality for comments
    const handleCommentLike = async (commentId) => {
        try {
            const updatedComments = comments.map((comment) => {
                if (comment._id === commentId) {
                    const isLiked = !comment.isLiked;
                    const likesCount = isLiked ? comment.likesCount + 1 : comment.likesCount - 1;
                    return { ...comment, isLiked, likesCount };
                }
                return comment;
            });
            setComments(updatedComments);

            await likeService.likeComment({ commentId });
        } catch (error) {
            console.log("ArtCommentContainer :: handleCommentLike :: error :: ", error);
        }
    };

    // Adjusts the textarea height as per the content
    const sizeFunction = (target) => {
        target.style.height = 'auto';
        target.style.height = target.scrollHeight + 'px';
        textareaReference.current = target;
    };

    // Resets the textarea height and clears the content
    const resetSize = () => {
        if (textareaReference.current) {
            textareaReference.current.style.height = 'auto';
            textareaReference.current.value = '';
        }
    };

    // Fetch comments and handle pagination
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await commentService.getArtComment({ id, page });
                if (response?.status === 200) {
                    setNumberOfComments(response.data.data.totalCommentCount);
                    const newComments = response.data.data.comments;
                    if (page === 1) {
                        setComments(newComments);
                        setMoreCommentstoLoad(newComments.length >= 5);
                    } else {
                        setComments((prevComments) => [...prevComments, ...newComments]);
                        setMoreCommentstoLoad(newComments.length >= 5);
                    }
                }
            } catch (error) {
                console.log("ArtCommentContainer :: useEffect :: error :: ", error);
            }
        };

        fetchComments();
    }, [id, page]);

    // Render null if user data isn't available yet
    if (!userData) return null;

    return (
        <div className='art-comments-wrapper'>
            <p>{numberOfComments} Comments</p>
            <form onSubmit={handleSubmit(addComment)}>
                <div className="comment-container">
                    <ProfileIcon profileIcon={userData.avatar} width="50px" />
                    <ArtCommentButton
                        sizeFunction={sizeFunction}
                        className="comment-input"
                        placeholder="Add a comment"
                        {...register("content")}
                    />
                    <button type="submit" className="comment-submit">Comment</button>
                </div>
            </form>
            <div className="comments">
                {comments && comments.map((comment) => (
                    <div key={comment._id} className="comment-box">
                        <ProfileIcon profileIcon={comment.owner.avatar} className="comment-profile-icon" width="50px" />
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
                <div className="show-hide-art-comment">
                    {moreCommentstoLoad && (
                        <button onClick={loadMoreComments}>Load more comments</button>
                    )}
                    <button onClick={() => { setPage(1); setMoreCommentstoLoad(true); }}>Hide</button>
                </div>
            </div>
        </div>
    );
}

export default ArtCommentContainer;

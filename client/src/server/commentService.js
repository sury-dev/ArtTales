import axios from "axios";

export class CommentService {
    async getArtComment({id, page, limit=5}){
        try {
            const postData = await axios.get(`/api/comments/get-comments-of-art/${id}?page=${page}&limit=${limit}`);
            if(postData && postData.status === 200){
                return postData;
            }
            else{
                return postData;
            }
        } catch (error) {
            console.log("Server :: CommentService :: getArtComment :: error :: ", error);
            return error.response;
        }
    }
    async addArtComment({id, content}){
        try {
            const postData = await axios.post(`/api/comments/comment-to-art/${id}`, {content});
            if(postData && postData.status === 200){
                return postData;
            }
            else{
                return postData;
            }
        } catch (error) {
            console.log("Server :: CommentService :: addArtComment :: error :: ", error);
            return error.response;
        }
    }
    async getCommentsComment({id, page, limit=5}){
        try {
            const commentData = await axios.get(`/api/comments/get-comments-of-comment/${id}?page=${page}&limit=${limit}`);
            if(commentData && commentData.status === 200){
                return commentData;
            }
            else{
                return commentData;
            }
        } catch (error) {
            console.log("Server :: CommentService :: getCommentsComment :: error :: ", error);
            return error.response;
        }
    }
    async addCommentComment({id, content}){
        try {
            const commentData = await axios.post(`/api/comments/comment-to-comment/${id}`, {content});
            if(commentData && commentData.status === 201){
                return commentData;
            }
            else{
                return commentData;
            }
        } catch (error) {
            console.log("Server :: CommentService :: addCommentComment :: error :: ", error);
            return error.response;
        }
    }
    async deleteComment({id}){
        try {
            const commentData = await axios.delete(`/api/comments/delete-comment/${id}`);
            if(commentData && commentData.status === 200){
                return commentData;
            }
            else{
                return commentData;
            }
        } catch (error) {
            console.log("Server :: CommentService :: deleteComment :: error :: ", error);
            return error.response;
        }
    }
}

const commentService = new CommentService();

export default commentService;
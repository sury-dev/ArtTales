import axios from "axios";

export class LikeService {
    async likeArtPost({id}){
        try {
            const postData = await axios.patch(`/api/likes/toggle-art-like/${id}`);
            if(postData && postData.status === 200){
                return postData;
            }
            else{
                return postData;
            }
        } catch (error) {
            console.log("Server :: PostService :: likePost :: error :: ", error);
            return error.response;
        }
    }
    async likeComment({commentId}){
        try {
            const commentData = await axios.patch(`/api/likes/toggle-comment-like/${commentId}`);
            if(commentData && commentData.status === 200){
                return commentData;
            }
            else{
                return commentData;
            }
        } catch (error) {
            console.log("Server :: PostService :: likeComment :: error :: ", error);
            return error.response;
        }
    }
}

const likeService = new LikeService();

export default likeService;
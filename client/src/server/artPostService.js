import axios from "axios";

export class ArtPostService {
    async getAllArtPosts({page, limit, query}){
        try {
            const postData = await axios.get(`/api/art/get-all-posts?page=${page}&limit=${limit}`);
            if(postData && postData.status === 200){
                return postData;
            }
            else{
                return postData;
            }
        } catch (error) {
            console.log("Server :: PostService :: getAllPosts :: error :: ", error);
            return error.response;
        }
    }

    async getArtPost({id}){
        try {
            const postData = await axios.get(`/api/art/artPost/${id}`);
            if(postData && postData.status === 200){
                return postData;
            }
            else{
                return postData;
            }
        } catch (error) {
            console.log("Server :: PostService :: getPost :: error :: ", error);
            return error.response;
        }
    }

    async incrementArtView({id}){
        try {
            const postData = await axios.patch(`/api/art/increment-view-count/${id}`);
            if(postData && postData.status === 200){
                return postData;
            }
            else{
                return postData;
            }
        } catch (error) {
            console.log("Server :: PostService :: incrementView :: error :: ", error);
            return error.response;
        }
    }
}

const artPostService = new ArtPostService();

export default artPostService;
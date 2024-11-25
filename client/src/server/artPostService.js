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

    async postArt({title, description, isPublished, artFile}){
        try {

            const formData = new FormData();
            const data = {
                title,
                description,
                isPublished
            }
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });
            console.log("artFile :: ", artFile);
            formData.append("artFile", artFile);

            const postData = await axios.post(`/api/art/post`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if(postData && postData.status === 201){
                return postData;
            }
            else{
                return postData;
            }
        } catch (error) {
            console.log("Server :: PostService :: postArt :: error :: ", error);
            return error.response;
        }
    }

    async getProfileArtPosts({page, limit, query='', username}){
        try {
            const url = `/api/art/get-profile-art-posts/${username}?page=${page}&limit=${limit}`;
            const postData = await axios.get(url);
            if(postData && postData.status === 200){
                return postData;
            }
            else{
                return postData;
            }
        } catch (error) {
            console.log("Server :: PostService :: getProfileArtPosts :: error :: ", error);
            return error.response;
        }
    }

    async deleteArtPost({id}){
        try {
            const postData = await axios.delete(`/api/art/delete-art-post/${id}`);
            if(postData && postData.status === 201){
                return postData;
            }
            else{
                return postData;
            }
        } catch (error) {
            console.log("Server :: PostService :: deleteArtPost :: error :: ", error);
            return error.response;
        }
    }
}

const artPostService = new ArtPostService();

export default artPostService;
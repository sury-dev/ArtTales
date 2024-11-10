import axios from "axios";

export class PostService {
    constructor() {
        const healthCheck = axios.get("http://localhost:7000/health")
        console.log(healthCheck);
    }

    async createPost({artFile, title, description, isPublished}){
        try {
            const postData = await axios.post("/api/posts/create", {artFile, title, description, isPublished});
            return postData;
        } catch (error) {
            console.log("Server :: PostService :: createPost :: error :: ", error);
        }
    }
}

const postService = new PostService();

export default postService;
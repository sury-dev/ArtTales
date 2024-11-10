import axios from "axios";
import { useNavigate } from "react-router-dom";

export class UserService {
    constructor() {
        // const healthCheck = await axios.get("http://localhost:7000/health")
        console.log("UserService :: constructor");
    }

    async createUser({username, email, phoneNumber, firstName, lastName, dateOfBirth, password, avatar, coverImage, bio, profession}){
        try {

            const formData = new FormData();

            const fields = { username, email, phoneNumber, firstName, lastName, dateOfBirth, password, bio, profession };
            Object.entries(fields).forEach(([key, value]) => formData.append(key, value));

            formData.append("avatar", avatar[0]);

            if(coverImage){
                formData.append("coverImage", coverImage[0]);
            }

            const userData = await axios.post("/api/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if(userData && userData.status === 200){
                //call login function
                this.loginUser({username, email, password});
            }
            else{
                return userData;
            }
        } catch (error) {
            console.log("Server :: AuthService :: createUser :: error :: ", error);
        }
    }

    async loginUser({username , email , password}){
        try {
            const userData = await axios.post("/api/users/login", { username, email, password }, {
                withCredentials: true // Include credentials here
            });
            return userData;
        } catch (error) {
            console.log("Server :: AuthService :: loginUser :: error :: ", error);
        }
    }

    async getCurrentUser(){
        try {
            const userData = await axios.get("/api/users/current-user");
            return userData;
        } catch (error) {
            console.log("Server :: AuthService :: getCurrentUser :: error :: ", error);
        }

        return null;
    }

    async logoutUser(){
        try {
            const userData = await axios.post("/api/users/logout");
            return userData;
        } catch (error) {
            console.log("Server :: AuthService :: logoutUser :: error :: ", error);
        }
    }
}

const userService = new UserService();

export default userService;
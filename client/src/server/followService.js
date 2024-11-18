import axios from "axios";

class FollowService{
    async toggleFollow({id}){
        try {
            await axios.patch(`/api/follow/toggle-follow/${id}`)
            .then((response)=>{
                if(response && response.status === 200){
                    return response;
                }
                else{
                    return response;
                }
            })
        } catch (error) {
            console.log("Server :: FollowService :: toggleFollow :: error :: ", error);
        }
    }
}

const followService = new FollowService();

export default followService;
import mongoose, {Schema} from "mongoose";

const folowSchema = new Schema({
    follower : {
        type : Schema.Types.ObjectId, // One who is following
        ref : "User"
    },
    profile : {
        type : Schema.Types.ObjectId, // One to whome 'subscriber' is subscribing
        ref : "User"
    }
    },
    {
        timestamps : true
    }
)

export const Profile = mongoose.model("Profile", profileSchema);
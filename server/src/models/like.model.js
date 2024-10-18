import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
    {
        artPost : {
            type : Schema.Types.ObjectId,
            ref : "ArtPost"
        },
        talePost : {
            type : Schema.Types.ObjectId,
            ref : "TalePost"
        },
        album : {
            type : Schema.Types.ObjectId,
            ref : "Album"
        },
        comment : {
            type : Schema.Types.ObjectId,
            ref : "Comment"
        },
        likedBy : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
    },
    {
        timestamps : true
    }
)

export const Like = mongoose.model("Like", likeSchema);
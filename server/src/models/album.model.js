import mongoose, { Schema } from "mongoose";

const albumSchema = new Schema(
    {
        title:{
            type : String,
            required : true
        },
        description:{
            type : String
        },
        thumbnail : {
            type : String,
            required : false
        },
        artPost : [{
            type : Schema.Types.ObjectId,
            ref : "ArtPost"
        }],
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    }
)

export const Album = mongoose.model("Album", albumSchema);
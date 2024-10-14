import mongoose, { Schema } from "mongoose";

const albumSchema = new Schema(
    {
        name:{
            type : String,
            required : true
        },
        description:{
            type : String,
            required : true
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
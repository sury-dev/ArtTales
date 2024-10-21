import mongoose, { Schema } from "mongoose";

const taleBookSchema = new Schema(
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

export const TaleBook = mongoose.model("TaleBook", taleBookSchema);
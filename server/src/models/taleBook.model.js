import mongoose, { Schema } from "mongoose";

const taleBookSchema = new Schema(
    {
        name:{
            type : String,
            required : true
        },
        description:{
            type : String,
            required : true
        },
        talePost : [{
            type : Schema.Types.ObjectId,
            ref : "TalePost"
        }],
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    }
)

export const TaleBook = mongoose.model("TaleBook", taleBookSchema);
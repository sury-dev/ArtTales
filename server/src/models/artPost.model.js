import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const artPostSchema = new Schema(
    {
        artFile:{
            type : String, //Clodinary URL
            required : true
        },
        title:{
            type : String,
            required : true
        },
        description:{
            type : String,
            required : true
        },
        view:{
            type:Number,
            default:0
        },
        isPublished:{
            type : Boolean,
            default : true
        },
        owner:{
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {
        timestamps : true
    }
)

artPostSchema.plugin(mongooseAggregatePaginate);

export const ArtPost = mongoose.model("ArtPost", artPostSchema);
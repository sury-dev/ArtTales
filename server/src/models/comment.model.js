import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        artPost: {
            type: Schema.Types.ObjectId,
            ref: "ArtPost"
        },
        talePost: {
            type: Schema.Types.ObjectId,
            ref: "Tale"
        },
        comment : {
            type : Schema.Types.ObjectId,
            ref : "Comment"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)
import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        username:{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true
        },
        email:{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        phoneNumber : {
            type : String,
            unique : true,
            trim : true
        },
        firstName:{
            type : String,
            required : true,
            trim : true
        },
        lastName:{
            type : String,
            required : true,
            trim : true
        },
        dateOfBirth:{
            type : String,
            trim : true
        },
        bio:{
            type : String,
            trim : true
        },
        profession:{
            type : String,
            trim : true
        },
        avatar:{
            type : String, //clodinary url
            required : true
        },
        coverImage:{
            type : String //clodinary url
        },
        savedArtPost:[
            {
                type:Schema.Types.ObjectId,
                ref:"ArtPost"
            }
        ],
        savedTalePost:[
            {
                type:Schema.Types.ObjectId,
                ref:"TalePost"
            }
        ],
        password : {
            type : String,
            required : [true, "Password is required"]
        },
        refreshToken : {
            type : String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {

    if(!this.isModified("password")) return next(); //run only if password is modified

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function (){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            firstName : this.firstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function (){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
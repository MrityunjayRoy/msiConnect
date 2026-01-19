import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// User Schema
const userSchema = new Schema(
    {
        fullname: {
            type: String,
            default: function () {
                return this.username
            }
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    return emailRegex.test(value)
                },
                message: "Invalid Email format!",
            },
        },
        password: {
            type: String,
            required: true,
            minLength: [8, "Password must be 8 chars long"],
            select: false,
        },
        avatar: {
            type: String,
            required: false
        },
        bio: {
            type: String,
            default: "real",
        },
        followers: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        followings: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        likedPosts: {
            type: [Schema.Types.ObjectId],
            ref: "Post",
            default: [],
        },
        savedPosts: {
            type: [Schema.Types.ObjectId],
            ref: "Post",
            default: [],
        }
    },
    {
        timestamps: true,
        collection: "user-data"
    }
)

// bcrypt to hash the password before saving it in the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// methods to compare with encyrpted password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// user model
const User = mongoose.model("User", userSchema)

export { User }

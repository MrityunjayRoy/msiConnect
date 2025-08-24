import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// User Schema
const userSchema = new Schema(
    {
        enrollID: {
            type: Number,
            required: true,
            unique: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true
        },
        course: {
            type: String,
            required: true,
            enum: ['BCA']
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        avatar: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

// bcrypt to hash the password before saving it in the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10)
    next()
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
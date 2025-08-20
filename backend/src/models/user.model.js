import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

// --- Notes ---
// how year should be handled
// should i add jwt or not?

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
        avatar: {
            type: String,
            required: false
        }
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

// user model
const user = mongoose.model("User", userSchema)

export { user }
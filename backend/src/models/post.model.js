import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        postTitle: {
            type: String,
            required: true,
        },
        postDesc: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: String,
            required: true,
        },
        tag: {
            type: [String],
            default: [],
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Post = mongoose.model("Post", postSchema);

import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        postBody: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            type: String,
            default: []
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            default: null,
        },
        editedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        collection: "post-data"
    }
);

export const Post = mongoose.model("Post", postSchema);

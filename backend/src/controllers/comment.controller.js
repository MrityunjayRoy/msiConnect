import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

import { APIResponse } from "../utils/APIResponse.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create a comment on a post
export const createComment = asyncHandler(async (req, res) => {
    console.log("creating comment...");
    const userId = req.user?._id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!userId) {
        throw new APIError(401, "User not authenticated");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new APIError(404, "Post not found");
    }

    const comment = await Comment.create({
        userID: userId,
        postID: postId,
        data: content,
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json(new APIResponse(200, "Comment created successfully", comment));
});

// get all comments for a post
export const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ postID: postId }).populate("userID", "fullname enrollID course year avatar");
    return res.status(200).json(new APIResponse(200, "Comments fetched successfully", comments));
});

// delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new APIError(404, "Comment not found");
    }
    if (comment.userID.toString() !== userId.toString()) {
        // console.log(comment.userID.toString(), userId.toString());
        throw new APIError(403, "Not authorized");
    }
    await comment.deleteOne();
    await Post.findByIdAndUpdate(comment.postID, { $pull: { comments: comment._id } });
    return res.status(200).json(new APIResponse(200, "Comment deleted", { message: "Comment deleted" }));
});

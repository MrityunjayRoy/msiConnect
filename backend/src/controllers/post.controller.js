import { APIResponse } from "../utils/APIResponse.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCLoudinary } from "../utils/cloudinary.js";

// create a post
export const createPost = asyncHandler(async (req, res) => {
    console.log("creatin post...");
    const userId = req.user?._id;
    const course = req.user?.course || "";
    const { title, content, tag, images } = req.body;

    const postImagesLocal = req.files?.images[0]?.path;

    const postImages = await uploadOnCLoudinary(postImagesLocal)

    if (!userId) {
        throw new APIError(401, "User not authenticated");
    }

    const post = await Post.create({
        postTitle: title,
        postDesc: content,
        userId: userId,
        course,
        tag: tag || [],
        images: postImages?.url,
        comments: [],
    });
    return res.status(200).json(new APIResponse(200, "Post created successfully", post));
});

// get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate("userId", "fullname enrollID course year avatar")
        .populate({
            path: "comments",
            populate: { path: "userID", select: "fullname enrollID course year avatar" },
        });
    return res.status(200).json(new APIResponse(200, "Posts fetched successfully", posts));
});

// Get all posts of a user
export const getPostsByUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const posts = await Post.find({ userId })
        .populate("userId", "fullname enrollID course year avatar")
        .populate({
            path: "comments",
            populate: { path: "userID", select: "fullname enrollID course year avatar" },
        });
    return res.status(200).json(new APIResponse(200, "User's posts fetched successfully", posts));
});

// get single post
export const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId)
        .populate("userId", "fullname enrollID course year avatar")
        .populate({
            path: "comments",
            populate: { path: "userID", select: "fullname enrollID course year avatar" },
        });
    if (!post) {
        throw new APIError(404, "Post not found");
    }
    return res.status(200).json(new APIResponse(200, "Post fetched successfully", post));
});

// delete post
export const deletePost = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        throw new APIError(404, "Post not found");
    }
    if (post.userId.toString() !== userId.toString()) {
        // console.log(post.userId.toString(), userId.toString());
        throw new APIError(403, "Not authorized");
    }
    await Comment.deleteMany({ postID: postId });
    await post.deleteOne();
    return res.status(200).json(new APIResponse(200, "Post deleted successfully", { message: "Post deleted" }));
});

// Like a post
export const likePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) throw new APIError(404, "Post not found");

    if (post.likes.includes(userId)) {
        throw new APIError(400, "You have already liked this post");
    }

    post.likes.push(userId);
    await post.save();

    return res.json(new APIResponse(200, post, "Post liked"));
});

// Unlike a post
export const unlikePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) throw new APIError(404, "Post not found");

    if (!post.likes.includes(userId)) {
        throw new APIError(400, "You have not liked this post");
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();

    return res.json(new APIResponse(200, post, "Post unliked"));
});

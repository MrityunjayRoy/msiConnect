import express from "express";
import { createPost, getAllPosts, getPostById, deletePost, likePost, unlikePost, getPostsByUser } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/user/:userId", getPostsByUser);
router.get("/:postId", getPostById);
router.delete("/:postId", deletePost);
router.post("/:id/like", likePost);
router.post("/:id/unlike", unlikePost);

export { router as postRouter };

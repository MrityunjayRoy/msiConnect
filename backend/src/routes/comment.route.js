import express from "express";
import { createComment, getCommentsByPost, deleteComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/:postId", createComment);
router.get("/:postId", getCommentsByPost);
router.delete("/:commentId", deleteComment);

export { router as commentRouter };

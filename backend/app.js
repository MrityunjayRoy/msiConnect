import express from "express";
import { userRouter } from "./src/routes/user.route.js";
import { postRouter } from "./src/routes/post.route.js";
import { commentRouter } from "./src/routes/comment.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/real", (req, res) => {
    res.send("skill issue");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

export { app };

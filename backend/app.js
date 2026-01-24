import express from "express";
import { userRouter } from "./src/routes/user.route.js";
import { postRouter } from "./src/routes/post.route.js";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static(
    "public"
));
app.use(cookieParser())

app.get("/real", (req, res) => {
    res.send("skill issue");
});

// base routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

export { app };

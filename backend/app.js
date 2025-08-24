import express from "express";
import { userRouter } from "./src/routes/user.route.js";
import cookieParser from "cookie-parser";

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get("/real", (req, res) => {
    res.send("skill issue")
})

app.use("/api/v1/user", userRouter)

export { app }
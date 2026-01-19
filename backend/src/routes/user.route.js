import { Router } from "express"
import { getCurrentUser, loginUser, userLogout, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    registerUser
)

router.route("/login").post(
    loginUser
)

router.route("/logout").get(
    verifyJWT,
    userLogout
)

router.route("/me").get(
    verifyJWT,
    getCurrentUser
)

export { router as userRouter }
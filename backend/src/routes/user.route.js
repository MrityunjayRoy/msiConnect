import { Router } from "express"
import { getUser, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    userRegister
)

router.route("/login").post(
    userLogin
)

router.route("/logout").get(
    verifyJWT,
    userLogout
)

router.route("/:enrollID").get(
    verifyJWT,
    getUser
)

export {router as userRouter}
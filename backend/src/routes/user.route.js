import { Router } from "express"
import { getCurrentUser, loginUser, userLogout, registerUser, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
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

router.route("/:username").get(
    getUserProfile
)

router.route("/update-profile").patch(
    verifyJWT,
    updateUserProfile
)

export { router as userRouter }
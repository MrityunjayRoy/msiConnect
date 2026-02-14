import { Router } from "express"
import {
    getCurrentUser,
    loginUser,
    userLogout,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    followUnfollowUser,
    getFollowerings,
    getFollowers
} from "../controllers/user.controller.js";
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

router.route("/all").get(
    getAllUsers
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

router.route("/follow/:userToRelateId").post(
    verifyJWT,
    followUnfollowUser
)

router.route("/:username/followings").get(
    verifyJWT,
    getFollowerings
)

router.route("/:username/followers").get(
    verifyJWT,
    getFollowers
)

export { router as userRouter }
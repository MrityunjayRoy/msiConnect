import jwt from "jsonwebtoken";
import { APIError } from "../utils/APIError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // console.log("Cookies:", req.cookies)
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new APIError(401, "Unauthorized access");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // console.log(user);

        if (!user) {
            throw new APIError(401, "Invalid token access");
        }

        req.user = user;

        next();
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid access token");
    }
});

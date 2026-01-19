import { User } from "../models/user.model.js";
import { APIResponse } from "../utils/APIResponse.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCLoudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new APIError(500, error.message)
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password, bio } = req.body

    if ([email, username, password].some((field) => field.trim() === "")) {
        throw new APIError(400, "All field are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username, email }]
    })

    if (existingUser) {
        throw new APIError(400, "User already exists")
    }

    const avatarLocal = req.files?.avatar[0]?.path
    if (!avatarLocal) {
        throw new APIError(400, "Avatar is required")
    }

    const avatar = await uploadOnCLoudinary(avatarLocal)

    const user = await User.create({
        username: username,
        email: email,
        password: password,
        bio: bio,
        avatar: avatar
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new APIError(400, "Error registering user")
    }

    return res.status(200).json(
        new APIResponse(200, "user created succesfully", createdUser)
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username) {
        throw new APIError(401, "Username is required!!")
    }

    if (!password) {
        throw new APIError(401, "Password is required")
    }

    const user = await User.findOne({ username }).select("+password")
    if (!user) {
        throw new APIError(401, "User is not registered")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new APIError(401, "Password is invalid")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIResponse(200, "User logged in successfuly", user)
        )
})

const userLogout = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
    }

    return res
        .status(200)
        .cookie("accessToken", options)
        .cookie("refreshToken", options)
        .json(
            new APIResponse(200, "User loggedOut successfuly")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new APIError(404, "No access token detected")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?.id)

    if (!user) {
        throw new APIError(401, "Invalid refrsh token")
    }

    if (!incomingRefreshToken == user?.refreshToken) {
        throw new APIError(401, "Refresh token is either expired or used")
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

    options = {
        httpOnly: true,
        scure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", newRefreshToken)
        .json(
            new APIResponse(200, "Access token refreshed successfully", { accessToken, newRefreshToken })
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const id = req.user._id
    const user = await User.findById(id).select("-password")
    if (!user) {
        throw new APIError(400, "User doesn't exists")
    }
    return res.status(200).json(
        new APIResponse(200, "User found successfully", user)
    )
})

export {
    registerUser,
    loginUser,
    userLogout,
    getCurrentUser
}
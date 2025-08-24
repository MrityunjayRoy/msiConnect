import { User } from "../models/user.model.js";
import { APIResponse } from "../utils/APIResponse.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const userRegister = asyncHandler(async (req, res) => {
    const { enrollID, fullname, year, course, password } = req.body
    const existingUser = await User.findOne({ enrollID })

    if (existingUser) {
        throw new APIError(400, "User already exists")
    }

    const user = await User.create({
        enrollID,
        fullname,
        year,
        course,
        password
    })

    if (!user) {
        throw new APIError(400, "Error registering user")
    }

    return res.status(200).json(
        new APIResponse(300, "user created succesfully", user)
    )
})

const userLogin = asyncHandler(async (req, res) => {
    const { enrollID, password } = req.body

    if (!enrollID) {
        throw new APIError(401, "EnrollNo is required!!")
    }

    if (!password) {
        throw new APIError(401, "Password is required")
    }

    const user = await User.findOne({ enrollID })
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
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    })

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

const getUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new APIResponse(200, "User found successfully", req.user)
    )
})

export {
    userRegister,
    userLogin,
    userLogout,
    getUser
}
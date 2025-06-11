import { prisma } from "../index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";

const generateToken = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            omit: {
                password: true,
                updatedAt: true
            }
        });

        const token = jwt.sign(user, config.tokenSecret, { expiresIn: config.tokenExpiry });

        return token;
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token.");
    }
};

const register = asyncHandler(async (req, res) => {
    const { fullname, username, email, password } = req.body;

    if (!username || !email || !password || !fullname) {
        throw new ApiError(400, "All fields are required.");
    }

    const existingUser = await prisma.user.findMany({
        where: {
            OR: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() },
            ]
        }
    });

    if (!existingUser) {
        throw new ApiError(409, "User with this username or email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username: username.toLowerCase(),
            fullname,
            email: email.toLowerCase(),
            password: hashedPassword,
        },
        omit: {
            password: true
        }
    });

    return res.status(201).json(new ApiResponse(201, { user }, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email.toLowerCase(),
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const isOldPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isOldPasswordCorrect) {
        throw new ApiError(401, "Incorrect password.");
    }

    const token = await generateToken(user.id);
    if (!token) {
        throw new ApiError(500, "Failed to generate authentication token.");
    }
    const loggedInUser = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        omit: {
            password: true
        }
    });

    const options = { httpOnly: true, secure: true };

    return res.
        status(200)
        .cookie("token", token, options)
        .json(new ApiResponse(200, { loggedInUser, token }, "User loggend in succefully."))
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({ omit: { password: true } });

    return res.status(200).json(new ApiResponse(200, { users }, "User's fetched succefully"))
})

export { register, login, getUsers }
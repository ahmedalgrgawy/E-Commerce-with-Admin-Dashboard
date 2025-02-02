import redis from "../lib/redis.js";
import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { storeToken, storeTokenInCookies } from "../utils/storeToken.js";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exist" })
        }

        const user = await User.create({ name, email, password });

        // authentication - Store Token in Redis & Cookies
        const { accessToken, refreshToken } = generateToken(user._id)

        await storeToken(user._id, refreshToken)

        storeTokenInCookies(res, accessToken, refreshToken)

        return res.status(201).json({
            success: true, message: "User created successfully", user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        // authentication - Store Token in Redis & Cookies
        const { accessToken, refreshToken } = generateToken(user._id)

        await storeToken(user._id, refreshToken)

        storeTokenInCookies(res, accessToken, refreshToken)

        return res.status(200).json({
            success: true, message: "Logged in successfully", user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            await redis.del(`refreshToken_${decodedToken.userId}`);
        }

        res.clearCookie("accessToken");

        res.clearCookie("refreshToken");

        return res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const reCreateAccessToken = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const storedToken = await redis.get(`refreshToken_${decodedToken.userId}`);


        if (refreshToken !== storedToken) {
            return res.status(401).json({ success: false, message: "Unauthorized, Invalid Refresh Token" });
        }

        const newAccessToken = jwt.sign({ userId: decodedToken.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 * 1000
        })

        return res.status(200).json({ success: true, message: "Access Token Recreated" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const getProfile = async (req, res) => {
    try {
        return res.status(200).json({ success: true, user: req.user })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }

}
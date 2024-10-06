import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { storeToken, storeTokenInCookies } from "../utils/storeToken.js";

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

        res.status(201).json({
            success: true, message: "User created successfully", user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}
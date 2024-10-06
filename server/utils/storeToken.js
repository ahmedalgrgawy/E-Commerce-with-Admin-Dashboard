import redis from "../lib/redis.js"

export const storeToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token_${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7)
}

export const storeTokenInCookies = (res, accessToken, refreshToken) => {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    })
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 * 1000
    })
}
import express from 'express'
import { login, logout, reCreateAccessToken, signup, getProfile } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.post("/recreate-token", reCreateAccessToken)

router.get("/profile", protectedRoute, getProfile)

export default router;
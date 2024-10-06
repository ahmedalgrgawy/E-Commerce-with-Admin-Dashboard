import express from 'express'
import { login, logout, reCreateAccessToken, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.post("/recreate-token", reCreateAccessToken)

export default router;
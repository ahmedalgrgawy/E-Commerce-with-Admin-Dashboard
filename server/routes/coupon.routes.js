import express from 'express'
import { protectedRoute, validateCoupon } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", protectedRoute, getCoupon)

router.post("/validate", protectedRoute, validateCoupon)

export default router;
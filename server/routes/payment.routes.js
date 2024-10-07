import express from 'express'
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { checkSuccess, createCheckoutSession } from '../controllers/payments.controller.js';

const router = express.Router();

router.post("/create-checkout-session", protectedRoute, createCheckoutSession)

router.post("/checkout-success", protectedRoute, checkSuccess)

export default router;
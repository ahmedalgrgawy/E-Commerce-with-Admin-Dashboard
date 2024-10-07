import express from 'express'
import { addToCart, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protectedRoute, getCartItems)

router.post("/add", protectedRoute, addToCart)

router.put("/update/:id", protectedRoute, updateQuantity)

router.delete("/remove", protectedRoute, removeAllFromCart)

export default router;
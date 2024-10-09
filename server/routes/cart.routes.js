import express from 'express'
import { addToCart, clearCart, getCartItems, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protectedRoute, getCartItems)

router.post("/add", protectedRoute, addToCart)

router.put("/update/:id", protectedRoute, updateQuantity)

router.post("/clear", protectedRoute, clearCart)

router.delete("/remove/:id", protectedRoute, removeAllFromCart)

export default router;
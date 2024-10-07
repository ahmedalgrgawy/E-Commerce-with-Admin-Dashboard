import express from 'express'
import { getAllProducts, getFeaturedProducts,createProduct } from '../controllers/products.controllers.js';
import { adminRoute, protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts)

router.get("/featured-products", getFeaturedProducts)

router.post("/create-product", protectedRoute, adminRoute, createProduct)

export default router;
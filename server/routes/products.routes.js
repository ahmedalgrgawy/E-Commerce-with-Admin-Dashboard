import express from 'express'
import { getAllProducts, getFeaturedProducts,createProduct, deleteProduct } from '../controllers/products.controllers.js';
import { adminRoute, protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts)

router.get("/featured-products", getFeaturedProducts)

router.post("/create-product", protectedRoute, adminRoute, createProduct)

router.delete("/delete-product/:id", protectedRoute, adminRoute ,deleteProduct)

export default router;
import express from 'express'
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, toggleFeature, getProductsByCategory } from '../controllers/products.controllers.js';
import { adminRoute, protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts)

router.get("/featured-products", getFeaturedProducts)

router.get("/recommended-products", getRecommendedProducts)

router.get("/category/:category", getProductsByCategory)

router.post("/create-product", protectedRoute, adminRoute, createProduct)

router.patch("/update-feature/:id", protectedRoute, adminRoute, toggleFeature)

router.delete("/delete-product/:id", protectedRoute, adminRoute, deleteProduct)

export default router;
import express from 'express'
import { getAllProducts } from '../controllers/products.controllers.js';
import { adminRoute, protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts)

export default router;
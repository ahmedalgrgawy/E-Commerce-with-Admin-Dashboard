import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getAnalytics);

export default router
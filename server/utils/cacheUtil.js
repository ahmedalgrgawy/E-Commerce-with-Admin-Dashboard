import redis from "../lib/redis.js";
import Product from "../models/products.model.js";

export const updateFeaturedProductsCache = async () => {
    try {

        const featuredProducts = await Product.find({ featured: true }).sort({ createdAt: -1 }).lean();

        await redis.set("featuredProducts", JSON.stringify(featuredProducts));

    } catch (error) {
        throw error
    }
}
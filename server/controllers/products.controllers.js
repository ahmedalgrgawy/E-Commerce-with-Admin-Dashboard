import cloudinary from "../lib/cloudinary.js";
import redis from "../lib/redis.js";
import Product from "../models/products.model.js"
export const getAllProducts = async (req, res) => {
    try {

        const products = await Product.find({}).sort({ createdAt: -1 });

        return res.status(200).json(products)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {

        let featuredProducts = await redis.get("featuredProducts");

        if (featuredProducts) {
            return res.status(200).json(JSON.parse(featuredProducts))
        }

        featuredProducts = await Product.find({ featured: true }).sort({ createdAt: -1 }).lean();

        if (!featuredProducts) return res.status(404).json({ message: "No featured products found" })

        await redis.set("featuredProducts", JSON.stringify(featuredProducts));

        return res.status(200).json(featuredProducts)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const createProduct = async (req, res) => {
    try {

        const { title, description, price, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        const product = await Product.create({
            title,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });

        return res.status(201).json(product)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
import cloudinary from "../lib/cloudinary.js";
import redis from "../lib/redis.js";
import Product from "../models/products.model.js"
import { updateFeaturedProductsCache } from "../utils/cacheUtil.js";
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

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])

        res.status(200).json(products)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params.category

        const products = await Product.find({ category }).sort({ createdAt: -1 });

        return res.status(200).json(products)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const createProduct = async (req, res) => {
    try {

        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        const product = await Product.create({
            name,
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

export const toggleFeature = async (req, res) => {
    try {

        const { productId } = req.params;

        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ message: "Product not found" })

        product.isFeatured = !product.isFeatured;

        await product.save();

        await updateFeaturedProductsCache();

        return res.status(200).json({ success: true, message: "Feature toggled successfully" })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params.id;

        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ message: "Product not found" })

        if (product.image) {

            const public_id = product.image.split("/").pop().split(".")[0]; // Extract the public_id from the image URL

            try {

                await cloudinary.uploader.destroy(`products/${public_id}`);

            } catch (error) {

                return res.status(500).json({ message: error.message });

            }
        }

        await product.findByIdAndDelete(productId);

        return res.status(200).json({ success: true, message: "Product deleted successfully" })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
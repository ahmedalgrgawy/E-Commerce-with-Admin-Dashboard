import Product from "../models/products.model.js"
export const getAllProducts = async (req, res) => {
    try {

        const products = await Product.find({}).sort({ createdAt: -1 });

        return res.status(200).json(products)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
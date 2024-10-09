import Product from "../models/products.model.js";

export const getCartItems = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } });

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
            return { ...product.toJSON(), quantity: item.quantity };
        });

        return res.status(200).json({ success: true, cartItems: cartItems })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const addToCart = async (req, res) => {
    try {

        const { productId } = req.body;

        const user = req.user;

        const alreadyExist = user.cartItems.find(item => item.id === productId);

        if (alreadyExist) {
            alreadyExist.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();

        return res.status(200).json({ success: true, message: "Added to cart successfully", cartItems: user.cartItems })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateQuantity = async (req, res) => {
    try {

        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        const alreadyExist = user.cartItems.find(item => item.id === productId);

        if (alreadyExist) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId)
                await user.save()
                return res.status(200).json({ success: true, message: "Removed from cart successfully", cartItems: user.cartItems })
            }

            alreadyExist.quantity = quantity;
            await user.save()
            res.status(200).json({ success: true, message: "Quantity updated successfully", cartItems: user.cartItems })
        } else {
            return res.status(404).json({ success: false, message: "Product not found in cart" })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const user = req.user;

        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId)
        }

        await user.save()

        res.status(200).json({ success: true, message: "Removed from cart successfully", cartItems: user.cartItems })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const clearCart = async (req, res) => {
    try {

        const user = req.user;

        user.cartItems = [];
        
        await user.save()

        res.status(200).json({ success: true, message: "Cart cleared successfully", cartItems: user.cartItems })


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
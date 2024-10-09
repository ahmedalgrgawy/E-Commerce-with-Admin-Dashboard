import { create } from 'zustand'
import axiosInstance from '../lib/axiosInstance'
import { toast } from "react-hot-toast";

export const userCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subTotal: 0,
    recommendations: [],
    isLoading: false,

    getCart: async () => {
        try {
            const response = await axiosInstance.get('/cart');

            set({ cart: response.data.cartItems })

            get().calculateTotals()

        } catch (error) {
            // toast.error("Cart is Empty")
        }
    },

    addToCart: async (product) => {
        try {
            await axiosInstance.post('/cart/add', { productId: product._id })

            toast.success("Added to cart")

            set((previousState) => {
                const existingProduct = previousState.cart.find(item => item._id === product._id);

                const newCart = existingProduct
                    ? previousState.cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
                    : [...previousState.cart, { ...product, quantity: 1 }]

                return { ...previousState, cart: newCart }

            })

            get().calculateTotals();

        } catch (error) {
            console.log(error);

            toast.error(error.response.data.error || "An error occurred")
        }
    },

    removeFromCart: async (id) => {

        try {

            await axiosInstance.delete(`/cart/remove/${id}`);

            set((previousState) => ({
                cart: previousState.cart.filter((item) => item._id !== id),
            }));

            get().calculateTotals();

            toast.success("Removed from cart");

        } catch (error) {

            toast.error(error.response.data.message || "An error occurred while removing from cart");
        }

    },

    updateQuantity: async (productId, quantity) => {
        try {
            if (quantity === 0) {
                get().removeFromCart(productId)
                toast.success("Removed from cart");
                return
            }

            await axiosInstance.put(`cart/update/${productId}`, { quantity });

            set((previousState) => ({
                cart: previousState.cart.map((item) =>
                    item._id === productId ? { ...item, quantity } : item
                ),
            }));

            get().calculateTotals();

            toast.success("Quantity updated successfully");
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred while updating quantity");
        }

    },

    fetchRecommendations: async () => {

        set({ isLoading: true });

        try {

            const response = await axiosInstance.get("/products/recommended-products");

            set({ recommendations: response.data.products, isLoading: false });

        } catch (error) {
            toast.error(error.response.data.message || "An error occurred while fetching recommendations");
        }
    },

    calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }

        set({ subtotal, total });
    },
}))
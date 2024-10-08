import { create } from "zustand"
import axiosInstance from '../lib/axiosInstance'
import { toast } from "react-hot-toast";
import { toggleFeature } from "../../../server/controllers/products.controllers";

export const useAdminStore = create((set, get) => ({
    products: [],
    isLoading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {

        set({ isLoading: true })

        try {

            const response = await axiosInstance.post('products/create-product', productData)

            set((previousState) => ({
                products: [...previousState.products, response.data],
                isLoading: false,
            }));

            toast.success("Product created successfully")

        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.error || "An error occurred")
        }
    },

    deleteProduct: async (id) => {

    },

    toggleFeature: async (id) => {

    },

    getAllProducts: async () => {
        set({ isLoading: true })

        try {
            const response = await axiosInstance.get('/products')

            set({ products: response.data.products, isLoading: false })

        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.error || "An error occurred")
        }

    }
}))
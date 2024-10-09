import { create } from "zustand"
import axiosInstance from '../lib/axiosInstance'
import { toast } from "react-hot-toast";

export const useProductsStore = create((set, get) => ({
    filteredProducts: [],
    isLoading: false,

    getProductsByCategory: async (category) => {
        set({ isLoading: true })
        try {
            const response = await axiosInstance.get(`products/category/${category}`)
            set({ filteredProducts: response.data, isLoading: false })
        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.error || "An error occurred")
        }
    }
}))
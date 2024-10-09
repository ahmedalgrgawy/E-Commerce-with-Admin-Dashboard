import { create } from "zustand"
import axiosInstance from '../lib/axiosInstance'
import { toast } from "react-hot-toast";

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

        set({ isLoading: true })

        try {

            await axiosInstance.delete(`/products/delete-product/${id}`)

            set((prevProducts) => ({
                products: prevProducts.products.filter((product) => product._id !== id),
                loading: false,
            }));

            toast.success("Product deleted successfully")

        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.message || "An error occurred")
        }

    },

    toggleFeature: async (productId) => {

        set({ isLoading: true })

        try {

            const response = await axiosInstance.patch(`products/update-feature/${productId}`);

            set((prevProducts) => ({
                products: prevProducts.products.map((product) =>
                    product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
                ),
                loading: false,
            }));

            toast.success("Feature toggled successfully")

        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.message || "An error occurred")
        }

    },

    getAllProducts: async () => {
        set({ isLoading: true })

        try {
            const response = await axiosInstance.get('/products/')

            set({ products: response.data, isLoading: false })

        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.error || "An error occurred")
        }

    }
}))
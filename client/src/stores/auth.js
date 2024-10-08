import { create } from "zustand"
import axiosInstance from '../lib/axiosInstance'
import { toast } from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    user: null,
    isLoading: false,
    isAdmin: false,
    checkingAuth: true,

    signup: async (name, email, password, confirmPassword) => {
        set({ isLoading: true })

        if (password !== confirmPassword) {
            set({ isLoading: false })
            return toast.error("Passwords do not match");
        }

        try {
            const response = await axiosInstance.post('/auth/signup', {
                name: name,
                email: email,
                password: password
            })

            set({ user: response.data, isLoading: false })
            toast.success("Account created successfully");

        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    login: async (email, password) => {
        set({ isLoading: true })

        try {
            const response = await axiosInstance.post('/auth/login', { email, password })

            set({ user: response.data, isLoading: false })
            toast.success("Logged in successfully");

        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true })

        try {
            const response = await axiosInstance.get('/auth/profile')
            set({ user: response.data, checkingAuth: false, isAdmin: response.data.user.role === 'admin' })
        } catch (error) {
            set({ checkingAuth: false, user: null, isAdmin: false })
        }
    },

    logout: async () => {
        set({ isLoading: true })

        try {

            await axiosInstance.post('/auth/logout')

            set({ user: null, isLoading: false })

            toast.success("Logged out successfully");

        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    }
}))
import Coupon from "../models/coupon.model.js"

export const getCoupon = async (req, res) => {
    try {

        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true })

        return res.status(200).json({ success: true, coupon: coupon || null })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true })

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" })
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ success: false, message: "Coupon expired" })
        }

        return res.status(200).json({ success: true, code: coupon.code, discountPercentage: coupon.discountPercentage })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
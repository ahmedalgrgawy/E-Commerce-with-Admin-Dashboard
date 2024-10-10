import stripe from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";

export const createStripCoupon = async (discountPercentage) => {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    })

    return coupon.id;
}

export const createNewCoupon = async (userId) => {

    await Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
        code: Math.random().toString(36).substring(2, 8),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId
    })

    await newCoupon.save();

    return newCoupon;
}
import stripe from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { createNewCoupon } from "../utils/paymentsUtils.js";

export const createCheckoutSession = async (req, res) => {
    try {

        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid products format" });
        }


        let totalAmount = 0;

        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        let coupon = null

        if (couponCode) {

            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true })

            if (coupon) {
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100)
            }

        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel-order`,
            discounts: coupon ? [{ coupon: await createStripCoupon(coupon.discountPercentage) }] : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            }
        })

        if (totalAmount >= 500000) {
            await createNewCoupon(req.user._id)
        }

        return res.status(200).json({
            success: true,
            id: session.id,
            totalAmount: totalAmount / 100,
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const checkSuccess = async (req, res) => {
    try {

        const { sessionId } = req.body

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status === "paid") {
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId,
                }, {
                    isActive: false
                })
            }

            const products = JSON.parse(session.metadata.products)

            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: session.id
            })

            await newOrder.save()

            return res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });

        }

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
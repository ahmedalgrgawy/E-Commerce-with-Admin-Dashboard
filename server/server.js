import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connectDb } from './lib/connectDb.js';
import authRouter from './routes/auth.routes.js'
import productsRouter from './routes/products.routes.js'
import cartRoutes from './routes/cart.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(express.json())

app.use(cookieParser())

app.use('/api/auth', authRouter)

app.use('/api/products', productsRouter)

app.use('/api/cart', cartRoutes)

app.use('/api/coupon', couponRoutes)

app.use("/api/payments", paymentRoutes);

app.listen(port, () => {
    connectDb()
    console.log('Server Running on ' + port)
})
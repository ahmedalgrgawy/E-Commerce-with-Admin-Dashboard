import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path'
import { connectDb } from './lib/connectDb.js';
import authRouter from './routes/auth.routes.js'
import productsRouter from './routes/products.routes.js'
import cartRoutes from './routes/cart.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import paymentRoutes from "./routes/payment.routes.js";
import analyticRoutes from "./routes/analytics.routes.js";

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.resolve()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(express.json({ limit: '10mb' }))

app.use(cookieParser())

app.use('/api/auth', authRouter)

app.use('/api/products', productsRouter)

app.use('/api/cart', cartRoutes)

app.use('/api/coupon', couponRoutes)

app.use("/api/payments", paymentRoutes);

app.use("/api/analytics", analyticRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    });

}

app.listen(port, () => {
    connectDb()
    console.log('Server Running on ' + port)
})
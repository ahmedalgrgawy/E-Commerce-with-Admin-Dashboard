import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connectDb } from './database/connectDb.js';

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(express.json())

app.use(cookieParser())


app.listen(port, () => {
    connectDb()
    console.log('Server Running on ' + port)
})
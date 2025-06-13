import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from "@clerk/express"
import clerkWebHooks from "./controllers/clerkWebHooks.js"

connectDB()

const app = express()
app.use(cors()) // Enable Cross-Origin Resource Sharing


// Middleware
app.use(express.json()) // Parse JSON request bodies
app.use(clerkMiddleware()) // Use Clerk middleware for authentication

// API to listen to Clerk webhooks
app.use('/api/clerk', clerkWebHooks)

app.get('/', (req, res)=> res.send('API is working'))

const PORT = process.env.PORT || 3000;

export default app;

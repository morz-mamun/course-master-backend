/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { type Express, type Request, type Response } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { connectDB } from "./config/database"
import config from "./config"
// import authRoutes from "./routes/authRoutes"
// import courseRoutes from "./routes/courseRoutes"
// import studentRoutes from "./routes/studentRoutes"
// import adminRoutes from "./routes/adminRoutes"
// import { errorHandler } from "./middleware/errorHandler"

const app: Express = express()
const PORT = config?.port || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Routes
// app.use("/api/auth", authRoutes)
// app.use("/api/courses", courseRoutes)
// app.use("/api/student", studentRoutes)
// app.use("/api/admin", adminRoutes)

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running" })
})

// Global error handler
// app.use(errorHandler)

// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Course Master server running on port ${PORT}`)
    })
  })
  .catch((error : any) => {
    console.error("Failed to connect to database:", error)
    process.exit(1)
  })

export default app

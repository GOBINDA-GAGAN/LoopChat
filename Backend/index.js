import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/authRoute.js"


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to DB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//user routes
app.use("/api/v1/",userRouter)


// Routes
app.get("/", (req, res) => {
  res.send("Express app with CORS, cookies, JSON, and .env support!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

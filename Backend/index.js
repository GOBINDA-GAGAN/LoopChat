import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js"
import bodyParser from "body-parser";


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
app.use(bodyParser.urlencoded({extended:true}))

//user routes
app.use("/api/auth",authRoute)


// Routes
app.get("/", (req, res) => {
  res.send("Express app with CORS, cookies, JSON, and .env support!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

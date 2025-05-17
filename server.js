import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment
dotenv.config();

// Database config
connectDB();

// __dirname setup for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// Static files for production
app.use(express.static(path.join(__dirname, "./client/build")));

// Serve React build only for routes that are NOT API calls
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


// Port
const PORT = process.env.PORT || 8080;

// Server start
app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js"
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/product.js";
import taskRoutes from "./routes/task.js";
import path from "path";
import { fileURLToPath } from "url";

import stripe from "stripe";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
connectDB();  
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;



app.use("/auth", authRoutes);
app.use("/cart",cartRoutes);
app.use("/order",orderRoutes);
app.use("/product",productRoutes);
app.use("/task",taskRoutes);

app.get('/', (req, res) => {
  res.send('Server running!');
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

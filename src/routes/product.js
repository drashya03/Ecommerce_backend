import express from "express";

const productRoutes = express.Router();

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductById
} from "../controller/productController.js";


// Admin routes
productRoutes.post("/createProduct", createProduct);
productRoutes.patch("/:id",updateProduct)
productRoutes.delete("/:id",deleteProductById)



// Public routes
productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getProductById);


export default productRoutes;

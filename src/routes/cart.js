import express from "express"
import { tokenVerify } from "../middleware/tokenVerify.js";

import { addToCart, getCatItems, removeFromCart } from "../controller/cartController.js";
const cartRoutes = express.Router();

cartRoutes.post("/addToCart", tokenVerify, addToCart)
cartRoutes.post("/removeFromCart", tokenVerify, removeFromCart)
cartRoutes.get("/getCatItems", tokenVerify, getCatItems)


export default cartRoutes;
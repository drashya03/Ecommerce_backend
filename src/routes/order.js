import express from "express"
import Order from "../models/Order.js";
import { tokenVerify } from "../middleware/tokenVerify.js";
import { cancelOrder, checkOut, getMyOrders,getOrderById, UpdateOrderStatus } from "../controller/orderController.js";
const orderRoutes = express.Router();


orderRoutes.post("/checkout",tokenVerify, checkOut);  // Create order + stipe payment
orderRoutes.get("/my-orders",tokenVerify, getMyOrders); // get orders of logged in user
orderRoutes.get("/:id",tokenVerify,getOrderById); //Get singlr order details
orderRoutes.patch("/:id/status",tokenVerify,UpdateOrderStatus) // amdin update order status
orderRoutes.post("/:id/cancel",cancelOrder ) // cancel the order

export default orderRoutes;

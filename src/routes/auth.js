import express from "express"

const authRoutes = express.Router();

import { register } from "../controller/authController.js";
import { login } from "../controller/authController.js";

authRoutes.post("/register",register);
authRoutes.post("/login",login);

export default authRoutes;
import express from "express";

//import modularized routes;
import authRoutes from "./authentification-routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

export default router;
import express from "express";

//import modularized routes;
import authRoutes from "./authentification-routes.js";
import placesRoutes from "./places-routes.js"
import bookingsRoutes from "./bookings-routes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/places", placesRoutes);
router.use("/bookings", bookingsRoutes);

export default router;
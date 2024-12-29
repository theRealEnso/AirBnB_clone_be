import express from "express";
import trimRequest from "trim-request";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import { createPaymentIntent } from "../controllers/booking-controller.js";

const router = express.Router();

router.route("/create-payment-intent").post(trimRequest.all, authMiddleware, createPaymentIntent);

export default router;
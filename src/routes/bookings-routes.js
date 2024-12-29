import express from "express";
import trimRequest from "trim-request";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import { createPaymentIntent, confirmBooking, getMyBookings } from "../controllers/booking-controller.js";

const router = express.Router();

router.route("/create-payment-intent").post(trimRequest.all, authMiddleware, createPaymentIntent);

router.route("/confirm-booking").post(trimRequest.all, authMiddleware, confirmBooking);

router.route("/my-bookings").get(trimRequest.all, authMiddleware, getMyBookings);

export default router;
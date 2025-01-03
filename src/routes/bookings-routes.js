import express from "express";
import trimRequest from "trim-request";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import { createPaymentIntent, confirmBooking, getMyBookings, getReservedDates } from "../controllers/booking-controller.js";

const router = express.Router();

router.route("/create-payment-intent").post(trimRequest.all, authMiddleware, createPaymentIntent);

router.route("/confirm-booking").post(trimRequest.all, authMiddleware, confirmBooking);

router.route("/my-bookings/:userId").get(trimRequest.all, authMiddleware, getMyBookings);

router.route("/reserved-dates/:placeId").get(trimRequest.all, getReservedDates);

export default router;
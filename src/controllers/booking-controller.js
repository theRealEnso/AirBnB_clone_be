import { BookingsModel } from "../models/bookings-model.js";

import createHttpError from "http-errors";
import dotenv from "dotenv"
dotenv.config();

import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res, next) => {
    try {
        const {amount, currency} = req.body;

        const amountInCents = Math.round(amount * 100);
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency,
        });

        res.status(200).json({
            client_secret: paymentIntent.client_secret,
        })
    } catch(error){
        next(error);
    };
};

export const confirmBooking = async (req, res, next) => {
    try {
        const {
            place, 
            customerName,
            customerId, 
            email, 
            phoneNumber, 
            checkInDate, 
            checkOutDate,
            finalTotal,
            billingDetails,
            numberOfNights,
            numberOfAdults,
            numberOfChildren,
            numberOfInfants,
            numberOfPets,

        } = req.body;

        if(
            !place ||
            !customerName ||
            !customerId ||
            !email ||
            !checkInDate ||
            !checkOutDate ||
            !numberOfNights ||
            !billingDetails ||
            !numberOfAdults
        ){
            throw createHttpError.BadRequest("Missing required fields");
        }

        const newBooking = await BookingsModel.create({
            place,
            customerName,
            customerId,
            email,
            phoneNumber,
            finalTotal,
            checkInDate,
            checkOutDate,
            billingDetails,
            numberOfNights,
            numberOfAdults,
            numberOfChildren,
            numberOfInfants,
            numberOfPets,
        });

        if(!newBooking){
            throw createHttpError.BadRequest("Oops! Looks like something went wrong");
        }

        res.json(newBooking);

    } catch(error){
        next(error);
    }
};

export const getMyBookings = async (req, res, next) => {
    try {

    } catch(error){
        next(error);
    }
}
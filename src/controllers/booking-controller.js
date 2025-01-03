import { BookingsModel } from "../models/bookings-model.js";

import createHttpError from "http-errors";
import dotenv from "dotenv"
dotenv.config();

import { fetchBookings, getBookingDates } from "../services/bookings-services.js";

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
        const {userId} = req.params;

        // console.log(userId);
        const myBookings = await fetchBookings(userId);
        
        res.json(myBookings);
    } catch(error){
        next(error);
    }
};

export const getReservedDates = async (req, res, next) => {
    const {placeId} = req.params;

    if(!placeId){
        throw createHttpError.BadRequest("Place ID is required");
    };

    try {
        const bookingsWithDates = await getBookingDates(placeId);

        //generate reserved dates for each booking
        const reservedDates = bookingsWithDates.flatMap((booking) => {
            const dates = [];

            //create new date objects for the check in and out dates, Ex: (01/01/2025) => Wed Jan 01 2025 00:00:00 GMT-0800 (Pacific Standard Time)
            let beginning = new Date(booking.checkInDate);
            let end = new Date(booking.checkOutDate);
            
            //generate all of the dates between the check in and check out dates
            while (beginning <= end){
                dates.push(beginning.toISOString().split("T")[0]); // format  as YYYY-MM-DD and then push into dates array
                beginning.setDate(beginning.getDate() + 1); // increment beginning by one day after each iteration
            }
            return dates;
        });
    
        res.json(reservedDates);

    } catch(error) {
        next(error)
    }
};
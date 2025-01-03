import createHttpError from "http-errors"; 
import { BookingsModel } from "../models/bookings-model.js"

export const fetchBookings = async (id) => {
    const bookings = await BookingsModel.find({customerId: id}).populate("place");

    if(!bookings){
        throw createHttpError.BadRequest("No bookings for the user found!");
    }

    return bookings;
};

export const getBookingDates = async (placeId) => {
    const datedBookings = await BookingsModel.find({place: placeId}).select("checkInDate checkOutDate");

    if(!datedBookings) throw createHttpError[404]("No bookings with dates found!");

    return datedBookings; // object with just check in and check out dates
};
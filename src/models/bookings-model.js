import mongoose from "mongoose"
import { PlacesModel } from "./places-model.js";
import { UserModel } from "./user-model.js";
const {ObjectId} = mongoose.Schema.Types;

// Define the schema for the address inside billingDetails
const addressSchema = new mongoose.Schema({
    line1: { type: String, required: true },
    line2: { type: String, default: null },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postal_code: { type: String, required: true },
  });
  
  // Define the schema for billingDetails
  const billingDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, },
    address: { type: addressSchema, required: true },
  });

const bookingsSchema = new mongoose.Schema({
    place: {
        type: ObjectId,
        ref: PlacesModel,
        required: true,
    },

    customerName: {
        type: String,
        required: true,
    },

    customerId: {
        type: ObjectId,
        ref: UserModel,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    phoneNumber: {
        type: String,
    },

    finalTotal: {
        type: Number,
        required: true,
    },

    checkInDate: {
        type: String,
        required: true,
    },

    checkOutDate: {
        type: String,
        required: true,
    },

    billingDetails: {
        type: billingDetailsSchema,
        required: true,
    },

    numberOfNights: {
        type: Number,
        required: true,
    },

    numberOfAdults: {
        type: Number,
        required: true,
    },

    numberOfChildren: {
        type: Number,
    },

    numberOfInfants: {
        type: Number,
    },

    numberOfPets: {
        type: Number,
    }
}, {collection: "bookings", timestamps: true});

export const BookingsModel = mongoose.models.BookingsModel || mongoose.model("BookingsModel", bookingsSchema);
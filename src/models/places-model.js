import mongoose from "mongoose";
const {ObjectId,} = mongoose.Schema.Types;

const placesSchema = new mongoose.Schema({
    owner: {
        type: ObjectId,
        ref: "UserModel"
    },

    price: {
        type: Number,
        required: true,
    }, 

    title: {
        type: String,
        required: true,
    },

    address: {
       street: {
        type: String,
        required: true,
       },
       postalCode: {
        type: String,
        required: true,
       },
       city: {
        type: String,
        required: true,
       },
       country: {
        type: String,
        required: true,
       },
    },
    photos: {
        type: [],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    perks: {
        type: [String],
        required: true,
    },

    extraInfo: {
        type: String,
        required: true
    },
    checkIn: {
        type: [String, Number], // can be string or a number
        required: true,
    },
    checkOut: {
        type: [String, Number], // can be a string or a number
        required: true,
    },
    maxGuests: {
        type: String,
        required: true,
    },
}, {collection: "places", timestamps: true});

export const PlacesModel = mongoose.models.PlacesModel || mongoose.model("PlacesModel", placesSchema);
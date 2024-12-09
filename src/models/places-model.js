import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types;

const placesSchema = new mongoose.Schema({
    owner: {
        type: ObjectId,
        ref: "UserModel"
    },
    title: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
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
        type: Number || String,
        required: true,
    },
    checkOut: {
        type: Number || String,
        required: true,
    },
    maxGuests: {
        type: String,
        required: true,
    },
}, {collection: "places", timestamps: true});

export const PlacesModel = mongoose.models.PlacesModel || mongoose.model("PlacesModel", placesSchema);
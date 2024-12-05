import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types;

const placesSchema = new mongoose.Schema({
    owner: {
        type: ObjectId,
        ref: "UserModel"
    },
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
}, {collection: "places", timestamps: true});

export const PlacesModel = mongoose.models.PlacesModel || mongoose.model("PlacesModel", placesSchema);
//import models
import { TemporaryPhotosModel } from "../models/temporary-photos-model.js";
import { PlacesModel } from "../models/places-model.js";

//import packages
import createHttpError from "http-errors";
import download from "image-downloader";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

//import utility/helper functions
import { verifyLink, computeFilehash, generateRandomId, getAllUserPlaces, getPlace, retrievePlaces } from "../services/places-services.js";

const __filename = fileURLToPath(import.meta.url); // get resolved path to this current file
const __dirname = path.dirname(__filename); //get full directory path

console.log(__dirname);

export const uploadImageFromLinks = async (req, res, next) => {
    try {
        const {link} = req.body;
        const verifiedLink = verifyLink(link);
        const photoName = "photo" + Date.now() + ".jpg";

        const tempFilePath = path.join(__dirname, "../photo-uploads/", photoName);

        await download.image({
            url: `${verifiedLink}`,
            dest: path.join(__dirname, "../photo-uploads/") + photoName,
        });

        //compute file hash of the downloaded image
        const fileHash = await computeFilehash(tempFilePath);

        //generate temporary id
        const temporary_id = req.body.tempId || generateRandomId();

        const existingPhoto = await TemporaryPhotosModel.findOne({hash: fileHash, tempId: temporary_id});
        if (!existingPhoto) {
            // Save the photo metadata in the database
            await TemporaryPhotosModel.create({
                tempId: temporary_id,
                hash: fileHash,
                filePath: tempFilePath,
            });

            res.json({
                tempId: temporary_id,
                photo: photoName,
            });

        } else {
            // If duplicate, delete the downloaded file
            fs.unlinkSync(tempFilePath);
            res.status(409).json({ message: "Duplicate image detected, upload ignored." });
        }
    } catch(error){
        next(error);
    }
};

export const fetchAllPlaces = async (req, res, next) => {
    try {
        const places = await retrievePlaces();
        res.json(places);
    } catch(error) {
        next(error)
    };
};

export const createPlace = async (req, res, next) => {
    try {
        const {owner, price, title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests,} = req.body;
        if(
            !owner ||
            !price ||  
            !title || 
            !address || 
            !Array.isArray(photos) || photos.length === 0 || 
            !description || 
            !Array.isArray(perks) || perks.length === 0 || 
            !extraInfo || 
            !checkIn || 
            !checkOut || 
            !maxGuests){
            throw createHttpError.BadRequest("Missing required fields");
        }

        const newPlace = await PlacesModel.create({
            owner,
            price,
            title,
            address,
            photos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests
        });

        res.json({
            message: "Place successfully created!",
            place: {
                owner: newPlace.owner,
                price: newPlace.price,
                title: newPlace.title,
                address: newPlace.address,
                photos: newPlace.photos,
                description: newPlace.description,
                perks: newPlace.perks,
                extraInfo: newPlace.extraInfo,
                checkInTime: newPlace.checkInTime,
                checkOutTime: newPlace.checkOutTime,
                maxGuests: newPlace.maxGuests,
            }
        })
    } catch(error) {
        next(error);
    }
};

export const updatePlace = async (req, res, next) => {
    try {

        const userId = req.user.id;

        const {owner, price, title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests, _id} = req.body;
        if(!owner || !price || !title || !address || !photos || !description || !perks || !extraInfo || !checkIn || !checkOut || !maxGuests || !_id){
            throw createHttpError.BadRequest("Missing required fields");
        }

        // console.log(owner)
        // console.log(userId);
        
        if(userId === owner){
            const updatedPlace = await PlacesModel.findByIdAndUpdate(_id, {
                owner,
                price,
                title,
                address,
                photos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
            });

            res.json({
                message: "Place successfully updated!",
                place: {
                    owner: updatedPlace.owner,
                    price: updatedPlace.price,
                    title: updatedPlace.title,
                    address: updatedPlace.address,
                    photos: updatedPlace.photos,
                    description: updatedPlace.description,
                    perks: updatedPlace.perks,
                    extraInfo: updatedPlace.extraInfo,
                    checkInTime: updatedPlace.checkInTime,
                    checkOutTime: updatedPlace.checkOutTime,
                    maxGuests: updatedPlace.maxGuests,
                }
            });
        } else {
            throw createHttpError.Unauthorized("Only the owner of the place can make edits");
        };

    } catch(error) {
        next(error);
    };
};

export const getPlaces = async (req, res, next) => {
    try {
        const userId = req.user.id;
        console.log(userId);
        const userPlaces = await getAllUserPlaces(userId);

        res.json(userPlaces);
    } catch(error) {
        next(error);
    }
}

export const getPlaceDetails = async (req, res, next) => {
    try {
        const {placeId} = req.params;

        const place = await getPlace(placeId);

        res.json(place);
   } catch(error){
    next(error)
   } 
};

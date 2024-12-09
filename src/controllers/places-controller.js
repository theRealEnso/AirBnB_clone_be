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
import { verifyLink, computeFilehash, generateRandomId } from "../services/places-services.js";

const __filename = fileURLToPath(import.meta.url); // get resolved path to this current file
const __dirname = path.dirname(__filename); //get full directory path

console.log(__dirname);

export const uploadImageFromLinks = async (req, res, next) => {
    try {
        const {link} = req.body;
        const jpgVerifiedLink = verifyLink(link);
        const photoName = "photo" + Date.now() + ".jpg";

        const tempFilePath = path.join(__dirname, "../temporary-photos/", photoName);

        await download.image({
            url: `${jpgVerifiedLink}`,
            dest: path.join(__dirname, "../temporary-photos/") + photoName,
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
                message: "Image from link created successfully!"
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

export const createPlace = async (req, res, next) => {
    try {
        const {title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests} = req.body;
        if(!title || !address || !photos || !description || !perks || !extraInfo || !checkIn || !checkOut || !maxGuests){
            throw createHttpError.BadRequest("Missing required fields");
        }

        const newPlace = await PlacesModel.create({
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
                title: newPlace.title,
                address: newPlace.address,
                photos: newPlace.photos,
                description: newPlace.description,
                perks: newPlace.perks,
                extraInfo: newPlace.extraInfo,
                checkInTime: newPlace.checkInTime,
                checkOutTime: newPlace.checkOutTime,
                maxGuests: newPlace.maxGuests
            }
        })
    } catch(error) {
        next(error);
    }
};

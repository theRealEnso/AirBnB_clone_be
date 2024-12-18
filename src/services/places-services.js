//import packages
import createHttpError from "http-errors";
import crypto from "crypto";
import fs from "fs"

//import model
import { PlacesModel } from "../models/places-model.js";

export const verifyLink = (link) => {
    const splitLink = link.split(".");

    if(splitLink.includes("jpg") || splitLink.includes("png") || splitLink.includes("webp")){
        return link;
    } else {
        throw createHttpError.BadRequest("The provided url is not a .jpg, .png, or webp url. Only .jpg, .png, or .webp extensions are accepted");
    }
};

export const computeFilehash = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256'); // You can use other algorithms like md5
        const stream = fs.createReadStream(filePath);

        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
};

export const generateRandomId = () => {
    return crypto.randomUUID();
};

export const retrievePlaces = async () => {
    const allPlaces = await PlacesModel.find({});

    if(!allPlaces || allPlaces.length === 0){
        throw createHttpError[404]("No places found!");
    };

    return allPlaces;
};

export const getAllUserPlaces = async (userId) => {
    const foundPlaces = await PlacesModel.find({owner: userId});

    if(!foundPlaces){
        throw createHttpError[404]("No places found for the user!")
    };

    return foundPlaces;
};

export const getPlace = async (placeId) => {
    const foundPlace = await PlacesModel.findById(placeId);

    if(!foundPlace){
        throw createHttpError[404]("No place found!");
    };

    return foundPlace;
};

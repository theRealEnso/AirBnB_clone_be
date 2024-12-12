import express from "express";
import trimRequest from "trim-request";
import createHttpError from "http-errors";
import multer from "multer"
import fs from "fs"
import crypto from "crypto";

import path from "path";
import { fileURLToPath } from "url";

//import model(s)
import { TemporaryPhotosModel } from "../models/temporary-photos-model.js";

//import authentification middleware
import { authMiddleware } from "../middlewares/authMiddleware.js";

//import main function for endpoint(s)
import { uploadImageFromLinks, createPlace, getPlaces, getPlaceDetails, updatePlace } from "../controllers/places-controller.js";

//import utility/helper functions
import { computeFilehash, generateRandomId } from "../services/places-services.js";

// Resolve __dirname for setting upload destination
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//configure multer
const upload = multer({
    dest: path.join(__dirname, "../photo-uploads/"), // Upload destination
  });

const router = express.Router();

router.route("/upload-by-link").post(trimRequest.all, authMiddleware, uploadImageFromLinks);

router.route("/upload-to-temporary").post(trimRequest.all, authMiddleware, upload.array("photos", 100), async (req, res, next) => {
    //multer adds both a `body` object and a `file` or `files` object to the request object.
    //the body contains the values of the text fields of the form
    //the file or files object contains the files uploaded via the form. Will generate data in an object containing original file data
    // console.log("The request body is", req.body);
    console.log(req.files); 

    if(!req.files || req.files.length === 0){
        throw createHttpError.BadRequest("No files or photos have been uploaded");
    };

    const uploadedPhotoNames = []; //this array needs to contain complete file names including the file extension type for the front end to consume

    try {
        for (const photo of req.files){
            const {path, originalname} = photo; //original name contains the file extension (such as .webp, .png, etc) Need to extract this and append it to the path

            const temporary_id = req.body.tempId || generateRandomId();
            
            const fileHash = await computeFilehash(path);
            console.log(fileHash);

            //check for duplicate photos in temporary storage
            const existingPhoto = await TemporaryPhotosModel.findOne({hash: fileHash, tempId: temporary_id});
            if(!existingPhoto){ // if an existing photo wasn't found, then save the photo temporarily
                await TemporaryPhotosModel.create({
                    tempId: temporary_id,
                    hash: fileHash,
                    filePath: path,
                });

                const splitOriginalName = originalname.split(".");
                const fileExtension = splitOriginalName[1];
                const newPath = path + "." + fileExtension;
    
                //use renameSync from the file system in order to rename the old path to the new path
                fs.renameSync(path, newPath);
                
                //just need to store the file name with the extension in the array, not the string value of the entire path of the file
                const photoName = newPath.replace(`${process.env.PATH_TO_PHOTO_UPLOADS}`, "");
                uploadedPhotoNames.push({
                    tempId: temporary_id,
                    photo: photoName,
                    message: "File uploaded successfully!"
                });
                
            } else { //otherwise, remove the duplicate photo
                fs.unlink(path);
            }
        }
        
        console.log("Photos array looks like:", uploadedPhotoNames)
        res.json(uploadedPhotoNames);
    } catch(error) {
        next(error);
    }
});

router.route("/create-new-place").post(trimRequest.all, authMiddleware, createPlace);

router.route("/update-place").put(trimRequest.all, authMiddleware, updatePlace);

router.route("/get-all-places").get(trimRequest.all, authMiddleware, getPlaces);

router.route("/:placeId").get(trimRequest.all, authMiddleware, getPlaceDetails);

export default router;
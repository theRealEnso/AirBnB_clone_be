import express from "express";
import trimRequest from "trim-request";
import createHttpError from "http-errors";
import multer from "multer"
import fs from "fs"

import path from "path";
import { fileURLToPath } from "url";

import { uploadImageFromLinks, } from "../controllers/places-controller.js";

// Resolve __dirname for setting upload destination
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//configure multer
const upload = multer({
    dest: path.join(__dirname, "../photo-uploads/"), // Upload destination
  });

const router = express.Router();

router.route("/upload-by-link").post(trimRequest.all, uploadImageFromLinks);

router.route("/upload-from-device").post(trimRequest.all, upload.array("photos", 100), (req, res, next) => {
    console.log(req.files);

    if(!req.files || req.files.length === 0){
        throw createHttpError.BadRequest("No files or photos have been uploaded");
    }
    const uploadedPhotoNames = [];

    try {
        for (const photo of req.files){
            const {path, originalname} = photo;
            const splitOriginalName = originalname.split(".");
            const fileExtension = splitOriginalName[1];
            const newPath = path + "." + fileExtension;
            fs.renameSync(path, newPath);
    
            const photoName = newPath.replace(`${process.env.PATH_TO_PHOTO_UPLOADS}`, "");
            uploadedPhotoNames.push(photoName);
        }
    
        res.json(uploadedPhotoNames);
    } catch(error) {
        next(error);
    }
});

export default router;
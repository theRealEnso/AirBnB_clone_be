import download from "image-downloader";
import multer from "multer";

import path from "path";
import { fileURLToPath } from "url";

import { verifyLink } from "../services/places-services.js";

const __filename = fileURLToPath(import.meta.url); // get resolved path to this current file
const __dirname = path.dirname(__filename); //get full directory path

console.log(__dirname);

export const uploadImageFromLinks = async (req, res, next) => {
    try {
        const {link} = req.body;
        const jpgVerifiedLink = verifyLink(link);

        const newName = "photo" + Date.now() + ".jpg";

        await download.image({
            url: `${jpgVerifiedLink}`,
            dest: path.join(__dirname, "../photo-uploads/") + newName,
        });

        res.json(newName);
    } catch(error){
        next(error);
    }
};

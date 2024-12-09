import fs from "fs";
import path from "path";
import { TemporaryPhotosModel } from "../models/temporary-photos-model.js";

// Function to clean up temporary photos
export const cleanupTemporaryPhotos = async () => {
  try {
    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();

    // Find expired temporary photos
    const expiredPhotos = await TemporaryPhotosModel.find({
      createdAt: { $lt: new Date(now - expirationTime) },
    });

    for (const photo of expiredPhotos) {
      // Delete the file from the filesystem
      try {
        fs.unlinkSync(photo.pathOrURL);
      } catch (err) {
        console.error(`Error deleting file ${photo.pathOrURL}:`, err);
      }

      // Remove the photo record from the database
      await TemporaryPhotosModel.deleteOne({ _id: photo._id });
    }

    console.log(`Cleanup complete: Deleted ${expiredPhotos.length} expired photos.`);
  } catch (error) {
    console.error("Error during temporary photo cleanup:", error);
  }
};

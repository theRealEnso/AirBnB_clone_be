import cron from "node-cron";
import { cleanupTemporaryPhotos } from "./temporaryPhotosCleanup.js";

// Schedule the cron job to run daily at midnight
export const cronCleanup = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("Running temporary photo cleanup job...");
        await cleanupTemporaryPhotos();
    }); 
}
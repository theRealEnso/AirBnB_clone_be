import mongoose from "mongoose";

const temporaryPhotosSchema = new mongoose.Schema(
    {
        tempId: {
            type: String,
            required: true,
        },

        hash: {
            type: String,
            required: true,
        },

        filePath: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600
        },
    },

    {collection: "temporaryPhotos"}
);

export const TemporaryPhotosModel = mongoose.models.TemporaryPhotosModel || mongoose.model("TemporaryPhotosModel", temporaryPhotosSchema);
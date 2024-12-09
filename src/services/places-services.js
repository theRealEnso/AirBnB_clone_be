import createHttpError from "http-errors";
import crypto from "crypto";
import fs from "fs"

export const verifyLink = (link) => {
    const splitLink = link.split(".jpg");

    if(splitLink.length > 0 && splitLink[splitLink.length - 1] === ""){
        return link;
    } else {
        throw createHttpError.BadRequest("The provided url is not a .jpg url. Only .jpg extensions are accepted");
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

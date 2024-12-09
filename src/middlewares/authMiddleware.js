import logger from "../configs/winston-logger.js";
import createHttpError from "http-errors";

//import helper/utility function
import { verifyToken } from "../utils/generate-tokens.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization || req.headers.Authorization;
        if(!authorization){
            throw createHttpError.Unauthorized("Authorization headers and/or bearer token is missing");
        }

        const accessToken = authorization.split(" ")[1];

        const verifiedUser = await verifyToken(accessToken, process.env.SECRET_ACCESS_TOKEN);
        console.log(verifiedUser);

        if(verifiedUser){
            req.user = verifiedUser;
            next();
        }
    } catch(error) {
        logger.error(error);
    }
};
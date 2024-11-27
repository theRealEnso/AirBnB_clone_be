//import packages
import createHttpError from "http-errors";

//import User model
import { UserModel } from "../models/user-model.js";

//import utility functions
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter.js";
import { createUserAndAddToDB } from "../services/authentification-services.js";
import { generateToken } from "../utils/generate-tokens.js";

export const register = async (req, res, next) => {
    try {
        const {firstName, lastName, email, password, confirmPassword, picture} = req.body;

        if(!firstName && !lastName && !email && !password && !confirmPassword){
            throw createHttpError.BadRequest("Please make sure all required fields are filled out!");
        };

        const newUser = await createUserAndAddToDB({
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            email,
            password,
            confirmPassword,
            picture: picture ? picture : process.env.DEFAULT_PICTURE,
        });

        //generate acess token
        const accessToken = await generateToken({id: newUser._id}, process.env.SECRET_ACCESS_TOKEN, "1d");

        //generate refresh token
        const refreshToken = await generateToken({id: newUser._id}, process.env.SECRET_REFRESH_TOKEN, "30d");

        //store refresh token as cookie on the server
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day expiration date in milliseconds (30 days * 24 hrs/day * 60 minutes/hr * 60 seconds/min * 1000 milliseconds/second)
        });

        //return user object back to the front end
        res.json({
            message: "Successfully registered the user!",
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                picture: newUser.picture,
                access_token: accessToken,
            }
        });

    } catch (error){
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {

    } catch (error){
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {

    } catch (error){
        next(error);
    }
};
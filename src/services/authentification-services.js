//import packages
import createHttpError from "http-errors";
import validator from "validator";
import bcrypt from "bcrypt";

//import UserModel
import { UserModel } from "../models/user-model.js"

export const createUserAndAddToDB = async (userData) => {
    const {firstName, lastName, email, password, confirmPassword, picture} = userData;

    //check if email already exists
    const foundUserWithEmail = await UserModel.findOne({email});
    if(foundUserWithEmail){
        throw createHttpError.BadRequest("The email provided is already in use. Please try again with a different email address");
    }
    //check if all required fields have been filled out
    if(!firstName || !lastName || !email || !password |!confirmPassword){
        throw createHttpError.BadRequest("Please fill out all required fields");
    };

    //check if passwords match
    if(password !== confirmPassword){
        throw createHttpError.BadRequest("Passwords do not match");

    };

    //check if password length matches schema requirements
    if(!validator.isLength(password, {min: 8, max: 32})){
        throw createHttpError.BadRequest("Please make sure the password is between 8 and 32 characters long")
    };

    //check if confirm password length matches schema requirements
    if(!validator.isLength(confirmPassword, {min: 8, max: 32})){
        throw createHttpError.BadRequest("Please make sure the password is between 8 and 32 characters long")
    };

    // check if first name follows schema rules
    if(!validator.isLength(firstName, {min: 2, max: 24})){
        throw createHttpError.BadRequest("Please make sure the first name is between 2 and 24 characters long")
    };

    //check if last name follows schema rules
    if(!validator.isLength(lastName, {min: 2, max: 24})){
        throw createHttpError.BadRequest("Please make sure the last name is between 2 and 24 characters long")
    };

    //check if email is valid
    if(!validator.isEmail(email)){
        throw createHttpError.BadRequest("Email is not valid. Please try again")
    }

    //finally, create user in the DB

    const user = await UserModel.create({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        picture,
    });

    return user;
};

export const signInUser = async (email, password) => {
    const foundUser = await UserModel.findOne({email: email});

    if(!foundUser) throw createHttpError.BadRequest("User with the specified email does not exist");

    const hashedPassword = foundUser.password;

    const verifiedPassword = await bcrypt.compare(password, hashedPassword);

    if(verifiedPassword){
        // console.log(foundUser);
        return foundUser;
    };

}
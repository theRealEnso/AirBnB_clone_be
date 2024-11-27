import mongoose from "mongoose";
import validator from "validator";

const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minLength: [2, "Please make sure your first name at least two characters lomg"],
        maxLength: [24, "please make sure your first name does not exceed 24 characters"]
    },

    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minLength: [2, "Please make sure your last name at least two characters lomg"],
        maxLength: [24, "please make sure your last name does not exceed 24 characters"]
    },

    email: {
        type: String,
        required: [true, "Email address is required"],
        trim: true,
        lowercase: true,
        validate: {
            validator: (emailValue) => validator.isEmail(emailValue),
            message: (props) => `${props.value} is not a valid email address!`
        },
        unique: [true, "Email address is already registered to an existing user. Please use another email address"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Please make sure your password is at least 6 characters long"],
        maxLength: [32, "Please make sure your password does not exceed 32 characters"],
    },

    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        minLength: [8, "Please make sure your password is at least 6 characters long"],
        maxLength: [32, "Please make sure your password does not exceed 32 characters"]
    },

    picture: {
        type: String,
        default: process.env.DEFAULT_PICTURE,
    },

}, {collection: "users", timestamps: true,});

export const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
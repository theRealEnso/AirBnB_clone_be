import express from "express";
import trimRequest from "trim-request";

import { register, login, logout } from "../controllers/authentification-controller.js";

const router = express.Router();

//define functionality in separate controller.js file instead of writing all of the logic for our functions here
router.route("/register").post(trimRequest.all, register);
router.route("/login").post(trimRequest.all, login);
router.route("/logout").post(trimRequest.all, logout );

export default router;
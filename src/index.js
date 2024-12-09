import app from "./app.js";
import logger from "./configs/winston-logger.js";
import mongoose from "mongoose"

import { cronCleanup } from "./schedules/cronJob.js";

//env variables
const PORT = process.env.port || 5000;
const {DATABASE_URL} = process.env;

//enable mongoDB debug mode for development
if(process.env.NODE_ENV !== "production"){
    mongoose.set("debug", true);
};


//establish mongoDB connection
const connectToDB = async () => {
    try {
        if(!process.env.DATABASE_URL){
            logger.error(`'DATABASE_URL' environnment variable is missing or undefined!`)
        }
        await mongoose.connect(DATABASE_URL);
        logger.info(`Connected to MongoDB cloud database!`)
    } catch(error) {
        logger.error(`Error connecting to MongoDB! :${error}`);
        process.exit(1);
    }
};

connectToDB();

//run cron job clean up
cronCleanup();

//starting the server
let server;

server = app.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}!!!`);
});

///////     handle server errors    ////////

const closeServer = () => {
    if(server) {
        logger.info('Server closed.');
        process.exit(1)  // kill server. Exiting with "1" means there was some sort of problem. Exiting with 0 means no issues occurred
    } else {
        process.exit(1)
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    closeServer();
};

//handle uncaughtExceptipn + unhandledRejection errors
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
//SIGTERM (signal 15) is used in Linux to terminate a process gracefully
//.on is an event listener. Here we are just saying if we receive a sigterm and the server is currently running, then just close it
process.on("SIGTERM", () => {
    if(server) {
        logger.info("Server closed.");
        process.exit(1);
    }
});
///////    ***END*** handle server errors  ***END***  ////////

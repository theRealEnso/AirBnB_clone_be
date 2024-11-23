import app from "./app.js";
import logger from "./configs/winston-logger.js";

//env variables
const PORT = process.env.port || 5000;
console.log(process.env.NODE_ENV);

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

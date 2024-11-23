import express from "express";
import dotenv from "dotenv";
import morgan from "morgan"; // this package logs to the console information about any and all requests that our server receives (i.e. type of requests, where request was sent, status, time for completion, etc)
import helmet from "helmet"; // this package secures express apps by setting various HTTP headers
import mongoSanitize from "express-mongo-sanitize"; // sanitizes user data to prevent MongoDB operator injections / database manipulation
import cookieParser from "cookie-parser"; // parse cookie headers and populate req.cookies with an object keyed by the cookie names
import compression from "compression"; // compresses response bodies for all incoming requests to reduce data size, allowing for faster processing and response times
import cors from "cors"; // this restricts who can access the server
import createHttpError from "http-errors";

//import aggregated routes from the index route
import routes from "./routes/index.js"

//dotEnv config
dotenv.config();

//create express application
const app = express();

//use morgan
if(process.env.NODE_ENV !== "production"){
    app.use(morgan("dev"));
};

//use helmet package
app.use(helmet());

//parse JSON request body
app.use(express.json());

//parse JSON request url
app.use(express.urlencoded({
    extended: true,
}));

//use sanitize package to sanitize user data requests to prevent malicious users from manipulating the database
app.use(mongoSanitize());

//enable cookie parser
app.use(cookieParser());

//use compression package to compress data from incoming user requests
app.use(compression());

//cors middelware
app.use(cors());


//middleware to define our API endpoints
app.use("/api/v1", routes);

//  *** error handling middleware ***   //
app.use(async (req, res, next) => {
    next(createHttpError.NotFound("This route does not exist!"));
});


app.use(async (error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        error: {
            //errors have status and message properties
            status: error.status || 500,
            message: error.message,
        }
    });
});


export default app;
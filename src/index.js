import dotenv from "dotenv";
import app from "./app.js";

//dotEnv config
dotenv.config();

//env variables
const PORT = process.env.port || 5000;
console.log(process.env.NODE_ENV);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!!!`)
});
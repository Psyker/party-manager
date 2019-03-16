import dotenv from "dotenv";
import express from "express";
import path from "path";
import winston from "winston";
import * as sessionAuth from "./middleware/sessionAuth";
import * as routes from "./routes";

dotenv.config();

const port = process.env.SERVER_PORT;
const app = express();

app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set( "view engine", "ejs" );

// Configure Express to serve static files in the public folder
app.use( express.static( path.join( __dirname, "public" ) ) );

sessionAuth.register(app);
routes.register(app);

app.listen(port, () => {
    winston.log("info", `Server started at http://localhost:${port}`);
});

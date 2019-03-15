import dotenv from "dotenv";
import express from "express";
import path from "path";
import winston from "winston";

dotenv.config();

const port = process.env.SERVER_PORT;
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set( "view engine", "ejs" );

app.get("/", (req: express.Request, res: express.Response) => {
    res.render("index");
});

app.listen(port, () => {
    winston.log("info", `Server started at http://localhost:${port}`);
});

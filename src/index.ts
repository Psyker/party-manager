import express from "express";
import path from "path";
import winston from "winston";
const app = express();
const port = 8080;

app.set("views", path.join(__dirname, "views"));
app.set( "view engine", "ejs" );

app.get("/", (req: express.Request, res: express.Response) => {
    res.render("index");
});

app.listen(port, () => {
    winston.log("info", `Server started at http://localhost:${port}`);
});

import express from "express";
import winston from "winston";
const app = express();
const port = 8080;

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World");
});

app.listen(port, () => {
    winston.log("info", `Server started at http://localhost:${port}`);
});

import * as express from "express";
import {Application} from "express";

export const register = (app: Application) => {
    const oidc = app.locals.oidc;

    app.get("/", (req: any, res: express.Response) => {
        const user = req.userContext ? req.userContext.userInfo : null;
        res.render("index", {isAuthenticated: req.isAuthenticated(), user });
    });

    app.get("/login", oidc.ensureAuthenticated() , (req: express.Request, res: express.Response) => {
        res.redirect("/guests");
    });

    app.get("/logout", (req: any, res: express.Response) => {
        req.logout();
        res.redirect("/");
    });

    app.get("/guests", oidc.ensureAuthenticated(), (req: any, res: express.Response) => {
        const user = req.userContext ? req.userContext.userInfo : null;

        res.render("guest/guests", {isAuthenticated: req.isAuthenticated(), user });
    });
};

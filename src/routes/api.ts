import express from "express";
import pgPromise from "pg-promise";
import * as winston from "winston";

export const register = (app: express.Application) => {
    const oidc = app.locals.oidc;
    const port = parseInt(process.env.PGPORT || "5432", 10);
    const config = {
        database: process.env.PGDATABASE || "postgres",
        host: process.env.PGHOST || "localhost",
        port,
        user: process.env.PGUSER || "postgres"
    };

    const pgp = pgPromise();
    const db = pgp(config);

    app.get("/api/guests/all", oidc.ensureAuthenticated() , async (req: any, res) => {
        try {
            const userId: string = req.userContext.userinfo.sub;
            const guests: object = await db.any(`
                SELECT
                    id
                    , name
                    , type
                    , age
                    , major
                FROM guests
                WHERE user_id = $[userId]
                ORDER BY name, type, age`, {userId});
            return res.json(guests);
        } catch (err) {
            winston.log("error", err);
            res.json({err: err.message || err});
        }
    });

    app.get("/api/guests/total", oidc.ensureAuthenticated(), async (req: any, res) => {
        try {
            const userId: string = req.userContext.userinfo.sub;
            const total: object = await db.one(`
                SELECT COUNT(*) AS total
                FROM guests
                WHERE user_id = $[userId]`, {userId}, (data: {total: number}) => {
                return {
                    total: +data.total
                };
            });
            return res.json(total);
        } catch (err) {
            winston.log("error", err);
            res.json({err: err.message || err});
        }
    });

    app.get("/api/guests/find/:search", oidc.ensureAuthenticated(), async (req: any, res) => {
        try {
            const userId: string = req.userContext.userinfo.sub;
            const guests = await db.any(`
                SELECT
                    id
                    , name
                    , type
                    , age
                    , major
                FROM guests
                WHERE user_id = $[userId]
                AND (name ILIKE $[search] OR type ILIKE $[search])`, {userId, search: `%${req.params.search}%`});
            return res.json(guests);
        } catch (err) {
            winston.log("error", err);
            res.json({err: err.message || err});
        }
    });

    app.post( `/api/guests/add`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId: string = req.userContext.userinfo.sub;
            const id = await db.one(`
                INSERT INTO guests( user_id, name, type, age, major )
                VALUES( $[userId], $[name], $[type], $[age], $[major] )
                RETURNING id;`,
                { userId, ...req.body  } );
            return res.json( { id } );
        } catch ( err ) {
            winston.log("error", err);
            res.json( { error: err.message || err } );
        }
    } );

    app.post( `/api/guests/update`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = await db.one( `
                UPDATE guests
                SET name = $[name]
                    , type = $[type]
                    , age = $[age]
                    , major = $[major]
                WHERE
                    id = $[id]
                    AND user_id = $[userId]
                RETURNING
                    id;`,
                { userId, ...req.body  } );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            winston.log("error", err);
            res.json( { error: err.message || err } );
        }
    } );

    app.delete( `/api/guests/remove/:id`, oidc.ensureAuthenticated(), async ( req: any, res ) => {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = await db.result( `
                DELETE
                FROM    guests
                WHERE   user_id = $[userId]
                AND     id = $[id]`,
                { userId, id: req.params.id  }, ( r ) => r.rowCount );
            return res.json( { id } );
        } catch ( err ) {
            // tslint:disable-next-line:no-console
            winston.log("error", err);
            res.json( { error: err.message || err } );
        }
    } );
};

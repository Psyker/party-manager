import dotenv from "dotenv";
import fs from "fs-extra";
import {Client} from "pg";
import * as winston from "winston";

const init = async () => {

    dotenv.config();

    const client = new Client();
    try {
        // connect to the local database server
        await client.connect();
        // read the contents of the initdb.pgsql file
        const sql = await fs.readFile( "./tools/initdb.pgsql", { encoding: "UTF-8" } );

        // split the file into separate statements
        const statements = sql.split( /;\s*$/m );
        for ( const statement of statements ) {
            if ( statement.length > 3 ) {
                // execute each of the statements
                await client.query( statement );
            }
        }
    } catch (err) {
        winston.log("error", err);
        throw err;
    } finally {
        await client.end();
    }

    init().then( () => {
        winston.log("info", "finished" );
    } ).catch( () => {
        winston.log("info", "finished with errors" );
    } );
};

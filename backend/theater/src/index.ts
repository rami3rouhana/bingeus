import express from 'express';
import config from "config";
import logger from "./utils/logger";
import initDatabase from './database/connection';
import expressApp from './express-app';

declare global {
    namespace Express {
        interface Request {
            jwt: string;
            user: {
                _id: string;
                email: string;
            };
        }
    }
}

const StartServer = async () => {

    const app = express();

    initDatabase();

    expressApp(app);

    app.listen(config.get<number>("PORT"), () => {
        logger.info(`Listening to port ${config.get<number>("PORT")}`);
    })
        .on('error', (err) => {
            logger.error(err);
            process.exit();
        })

}

StartServer();
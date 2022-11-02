import express from 'express';
import http from 'http';
import config from "config";
import logger from "./utils/logger";
import expressApp from './express-app';

const app = express();


const server = http.createServer(app);

expressApp(app, server);

server.listen(config.get<number>("PORT"), () => {
    logger.info(`Listening to port ${config.get<number>("PORT")}`);
})
    .on('error', (err) => {
        logger.error(err);
        process.exit();
    })
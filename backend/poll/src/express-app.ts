import express, { Express } from 'express';
import cors from 'cors';
import routes from './api/routes';
import { CreateChannel } from "./utils";

export default async (app: Express) => {

    const service = await CreateChannel();

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'));


    routes(app, service);

}

import express, { Express } from 'express';
import cors from 'cors';
import routes from './api/routes';
import bodyParser from "body-parser";
import { CreateChannel } from "./utils";

export default async (app: Express) => {

    const channel = await CreateChannel();
    app.use(bodyParser.raw({type:'application/octet-stream', limit:'100mb'}));
    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'));


    routes(app,channel);

}

import express, { Express } from 'express';
import cors from 'cors';
import routes from './api/routes';

export default (app: Express) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'));


    routes(app);

}

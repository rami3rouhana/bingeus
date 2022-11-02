import express, { Express } from 'express';
import cors from 'cors';
import services from './services/functionalities';
import http from 'http';
import { instrument } from "@socket.io/admin-ui";
import { Server } from "socket.io";
import { CreateChannel } from "./utils";


export default async (app: Express, server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'));

    const service = await CreateChannel();

    const io = new Server(server, {
        cors: {
            origin: ["https://admin.socket.io"],
            credentials: true
        },
    });

    instrument(io, {
        namespaceName: "/",
        auth: false
    });

    services(app, io, service);

}


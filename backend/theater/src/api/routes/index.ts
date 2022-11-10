import { Express } from "express";
import { createTheaterHandler, getAllTheaterHandler, getTheaterHandler, getTheaterByIdHandler, editTheaterHandler, blockUserHandler, CreatePlaylistHandler, RemovePlaylistHandler, GetPlaylistHandler, ArrangePlaylistHandler } from "../../controller/theater.controller";
import { getUserTheaters } from "../../service/theater.service";
import services from "../../service/other-services";
import { createUserTheaterSchema, editUserTheaterSchema, BlockSchema, CreatePlaylistSchema, TheaterSchema } from "../../database/schema/theater.schema";
import { Channel } from "amqplib";
import { validateUser } from '../middleware/validateUser';
import { validateResource } from '../middleware/validateResource';
import { SubscribeMessage } from "../../utils";

export default async (app: Express, channel: Channel) => {

    app.get('/user', validateUser, getTheaterHandler);

    app.get('/all', getAllTheaterHandler);

    app.get('/:id', validateResource(TheaterSchema), getTheaterByIdHandler);

    app.post('/', validateUser, validateResource(createUserTheaterSchema), createTheaterHandler);

    app.patch('/theater/:id', validateUser, validateResource(editUserTheaterSchema), editTheaterHandler);

    app.get('/block/:id', validateUser, validateResource(BlockSchema), blockUserHandler(channel));

    app.get('/playlist/:id', validateUser, GetPlaylistHandler);

    app.get('/playlist/:id/:movieId/:toId', validateUser, ArrangePlaylistHandler);

    app.post('/playlist/:id', validateUser, validateResource(CreatePlaylistSchema), CreatePlaylistHandler);

    app.delete('/playlist/:id/:movieId', validateUser, RemovePlaylistHandler);

    const service = new services();

    SubscribeMessage(channel, service);

}
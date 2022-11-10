import { Express } from "express";
import { createUserHandler, validateUserHandler, editProfile, getProfile, blockUser, uploadImage, displayImage } from "../../controller/user.controller";
import { createUserSchema, loginUserSchema, editUserSchema } from "../../database/schema/user.schema";
import { validateUser } from '../middleware/validateUser';
import { validateResource } from '../middleware/validateResource';
import { SubscribeMessage } from "../../utils";
import services from "../../service/other-services";
import { Channel } from "amqplib";

export default async (app: Express, channel: Channel) => {

    app.post('/signup', validateResource(createUserSchema), createUserHandler);

    app.post('/login', validateResource(loginUserSchema), validateUserHandler);

    app.get('/auth', validateUser, getProfile);

    app.patch('/profile', validateUser, validateResource(editUserSchema), editProfile);

    app.get('/image/:path', displayImage)

    app.post("/upload", validateUser, uploadImage);

    app.get('/unblock/:id', validateUser, blockUser(channel));

    const service = new services();

    SubscribeMessage(channel, service);

}
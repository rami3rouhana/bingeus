import { Express } from "express";
import { createUserHandler, validateUserHandler, editProfile, getProfile } from "../../controller/user.controller";
import { createUserSchema, loginUserSchema, editUserSchema } from "../../database/schema/user.schema";
import { validateUser } from '../middleware/validateUser';
import { validateResource } from '../middleware/validateResource';

export default async (app: Express) => {

    app.post('/signup', validateResource(createUserSchema), createUserHandler);

    app.post('/login', validateResource(loginUserSchema), validateUserHandler);

    app.get('/profile', validateUser, getProfile);

    app.post('/profile', validateUser, validateResource(editUserSchema), editProfile);


}
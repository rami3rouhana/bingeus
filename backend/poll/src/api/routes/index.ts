import { Express } from "express";
import { creatrePollHandler, RemovePollHandler, VoteHandler } from "../../controller/poll.controller";
import { PollSchema } from "../../database/schema/poll.schema";
import { validateUser } from '../middleware/validateUser';
import { validateResource } from '../middleware/validateResource';

export default async (app: Express) => {

    app.post('/poll', validateUser, validateResource(PollSchema), creatrePollHandler);

    app.delete('/poll/:id', validateUser, RemovePollHandler);

    app.put('/poll/:id/:vote', validateUser, VoteHandler);

}
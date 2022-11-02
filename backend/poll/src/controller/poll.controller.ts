import { Request, Response } from "express";
import { PollInput } from "../database/schema/poll.schema";
import { createPoll, removePoll, addVote } from "../service/poll.service"
import logger from '../utils/logger';

export const creatrePollHandler = async (
    req: Request<PollInput['params'], {}, PollInput['body']>,
    res: Response,
) => {
    try {
        const poll = await createPoll(req.body);
        return res.send(poll);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const RemovePollHandler = async (
    req: Request<PollInput['params']>,
    res: Response,
) => {
    try {
        const poll = await removePoll(req.params.id as string);
        return res.send(poll);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const VoteHandler = async (
    req: Request<PollInput['params']>,
    res: Response,
) => {
    try {
        await addVote(req.params.id as string , req.params.vote as string, req.user._id) ?
            res.send({ message: "Already Voted" }) :
            res.send({ message: "User Voted" });
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}
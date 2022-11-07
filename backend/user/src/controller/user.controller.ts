import { Request, Response } from "express";
import { CreateUserInput, ValidateUserLogin, ValidateUserEdit } from "../database/schema/user.schema";
import { createUser, validateUser, getUser, editUser, toogleBlock } from "../service/user.service";
import { ObjectId } from "mongoose";
import { Channel } from 'amqplib';
import logger from '../utils/logger';

export const createUserHandler = async (
    req: Request<{}, {}, CreateUserInput['body']>,
    res: Response
) => {

    try {
        const user = await createUser(req.body);
        return res.send(user);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }

}

export const validateUserHandler = async (
    req: Request<{}, {}, ValidateUserLogin['body']>,
    res: Response
) => {

    try {
        const user = await validateUser(req.body);
        return res.send(user);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const editProfile = async (
    req: Request<{}, {}, ValidateUserEdit['body']>,
    res: Response
) => {
    try {
        const user = await editUser(req.body, req.user.email);
        return res.send(user);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const getProfile = async (
    req: Request,
    res: Response
) => {
    try {
        const user = await getUser(req.user._id);
        return res.send(user);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const blockUser = (channel: Channel) => async (
    req?: Request,
    res?: Response,
) => {
    try {
        const blocked = await toogleBlock(req?.user._id as string, req?.params.id as string, channel);
        res?.send(blocked);

    } catch (e: any) {
        logger.error(e);
        return res?.status(409).send(e.message);
    }
}
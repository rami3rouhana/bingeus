import { Request, Response } from "express";
import { CreateUserInput, ValidateUserLogin, ValidateUserEdit } from "../database/schema/user.schema";
import { createUser, validateUser, getUser, editUser, toogleblock } from "../service/user.service";
import { ObjectId } from "mongoose";
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
        const user = await getUser(req.user.email);
        return res.send(user);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const blockUser = async (
    req: Request,
    res: Response,
) => {
    try {
        const blockUser = await getUser(req.params.id);

        const user = {
            userId: blockUser?.id as ObjectId,
            name: blockUser?.name as string,
            image: blockUser?.image as string,
        }

        const blocked = await toogleblock(req.user._id, user);

        blocked ? res.send({ message: "User Blocked" }) : res.send({ message: "User Unblocked" });

    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}
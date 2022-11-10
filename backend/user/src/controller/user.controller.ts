import { Request, Response } from "express";
import { CreateUserInput, ValidateUserLogin, ValidateUserEdit } from "../database/schema/user.schema";
import { createUser, validateUser, getUser, editUser, toogleBlock, updateImage } from "../service/user.service";
import { ObjectId } from "mongoose";
import { Channel } from 'amqplib';
import logger from '../utils/logger';
import multer from 'multer';

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

export const displayImage = async (
    req: Request,
    res: Response
) => {
    try {
        const image = `public/${req.params.path}`;
        res.sendFile(image, { root: '.' });
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

export const uploadImage = async (
    req: Request,
    res: Response
) => {

    let path = '';

    const storage = multer.diskStorage({
        destination: function (req: any, file: any, cb: any) {
            cb(null, 'public')
        },
        filename: function (req: any, file: any, cb: any) {
            path = Date.now() + '-' + file.originalname;
            cb(null, path)
        }
    });

    const upload = multer({ storage: storage }).single('file');

    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        const user = await updateImage(req.user._id, path)
        return res.status(200).send(user)
    })
}

export const editProfile = async (
    req: Request<{}, {}, ValidateUserEdit['body']>,
    res: Response
) => {
    try {
        const user = await editUser(req.body, req.user._id);
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
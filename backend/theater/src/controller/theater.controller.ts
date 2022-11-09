import { Request, Response } from "express";
import { CreateTheaterInput, BlockInput, PollInput, CreatePlaylistInput, GetTheater } from "../database/schema/theater.schema";
import { createTheater, getAllTheaters, getUserTheaters, editTheater, toogleBlock, insertMedia, removeMedia, getPlaylist, arrangePlaylist, getTheaterById } from "../service/theater.service";
import logger from '../utils/logger';

export const createTheaterHandler = async (
    req: Request<{}, {}, CreateTheaterInput['body']>,
    res: Response,
) => {

    try {
        req.body.adminId = req.user._id;
        const theater = await createTheater(req.body);
        return res.send(theater);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const getTheaterHandler = async (
    req: Request,
    res: Response,
) => {
    try {
        const theater = await getUserTheaters(req.user._id);
        return res.send(theater);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}


export const getAllTheaterHandler = async (
    req: Request,
    res: Response,
) => {
    try {
        const theater = await getAllTheaters();
        return res.send(theater);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const getTheaterByIdHandler = async (
    req: Request<GetTheater['params']>,
    res: Response,
) => {
    try {
        console.log('hy')
        const theater = await getTheaterById(req.params.id);
        return res.send(theater);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const editTheaterHandler = async (
    req: Request<PollInput['params'], {}, CreateTheaterInput['body']>,
    res: Response
) => {
    try {
        const theater = await editTheater(req.body, req.params.id, req.user._id);
        return res.send(theater);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}


export const blockUserHandler = (channel) => async (
    req: Request<BlockInput['params']>,
    res: Response,
) => {
    try {
        const blocked = await toogleBlock(req.user._id, req.params.id, channel);
        return res.send(blocked);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const CreatePlaylistHandler = async (
    req: Request<CreatePlaylistInput['params'], {}, CreatePlaylistInput['body']>,
    res: Response
) => {
    try {
        const playlist = await insertMedia(req.params.id as string, req.body);
        return res.send(playlist);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const RemovePlaylistHandler = async (
    req: Request<CreatePlaylistInput['params']>,
    res: Response
) => {
    try {
        const playlist = await removeMedia(req.params.id as string, req.params.movieId as string);
        return res.send(playlist);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const GetPlaylistHandler = async (
    req: Request<CreatePlaylistInput['params']>,
    res: Response
) => {
    try {
        const playlist = await getPlaylist(req.params.id as string);
        return res.send(playlist);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const ArrangePlaylistHandler = async (
    req: Request<CreatePlaylistInput['params']>,
    res: Response
) => {
    try {
        const playlist = await arrangePlaylist(req.params.id as string, req.params.movieId as string, req.params.toId as string);
        return res.send(playlist);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}
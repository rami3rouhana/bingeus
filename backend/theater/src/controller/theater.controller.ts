import { Request, Response } from "express";
import { CreateTheaterInput, BlockInput, PollInput, CreatePlaylistInput, GetTheater } from "../database/schema/theater.schema";
import { createTheater, getAllTheaters, getUserTheaters, editTheater, toogleBlock, insertMedia, removeMedia, getPlaylist, arrangePlaylist, getTheaterById } from "../service/theater.service";
import logger from '../utils/logger';
import fs from 'fs';
import md5 from "md5";

export const createTheaterHandler = async (
    req: Request<{}, {}, CreateTheaterInput['body']>,
    res: Response,
) => {

    try {
        const theater = await createTheater(req.body, req.user._id);
        return res.send(theater);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export const streamVideo = async (
    req: Request,
    res: Response,
) => {
    const videoPath = `/app/theater/public/${req.params.id}`;
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const videoRange = req.headers.range;

    if (videoRange) {
        const parts = videoRange.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);

        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });

        const header = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, header);
        file.pipe(res);
    } else {
        const header = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(200, header);
        fs.createReadStream(videoPath).pipe(res);
    }
}

export const uploadVideo = (
    req: Request,
    res: Response,
) => {
    const { name, currentChunkIndex, totalChunks } = req.query;
    const firstChunk = parseInt(currentChunkIndex) === 0;
    const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;
    const ext = name.split('.').pop();
    const data = req.body.toString().split(',')[1];
    const buffer = Buffer.from(data, 'base64');
    const tmpFilename = 'tmp_' + md5(name + req.ip) + '.' + ext;
    if (firstChunk && fs.existsSync('./public/' + tmpFilename)) {
        fs.unlinkSync('./public/' + tmpFilename);
    }
    fs.appendFileSync('./public/' + tmpFilename, buffer);
    if (lastChunk) {
        const finalFilename = md5(Date.now()).substr(0, 6) + '.' + ext;
        fs.renameSync('./public/' + tmpFilename, './public/' + finalFilename);
        res.json({ finalFilename });
    } else {
        res.json('ok');
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
import { Express } from 'express';
import { Server } from "socket.io";
import { Channel } from "amqplib";
import logger from "../../utils/logger";
import { userCredentials, SubscribeMessage } from '../../utils';
import validateSignature from '../middleware/validateUser';
import axios from 'axios';
import services from './service.class';
import fs from 'fs';

declare module 'socket.io' {
    interface Socket {
        _id: string;
        admin: boolean;
        theater: string;
    }
}


export default async (app: Express, io: Server<any, any, any, any>, channel: Channel) => {

    const service = new services();

    SubscribeMessage(channel, service)

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

    app.get('/video/:id', (req, res) => {

        const videoPath = `${__dirname}/assests/${req.params.id}.mp4`;
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

    });


    const theaterIo = io.of('/theater');

    theaterIo.use(async (socket, next) => {

        let payloads = await validateSignature(socket.handshake.auth.token) as unknown as userCredentials;

        if (payloads)
            socket._id = payloads._id;

        let theater
        try {
            theater = await axios.get(`http://localhost:8002/theater/${socket.handshake.auth.theater}`);
        } catch (error) {
            return logger.error("Theater Doesn't Exist");
        }

        socket.theater = socket.handshake.auth.theater;

        if (theater.data.adminId === socket._id) {
            socket.admin = true;
        }

        if (theater.data.blockedList.includes(socket._id)) {
            socket.emit('blocked');
            socket.disconnect();
            return logger.error("User is blocked");
        }

        socket.theater = socket.handshake.auth.theater;

        socket.join(socket.handshake.auth.theater);

        next();
    })

    theaterIo.on('connection', (socket) => {

        socket.to(socket.theater).emit('receive message', `${socket._id} Joined room ${socket.theater}`);

        logger.info(`admin ${socket._id} connected`);

        socket.emit("connected", socket._id);

        socket.on("block", async (id: string) => {
            if (socket.admin) {
                const users = await theaterIo.fetchSockets();
                const user = users.find((socket: any) => socket._id === id) as any;
                if (user) {
                    let blocked = await axios.put(`http://localhost:8002/block/${user._id}`, {}, {
                        headers: {
                            'Authorization': 'Bearer ' + socket.handshake.auth.token
                        }
                    });
                    logger.error(blocked.data.message)
                    user.disconnect();
                }
            }
        })

        socket.on('chat message', (msg: string, room: string) => {

            if (room.length === 0) {
                socket.broadcast.emit('receive message', msg);
            }

            if (socket._id)
                theaterIo.to(room).emit('receive message', msg);
        });

        socket.on('join room', (room: string) => {
            socket.join(room);
            socket.broadcast.emit('receive message', `User ${socket.id} has Joined ${room}`);
        })

        socket.on('disconnect', () => {
            theaterIo.to(socket.theater).emit('receive message', `${socket._id} left room ${socket.theater}`);
            logger.error('user disconnected');
        });
    });

}
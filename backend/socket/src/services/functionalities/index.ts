import { Express } from 'express';
import { Server } from "socket.io";
import { Channel } from "amqplib";
import logger from "../../utils/logger";
import { PublishMessage, userCredentials, SubscribeMessage } from '../../utils';
import validateSignature from '../middleware/validateUser';
import axios from 'axios';
import config from 'config';
import services from './service.class';


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

        if (theater.data.adminId === socket._id) {
            socket.admin = true;
        }

        if (theater.data.blockedList.includes(socket._id)) {
            throw new Error("User is blocked");
        }

        socket.theater = socket.handshake.auth.theater;

        socket.join(socket.handshake.auth.theater);

        next();
    })
    
    theaterIo.on('connection', (socket) => {

        logger.info(`admin ${socket._id} connected`);

        socket.emit("connected", socket._id);

        socket.on('chat message', (msg: string, room: string) => {

            if (room.length === 0) {
                socket.broadcast.emit('receive message', msg);
            }

            if (socket._id)
                socket.to(room).emit('receive message', msg);
        });



        socket.on('join room', (room: string) => {
            socket.join(room);
            socket.broadcast.emit('receive message', `User ${socket.id} has Joined ${room}`);
        })

        socket.on('disconnect', () => {
            logger.error('user disconnected');
        });
    });

}
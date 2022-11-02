import { Express } from 'express';
import { Server } from "socket.io";
import { Channel } from "amqplib";
import logger from "../../utils/logger";
import { PublishMessage, userCredentials, SubscribeMessage } from '../../utils';
import validateSignature from '../middleware/validateUser';
import config from 'config';
import services from './service.class';


declare module 'socket.io' {
    interface Socket {
        _id: string
        username: string
    }
}


export default async (app: Express, io: Server<any, any, any, any>, channel: Channel, callback) => {

    const service = new services();

    SubscribeMessage(channel, service, callback)

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
    const theaterIo = io.of('/theater');

    theaterIo.use(async (socket, next) => {
        if (socket.handshake.auth.token) {
            let payloads = await validateSignature(socket.handshake.auth.token) as unknown as userCredentials;
            if (payloads instanceof Error) {
                return logger.error(payloads);
            }
            socket._id = payloads._id;
            payloads = { ...payloads, _id: socket.handshake.auth.room }
            const pay = {
                payloads,
                event: "GET_THEATER"
            }
            PublishMessage(channel, config.get<string>('THEATER_SERVICE'), JSON.stringify(pay));
            next();
        } else {
            return new Error("Token Invalid");
        }
    })
    theaterIo.on('connection', (socket) => {

        logger.info(`admin ${socket._id} connected`);

        socket.emit("connected", socket._id);

        socket.on('chat message', (msg: string, room: string) => {

            if (room.length === 0) {
                socket.broadcast.emit('receive message', msg);
            }

            socket.to(room).emit('receive message', msg);
        });

        // socket.on('join room', (room,cb) =>{
        //     socket.join(room);
        //     cb(`User ${socket.id} has Joined ${room}`)
        // })

        socket.on('join room', (room: string) => {
            socket.join(room);
            socket.broadcast.emit('receive message', `User ${socket.id} has Joined ${room}`);
        })

        socket.on('disconnect', () => {
            logger.error('user disconnected');
        });
    });

}
import { Express } from 'express';
import { Server } from "socket.io";
import { Channel } from "amqplib";
import logger from "../../utils/logger";
import { userCredentials } from '../../utils';
import validateSignature from '../middleware/validateUser';
import axios from 'axios';
import services from './service.class';

declare module 'socket.io' {
    interface Socket {
        _id: string;
        isAdmin: boolean;
        theater: string;
    }
}

const validate = async (socket: any, next: any, user?: any) => {

    let payloads = await validateSignature(socket.handshake.auth.token) as unknown as userCredentials;
    if (typeof payloads === 'undefined')
        return false
    socket._id = payloads._id;
    socket.name = payloads.name;
    socket.image = payloads.image;

    let theater

    try {
        theater = await axios.get(`http://proxy/theater/${socket.handshake.auth.theater}`);
    } catch (error) {
        console.log(error);
        return logger.error("Theater Doesn't Exist");
    }

    socket.theater = socket.handshake.auth.theater;

    if (theater.data.adminId === socket._id) {
        socket.isAdmin = true;
    }

    if (theater.data.blockedList.includes(socket._id)) {
        socket.emit('blocked');
        socket.disconnect();
        return logger.error("User is blocked");
    }

    {
        if (user)
            user[socket.theater] ?
                user[socket.theater]++ :
                user[socket.theater] = 1;

        console.log(user);
    }
    socket.join(socket.handshake.auth.theater);

    next();
}


export default async (app: Express, io: Server<any, any, any, any>, channel: Channel) => {

    let user: any = {};
    const HomeIo = io.of('/main');

    HomeIo.on('connection', async (socket) => {

        const users = await theaterIo.fetchSockets();
        console.log('hy')
        socket.emit('theaters', JSON.stringify(users));

    });

    const MovieIo = io.of('/movie');

    MovieIo.use(async (socket, next) => validate(socket, next, user));
    MovieIo.isPlaying = false;
    let timePlaying = 0;
    MovieIo.on('connection', (socket) => {

        socket.emit('isAdmin', socket.isAdmin, MovieIo.isPlaying);

        if (socket.isAdmin) {
            socket.on('handle preview', () => {
                socket.broadcast.emit('handle preview', timePlaying);
            })
            socket.on('handle pause', () => {
                MovieIo.isPlaying = false;
                socket.broadcast.emit('handle pause', timePlaying, MovieIo.isPlaying);
            })
            socket.on('handle play', () => {
                MovieIo.isPlaying = true;
                socket.broadcast.emit('handle play', timePlaying, MovieIo.isPlaying);
            })
            socket.on('handle ended', () => {
                MovieIo.isPlaying = false;
                socket.broadcast.emit('handle ended', timePlaying);
            })
            socket.on('handle progress', (progress) => {
                timePlaying = progress.playedSeconds;
                socket.broadcast.emit('handle progress', progress);
            })
            socket.on('handle duration', (duration) => {
                socket.broadcast.emit('handle duration', duration);
            })
            socket.on('disconnect', async () => {
                MovieIo.isPlaying = false;
                socket.broadcast.emit('handle pause', timePlaying);
            })
        }

    });

    const pollIo = io.of('/main');

    pollIo.use(async (socket, next) => validate(socket, next, user));

    pollIo.on('connection', (socket) => {


    });

    const theaterIo = io.of('/theater');

    theaterIo.use(async (socket, next) => validate(socket, next, user));

    theaterIo.on('connection', async (socket) => {

        socket.to(socket.theater).emit('receive message', `${socket.name} Joined room ${socket.theater}`);

        const users = await theaterIo.fetchSockets();

        const filterUsers = users.map(user => {
            return {
                name: user.name,
                image: user.image,
                id: user._id
            }
        })

        socket.to(socket.theater).emit('fetch users', filterUsers);

        logger.info(`admin ${socket._id} connected`);

        socket.to(socket.theater).emit("connected", socket._id);

        socket.on("block", async (id: string) => {
            if (socket.isAdmin) {
                const users = await theaterIo.fetchSockets();
                const user = users.find((socket: any) => socket._id === id) as any;
                if (user) {
                    let blocked = await axios.put(`http://proxy/theater/${user._id}`, {}, {
                        headers: {
                            'Authorization': 'Bearer ' + socket.handshake.auth.token
                        }
                    });
                    logger.error(blocked.data.message)
                    user.disconnect();
                }
            }
        })

        socket.on('chat message', (msg: string) => {

            if (socket.theater.length === 0) {
                socket.broadcast.emit('receive message', msg);
            }

            if (socket._id)
                theaterIo.to(socket.theater).emit('receive message', msg);

        });


        socket.on('create poll', async (msg) => {
            try {
                const poll = await axios.post(`http://proxy/poll/${socket.handshake.auth.theater}`, msg, {
                    headers: {
                        'Authorization': 'Bearer ' + socket.handshake.auth.token
                    }
                })
                socket.emit('add poll', msg);
            } catch (error) {
                logger.error(error)
            }
        })

        socket.on('disconnect', async () => {
            const users = await theaterIo.fetchSockets();

            const filterUsers = users.map(user => {
                return {
                    name: user.name,
                    image: user.image,
                    id: user._id
                }
            })
            socket.to(socket.theater).emit('fetch users', filterUsers);
            user[socket.theater]--;
            theaterIo.to(socket.theater).emit('receive message', `${socket.name} left room ${socket.theater}`);
            logger.error('user disconnected');
        })
    });

}
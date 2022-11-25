import { Express } from 'express';
import { Server } from "socket.io";
import { Channel } from "amqplib";
import logger from "../../utils/logger";
import { userCredentials } from '../../utils';
import validateSignature from '../middleware/validateUser';
import axios from 'axios';

declare module 'socket.io' {
    interface Socket {
        _id: string;
        isAdmin: boolean;
        theater: string;
    }
}

const validate = async (socket: any, next: any) => {

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

    socket.isPlaying = false;

    socket.join(socket.handshake.auth.theater);

    next();
}


export default async (app: Express, io: Server<any, any, any, any>, channel: Channel) => {

    let user: any = {};
    const HomeIo = io.of('/main');
    HomeIo.on('connection', async (socket) => {
        let theaters = {};
        const d = await theaterIo.fetchSockets();
        const m = await MovieIo.fetchSockets();

        m.map(s => {
            if (typeof theaters[s.theater] !== 'undefined') {
                theaters[s.theater].count = theaters[s.theater].count + 1;
            } else {
                theaters[s.theater] = { count: 1 };
            }
            if (s.isAdmin && s.isPlaying) {
                theaters[s.theater] = { ...theaters[s.theater], isPlaying: true, current: s.current, duration: s.duration };
            } else if (s.isAdmin)
                theaters[s.theater] = { ...theaters[s.theater], isPlaying: false, current: s.current, duration: s.duration };
        })

        socket.emit('theaters', JSON.stringify(theaters));

    });

    const MovieIo = io.of('/movie');

    MovieIo.use(async (socket, next) => validate(socket, next));


    MovieIo.on('connection', (socket) => {

        socket.emit('isAdmin', socket.isAdmin, socket.isPlaying);

        if (socket.isAdmin) {
            socket.on('handle change', (url) => {
                socket.broadcast.emit('handle change', url);
            })
            socket.on('handle preview', () => {
                socket.current = 0;
                socket.broadcast.emit('handle preview', socket.current);
            })
            socket.on('handle pause', () => {
                socket.isPlaying = false;
                socket.broadcast.emit('handle pause', socket.current, socket.isPlaying);
            })
            socket.on('handle play', () => {
                socket.isPlaying = true;
                socket.broadcast.emit('handle play', socket.current, socket.isPlaying);
            })
            socket.on('handle ended', () => {
                socket.isPlaying = false;
                socket.broadcast.emit('handle ended', socket.current);
            })
            socket.on('handle progress', (progress) => {
                socket.current = progress.playedSeconds;
                socket.broadcast.emit('handle progress', progress);
            })
            socket.on('handle duration', (duration) => {
                socket.duration = duration;
                socket.broadcast.emit('handle duration', duration);
            })
            socket.on('disconnect', async () => {
                socket.isPlaying = false;
                socket.broadcast.emit('handle pause', socket.current);
            })
        }

    });

    const pollIo = io.of('/poll');

    pollIo.use(async (socket, next) => validate(socket, next));

    pollIo.on('connection', (socket) => {


    });

    const theaterIo = io.of('/theater');

    theaterIo.use(async (socket, next) => validate(socket, next));

    theaterIo.on('connection', async (socket) => {

        socket.to(socket.theater).emit('user join', `${socket.name} joined the room`);

        socket.emit('receive users', async () => {
            const users = await theaterIo.fetchSockets();
            const usersOn = users.map(user => {
                if (user._id !== socket._id)
                    return {
                        name: user.name,
                        image: user.image,
                        id: user._id
                    }
            })
        });

        socket.on('fetch users', async () => {
            const users = await theaterIo.fetchSockets();
            const usersOn = users.map(user => {
                if (user._id !== socket._id)
                    return {
                        name: user.name,
                        image: user.image,
                        id: user._id
                    }
            })
            if (socket.isAdmin)
                socket.emit('receive users', usersOn);
        })
        logger.info(`admin ${socket._id} connected`);

        socket.to(socket.theater).emit("connected", socket._id);

        socket.on("block", async (id: string) => {
            if (socket.isAdmin) {
                const users = await theaterIo.fetchSockets();
                const user = users.find((socket: any) => socket._id === id) as any;
                let blocked;
                if (user) {
                    try {
                        blocked = await axios.get(`http://proxy/theater/block/${user._id}`, {
                            headers: {
                                'Authorization': 'Bearer ' + socket.handshake.auth.token
                            }
                        });
                    } catch (error) {
                        logger.error(error)
                    }

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
                theaterIo.to(socket.theater).emit('receive message', { msg, name: socket.name, id: socket._id });

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
            theaterIo.to(socket.theater).emit('user join', `${socket.name} left the room`);
            logger.error('user disconnected');
        })
    });

}
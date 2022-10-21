import express from 'express';
const { PORT } = require('../config');

const StartServer = async () => {

    const app = express();

    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    })
        .on('error', (err) => {
            console.log(err);
            process.exit();
        })

}

StartServer();
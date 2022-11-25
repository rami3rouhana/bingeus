import dotEnv from "dotenv";

if (process.env.npm_lifecycle_event !== "prod") {
    const configFile = `../${process.env.npm_lifecycle_event}.env`;
    dotEnv.config({ path: configFile });
} else {
    dotEnv.config(`../.env`);
}

export default {
    PORT: process.env.THEATER_PORT as unknown as number,
    DB_URL: process.env.MONGODB_URI,
    APP_SECRET: process.env.APP_SECRET,
    EXCHANGE_NAME: "BINGE_US",
    MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
    SOCKET_SERVICE: "SOCKET_SERVICE",
    THEATER_SERVICE: "THEATER_SERVICE",
    POLL_SERVICE: "POLL_SERVICE",
    USER_SERVICE: "USER_SERVICE",
    QUEUE_NAME: "THEATER_QUEUE"
};
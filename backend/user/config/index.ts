import dotEnv from "dotenv";

if (process.env.npm_lifecycle_event !== "prod") {
    const configFile = `./${process.env.npm_lifecycle_event}.env`;
    dotEnv.config({ path: configFile });
} else {
    dotEnv.config();
}

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URI,
    APP_SECRET: process.env.APP_SECRET,
};
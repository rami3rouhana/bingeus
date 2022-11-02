import mongoose from "mongoose";
import config from "config";
import logger from "../utils/logger";

module.exports = async () => {

    try {
        mongoose.connect(config.get<string>('DB_URL'));
        logger.info("DB connected");

    } catch (error) {
        logger.error("Error ============");
        logger.error(error);
        process.exit(1);
    }

};



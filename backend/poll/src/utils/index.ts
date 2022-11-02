import jwt from "jsonwebtoken";
import config from "config";
import { Request } from "express";
import amqplib, { Channel } from "amqplib";

interface userCredentials {
  _id: string;
  email: string;
}


//Utility functions

export const GenerateSignature = (payload: object) => {
  return jwt.sign(payload, config.get<string>('APP_SECRET'), { expiresIn: "1d" });
}
export const ValidateSignature = (req: Request) => {

  const signature = req?.get("Authorization");

  if (signature) {
    const payload = jwt.verify(signature.split(" ")[1], config.get<string>('APP_SECRET'));
    req.user = payload as userCredentials;
    return true;
  }

  return false;
};

export const FormateData = (data: object) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

//Message Broker
export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(config.get<string>('MSG_QUEUE_URL'));
    const channel = await connection.createChannel();
    await channel.assertQueue(config.get<string>('EXCHANGE_NAME'), "direct", { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

export const PublishMessage = (channel: Channel, service: string, msg: string) => {
  channel.publish(config.get<string>('EXCHANGE_NAME'), service, Buffer.from(msg), {
    persistent: true
  });
  console.log("Sent: ", msg);
};
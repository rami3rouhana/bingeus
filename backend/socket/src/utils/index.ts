import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";
import amqplib, { Channel, ConsumeMessage } from "amqplib";

export class userCredentials {
  constructor(public _id: string, public name: string, public image: string) {
    this._id = _id;
    this.name = name;
    this.image = image;
  }
}

//Utility functions

export const GenerateSignature = (payload: userCredentials) => {
  return jwt.sign(payload, config.get<string>('APP_SECRET'), { expiresIn: "1d" });
}
export const ValidateSignature = (token: string | JwtPayload) => {
  if (token) {
    const payload = jwt.verify(token as string, config.get<string>('APP_SECRET')) as userCredentials;
    return payload;
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
    await channel.assertQueue(config.get<string>('EXCHANGE_NAME'), { durable: true });
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


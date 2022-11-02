import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";
import amqplib, { Channel, ConsumeMessage } from "amqplib";

export class userCredentials {
  constructor(public _id: string, public email: string) {
    this._id = _id;
    this.email = email;
  }
}

//Utility functions

export const GenerateSignature = (payload: userCredentials) => {
  return jwt.sign(payload, config.get<string>('APP_SECRET'), { expiresIn: "1d" });
}
export const ValidateSignature = (token: string | JwtPayload) => {
  if (token) {
    const payload = jwt.verify(token as string, config.get<string>('APP_SECRET')) as userCredentials;
    const response = { _id: payload?._id, email: payload?.email } as userCredentials
    return response;
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

export const SubscribeMessage = async (channel: Channel, service) => {
  await channel.assertExchange(config.get<string>('EXCHANGE_NAME'), "direct", { durable: true });
  const q = await channel.assertQueue(config.get<string>('QUEUE_NAME'), { exclusive: true, durable: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);
  channel.bindQueue(q.queue, config.get<string>('EXCHANGE_NAME'), config.get<string>('SOCKET_SERVICE'));

  channel.consume(
    q.queue,
    (msg) => {
      if (msg?.content) {
        channel.ack(msg)
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString(), channel);
      }
      console.log("[X] received");
    }
  )
}

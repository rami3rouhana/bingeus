import { toogleBlock } from "./theater.service";
import { Channel } from 'amqplib';

interface payload {
    event: string,
    payloads: {
        _id: string,
        userId: string
    }
}


class services {

    async SubscribeEvents(payload: string | payload, channel: Channel) {
        console.log('Triggering.... Theater Events')

        payload = JSON.parse(payload as string) as payload;

        const { event, payloads } = payload;

        if (payloads)
            switch (event) {
                case 'UNBLOCK_USER':
                    toogleBlock(payloads._id, payloads.userId, channel)
                    break;
                default:
                    break;
            }
        else
            console.log(payloads);
    }
}


export default services;
import { getUserTheaters, toogleBlock } from "./theater.service";

class services {

    async SubscribeEvents(payload, channel) {
        console.log('Triggering.... Theater Events')

        payload = JSON.parse(payload)

        const { event, payloads } = payload;

        if (payloads)
            switch (event) {
                case 'GET_THEATER':
                    getUserTheaters(payloads._id)
                    break;
                case 'UNBLOCK_USER':
                    toogleBlock(payloads._id, payloads.userId, channel)
                    break;
                default:
                    break;
            }
        else
            console.log(payloads)
    }
}


export default services;
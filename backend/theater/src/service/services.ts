import { getUserTheaters } from "./theater.service";

class services {

    async SubscribeEvents(payload, channel) {
        console.log('Triggering.... Theater Events')

        payload = JSON.parse(payload)

        const { event, payloads } = payload;

        if (payloads)
            switch (event) {
                case 'GET_THEATER':
                    getUserTheaters(payloads._id, channel)
                    break;
                case 'REMOVE_OFFER':
                    // this.RemoveCompanyOffer(_id, offerId);
                    break;
                default:
                    break;
            }
        else
            console.log(payloads)
    }
}


export default services;
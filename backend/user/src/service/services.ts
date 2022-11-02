import { toogleBlock } from "./user.service";

class services {

    async SubscribeEvents(payload, channel) {
        console.log('Triggering.... Theater Events')

        payload = JSON.parse(payload)

        const { event, payloads } = payload;

        if (payloads)
            switch (event) {
                case 'BLOCK_USER':
                    toogleBlock(payloads._id, payloads.userId, channel)
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
class services {

    async SubscribeEvents(payload,channel) {
        console.log('Triggering.... Socket Events')
        // console.log(payload)
        // payload = JSON.parse(payload)

        const { event, payloads } = payload;

        switch (event) {
            case 'RECEIVE_THEATER':
                // receiveTheater(payloads);
                break;
            case 'REMOVE_OFFER':
                // this.RemoveCompanyOffer(_id, offerId);
                break;
            default:
                break;
        }
    }
}


export default services;
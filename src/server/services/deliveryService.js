const { Delivery } = require('../db');
const { userService } = require('./userService');

class deliveryService {
    static async addDeliveryAndSetUserDelivery(newDelivery) {
        const { title, receiver, code, address, subAddress, contact, loggedInUser } = newDelivery;

        const buildDelivery = new Delivery({
            title: title || '',
            receiver: receiver || '',
            code,
            address,
            subAddress,
            contact,
            owner: loggedInUser._id,
        });

        return await Delivery.create(buildDelivery);
    }

    static async findAllDeliveriesByOwner(userId, skip, limit) {
        const deliveries = await Delivery.find({ owner: userId }).skip(skip).limit(limit);

        const uniqueAddresses = new Set();
        const uniqueDeliveries = [];

        deliveries.forEach((delivery) => {
            const address = delivery.address;
            if (!uniqueAddresses.has(address)) {
                uniqueAddresses.add(address);
                uniqueDeliveries.push(delivery);
            }
        });

        return uniqueDeliveries;
    }

    static async findAllDeliveriesByOwner(userId) {
        return await Delivery.find({ owner: userId });
    }

    static async findDeliveryById(_id) {
        return await Delivery.findById(_id);
    }
    static async getTotaldeliveriesCount(userId) {
        const deliveries = await Delivery.find({ owner: userId }).exec();

    static async modifyDelivery(deliveryId, newDelivery) {
        const { contact, code, address, subAddress } = newDelivery;
        await Delivery.updateOne(
            { _id: deliveryId },
            {
                code: code,
                address: address,
                subAddress: subAddress,
                contact: contact,
            }
        );
        return Delivery.findById(deliveryId);
    }
}

module.exports = { deliveryService };

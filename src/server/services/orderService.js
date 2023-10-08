const mongoose = require('mongoose');
const { Order, Delivery } = require('../db');
const { userService } = require('./userService');

class orderService {
    static async addOrder(newOrder) {
        const { comment, totalAmount, loggedInUser, delivery, productIds } = newOrder;
        if (!productIds.every((productId) => mongoose.Types.ObjectId.isValid(productId))) {
            throw Object.assign(new Error('유효하지 않은 상품 ID가 포함되어 있습니다.'), { status: 400 });
        }

        const buildOrder = new Order({
            comment,
            totalAmount,
            orderUserId: loggedInUser._id,
            delivery,
            products: productIds,
        });

        const order = await Order.create(buildOrder);

        await userService.addUserOrder(loggedInUser._id, order._id);

        return order;
    }

    static async findAllOrders(filter, deliveryFilter) {
        const deliveryDocs = await Delivery.find(deliveryFilter, '_id');
        const orderIds = deliveryDocs.map((doc) => doc._id);
        filter.delivery = { $in: orderIds };

        return await Order.find(filter)
            .populate({
                path: 'delivery',
                select: 'receiver',
            })
            .exec();
    }

    static async findByOrderer(orderUserId) {
        return await Order.find({ orderUserId: orderUserId });
    }

    static async modifyOrderStatus({ _id, status }) {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            const error = new Error('주문 Id 값이 유효하지 않습니다.');
            error.status = 400;
            throw error;
        }

        return await Order.findByIdAndUpdate(
            _id,
            { status: status },
            {
                new: true,
                runValidators: true,
            }
        );
    }
}

module.exports = { orderService };

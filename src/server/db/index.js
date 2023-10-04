const mongoose = require('mongoose');
const ProductSchema = require('./schemas/product');
const UserSchema = require('./schemas/user');
const DeliverySchema = require('./schemas/delivery');

exports.Product = mongoose.model('Product', ProductSchema);
exports.User = mongoose.model('User', UserSchema);
exports.Delivery = mongoose.model('Delivery', DeliverySchema);
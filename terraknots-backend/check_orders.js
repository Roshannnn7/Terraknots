require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

async function checkOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const orders = await Order.find().sort({ createdAt: -1 }).limit(2);
        console.log(JSON.stringify(orders, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

checkOrders();

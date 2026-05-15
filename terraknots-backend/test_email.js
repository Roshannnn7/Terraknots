require('dotenv').config();
const mongoose = require('mongoose');
const { sendEmail, getOrderConfirmationEmail } = require('./utils/sendEmail');
const Order = require('./models/Order');

async function testOrderEmail() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const order = await Order.findOne({ orderId: 'TK-10002' });
        
        console.log('Got order:', order.orderId);
        
        const html = getOrderConfirmationEmail(order);
        
        console.log('Sending to terraknots.in@gmail.com...');
        await sendEmail({
            email: 'terraknots.in@gmail.com',
            subject: `Test Order - ${order.orderId}`,
            html: html
        });
        
        console.log('Success!');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        mongoose.disconnect();
    }
}

testOrderEmail();

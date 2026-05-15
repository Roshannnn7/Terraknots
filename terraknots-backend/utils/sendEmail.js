const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const message = {
        from: `${process.env.STORE_NAME || 'TerraKnots'} <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(message);
};

// Email templates
const getOrderConfirmationEmail = (order) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #2C2C2C; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #C4A882; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #F5F0EB; padding: 30px; }
        .footer { background: #8B7355; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .button { background: #C4A882; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Order Confirmed!</h1>
          <p>Thank you for your order</p>
        </div>
        <div class="content">
          <h2>Hi ${order.guestInfo?.name || order.shippingAddress.fullName},</h2>
          <p>Your order has been received and is being processed with love! 💛</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          </div>
          
          <h3>Order Items:</h3>
          ${order.items.map(item => `
            <div class="order-item">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}</p>
            </div>
          `).join('')}
          
          <h3>Shipping Address:</h3>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <p>${order.shippingAddress.fullName}</p>
            <p>${order.shippingAddress.addressLine1}, ${order.shippingAddress.addressLine2 || ''}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
            <p>Phone: ${order.shippingAddress.phone}</p>
          </div>
          
          <p style="margin-top: 20px;">Expected delivery: 5-7 business days</p>
          <p>We'll send you a tracking number once your order ships!</p>
          
          <center>
            <a href="${process.env.FRONTEND_URL}/account/orders/${order._id}" class="button">Track Your Order</a>
          </center>
        </div>
        <div class="footer">
          <p>Handmade with heart, knot by knot 💛</p>
          <p>© ${new Date().getFullYear()} TerraKnots. All rights reserved.</p>
          <p><a href="https://instagram.com/terra_knots" style="color: white;">@terra_knots</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getAdminOrderNotificationEmail = (order) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #2C2C2C; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #8B7355; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #F5F0EB; padding: 30px; }
        .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Order Received!</h1>
          <p>Order ID: ${order.orderId}</p>
        </div>
        <div class="content">
          <h2>Hello Admin,</h2>
          <p>A new order was just placed by <strong>${order.guestInfo?.name || order.shippingAddress.fullName}</strong>.</p>
          <p>Please prepare to make and pack this order!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Customer Email:</strong> ${order.guestInfo?.email || 'Registered User'}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
          </div>
          
          <h3>Items Ordered:</h3>
          ${order.items.map(item => `
            <div class="order-item">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}</p>
            </div>
          `).join('')}
          
          <h3>Shipping Details:</h3>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <p>${order.shippingAddress.fullName}</p>
            <p>${order.shippingAddress.addressLine1}, ${order.shippingAddress.addressLine2 || ''}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
            <p>Phone: ${order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getPasswordResetEmail = (resetUrl, name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #2C2C2C; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #C4A882; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #F5F0EB; padding: 30px; }
        .footer { background: #8B7355; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .button { background: #C4A882; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          
          <center>
            <a href="${resetUrl}" class="button">Reset Password</a>
          </center>
          
          <p style="margin-top: 20px;">This link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          
          <p style="font-size: 12px; color: #6B6B6B; margin-top: 20px;">
            Or copy and paste this URL into your browser:<br>
            ${resetUrl}
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TerraKnots. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getWelcomeEmail = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #2C2C2C; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #C4A882; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #F5F0EB; padding: 30px; }
        .footer { background: #8B7355; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .button { background: #C4A882; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Welcome to TerraKnots!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for joining the TerraKnots family! 💛</p>
          <p>Every product you see is handmade with love, patience, and attention to detail. We believe in slow-made, unique crafts that bring warmth to your life.</p>
          
          <p>Explore our collection of:</p>
          <ul>
            <li>🧶 Crochet keychains and pouches</li>
            <li>🦋 Resin art pieces and accessories</li>
            <li>🎨 Clay jewelry</li>
            <li>🏡 Home decor items</li>
          </ul>
          
          <center>
            <a href="${process.env.FRONTEND_URL}/shop" class="button">Start Shopping</a>
          </center>
          
          <p style="margin-top: 20px;">Follow us on Instagram <a href="https://instagram.com/terra_knots" style="color: #C4A882;">@terra_knots</a> for behind-the-scenes and new releases!</p>
        </div>
        <div class="footer">
          <p>Handmade with heart, knot by knot 💛</p>
          <p>© ${new Date().getFullYear()} TerraKnots. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
    sendEmail,
    getOrderConfirmationEmail,
    getAdminOrderNotificationEmail,
    getPasswordResetEmail,
    getWelcomeEmail,
};

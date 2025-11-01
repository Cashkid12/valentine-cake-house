import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  // For development without real email credentials
  if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
    console.log('📧 Email service: Running in development mode without real email credentials');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendNewOrderEmail = async (order) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 [DEV] New Order Email would be sent for order:', order._id);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🎂 New Order Received - #${order._id.toString().slice(-6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a855f7;">🎂 New Cake Order!</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-6)}</p>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Location:</strong> ${order.deliveryLocation}</p>
            <p><strong>Total Amount:</strong> KSh ${order.totalAmount?.toLocaleString()}</p>
            <p><strong>Items:</strong> ${order.items.length} item(s)</p>
            ${order.message ? `<p><strong>Customer Message:</strong> ${order.message}</p>` : ''}
          </div>
          <p style="margin-top: 20px;">
            <a href="${process.env.ADMIN_URL || 'http://localhost:5173'}/admin/orders" 
               style="background: #a855f7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               View Order in Dashboard
            </a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 New order email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

export const sendCustomRequestEmail = async (request) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 [DEV] Custom Request Email would be sent for:', request.customerName);
      return;
    }

    // Build reference images section if they exist
    const imagesSection = request.referenceImages && request.referenceImages.length > 0 
      ? `
        <p><strong>Reference Images:</strong> ${request.referenceImages.length} image(s) uploaded</p>
        <div style="margin-top: 10px;">
          ${request.referenceImages.map(img => 
            `<a href="${img}" target="_blank" style="margin-right: 10px;">
              <img src="${img}" alt="Reference" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px; border: 1px solid #ddd;">
            </a>`
          ).join('')}
        </div>
      `
      : '<p><strong>Reference Images:</strong> No images provided</p>';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `🎨 New Custom Cake Request - ${request.occasion}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ec4899;">🎨 New Custom Cake Request!</h2>
          <div style="background: #fdf2f8; padding: 20px; border-radius: 10px;">
            <h3>Request Details:</h3>
            <p><strong>Customer:</strong> ${request.customerName}</p>
            <p><strong>Phone:</strong> ${request.phone}</p>
            <p><strong>Email:</strong> ${request.email || 'Not provided'}</p>
            <p><strong>Occasion:</strong> ${request.occasion}</p>
            <p><strong>Cake Size:</strong> ${request.cakeSize}</p>
            <p><strong>Flavor:</strong> ${request.flavor}</p>
            <p><strong>Icing:</strong> ${request.icing}</p>
            <p><strong>Color Scheme:</strong> ${request.color || 'Not specified'}</p>
            <p><strong>Budget:</strong> ${request.budget ? `KSh ${request.budget}` : 'Not specified'}</p>
            <p><strong>Delivery Date:</strong> ${request.deliveryDate ? new Date(request.deliveryDate).toLocaleDateString() : 'Not specified'}</p>
            ${imagesSection}
            <p><strong>Design Description:</strong></p>
            <p style="background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #ec4899;">${request.designDescription}</p>
            ${request.message ? `<p><strong>Cake Message:</strong> "${request.message}"</p>` : ''}
            ${request.specialInstructions ? `<p><strong>Special Instructions:</strong> ${request.specialInstructions}</p>` : ''}
          </div>
          <p style="margin-top: 20px;">
            <a href="${process.env.ADMIN_URL || 'http://localhost:5173'}/admin/custom" 
               style="background: #ec4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               View Request in Dashboard
            </a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Custom request email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

export const sendOrderStatusUpdate = async (order, customerEmail) => {
  if (!customerEmail) return;
  
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 [DEV] Order status update email would be sent to:', customerEmail);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `📦 Order Update - #${order._id.toString().slice(-6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a855f7;">Order Status Update</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
            <p>Your order <strong>#${order._id.toString().slice(-6)}</strong> status has been updated to:</p>
            <h3 style="color: #a855f7; text-transform: capitalize;">${order.status}</h3>
            <p>We'll keep you updated on your order progress.</p>
          </div>
          <p style="margin-top: 20px;">
            Thank you for choosing Valentine Cake House! 🎂
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Order status update email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

// Export all functions
export default {
  sendNewOrderEmail,
  sendCustomRequestEmail,
  sendOrderStatusUpdate
};
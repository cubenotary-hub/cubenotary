const nodemailer = require('nodemailer');
const { getDatabase } = require('../database/init');

// Create email transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email configuration missing. Email notifications will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Log email to database
const logEmail = async (booking_id, email_type, recipient_email, subject, status, error_message = null) => {
  try {
    const db = getDatabase();
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO email_logs (booking_id, email_type, recipient_email, subject, status, error_message)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [booking_id, email_type, recipient_email, subject, status, error_message],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  } catch (error) {
    console.error('Failed to log email:', error);
  }
};

// Send booking confirmation email
const sendBookingConfirmation = async (bookingData) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('📧 Email service not configured - skipping confirmation email');
    return;
  }

  const {
    booking_id,
    customer_name,
    customer_email,
    service_type,
    appointment_date,
    appointment_time,
    meeting_address,
    service_fee,
    notes
  } = bookingData;

  const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
  const formattedDate = appointmentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = appointmentDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const subject = `Booking Confirmation - ${booking_id} | Cube Notary`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - Cube Notary</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; }
            .header { background: #000; color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 900; }
            .content { padding: 30px; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { font-weight: 600; color: #555; }
            .detail-value { color: #333; }
            .highlight { background: #e7f3ff; padding: 15px; border-radius: 8px; border-left: 4px solid #38bdf8; margin: 20px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #38bdf8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
            .contact-info { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📋 BOOKING CONFIRMED</h1>
                <p>Cube Notary - Professional Notary Services</p>
            </div>
            
            <div class="content">
                <h2>Hello ${customer_name}!</h2>
                <p>Thank you for choosing Cube Notary. Your appointment has been successfully booked.</p>
                
                <div class="highlight">
                    <h3>📅 Appointment Details</h3>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${formattedTime}</p>
                    <p><strong>Service:</strong> ${service_type}</p>
                </div>
                
                <div class="booking-details">
                    <h3>Booking Information</h3>
                    <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">${booking_id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Service Type:</span>
                        <span class="detail-value">${service_type}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Appointment Date:</span>
                        <span class="detail-value">${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Appointment Time:</span>
                        <span class="detail-value">${formattedTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Meeting Address:</span>
                        <span class="detail-value">${meeting_address}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Service Fee:</span>
                        <span class="detail-value">$${service_fee.toFixed(2)}</span>
                    </div>
                    ${notes ? `
                    <div class="detail-row">
                        <span class="detail-label">Notes:</span>
                        <span class="detail-value">${notes}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="contact-info">
                    <h3>📞 Need to Make Changes?</h3>
                    <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible:</p>
                    <p><strong>Phone:</strong> <a href="tel:+13124683477">(312) 468-3477</a></p>
                    <p><strong>Text:</strong> <a href="sms:+13124683477">(312) 468-3477</a></p>
                </div>
                
                <h3>What to Bring:</h3>
                <ul>
                    <li>Valid government-issued photo ID</li>
                    <li>Original documents to be notarized</li>
                    <li>Any required witnesses (if applicable)</li>
                    <li>Payment method (cash, check, or card)</li>
                </ul>
                
                <h3>Important Reminders:</h3>
                <ul>
                    <li>Please arrive on time for your appointment</li>
                    <li>Do not sign documents before meeting with the notary</li>
                    <li>All signers must be present with valid ID</li>
                    <li>We accept cash, check, and card payments</li>
                </ul>
            </div>
            
            <div class="footer">
                <p><strong>Cube Notary</strong> - Professional 24/7 Notary Services</p>
                <p>📞 (312) 468-3477 | 📧 info@cubenotary.com</p>
                <p>Serving all of Illinois with mobile and online notary services</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const textContent = `
    BOOKING CONFIRMED - Cube Notary
    
    Hello ${customer_name}!
    
    Your appointment has been successfully booked.
    
    BOOKING DETAILS:
    - Booking ID: ${booking_id}
    - Service: ${service_type}
    - Date: ${formattedDate}
    - Time: ${formattedTime}
    - Address: ${meeting_address}
    - Fee: $${service_fee.toFixed(2)}
    ${notes ? `- Notes: ${notes}` : ''}
    
    CONTACT US:
    Phone: (312) 468-3477
    Text: (312) 468-3477
    
    WHAT TO BRING:
    - Valid government-issued photo ID
    - Original documents to be notarized
    - Any required witnesses (if applicable)
    - Payment method (cash, check, or card)
    
    IMPORTANT REMINDERS:
    - Please arrive on time for your appointment
    - Do not sign documents before meeting with the notary
    - All signers must be present with valid ID
    - We accept cash, check, and card payments
    
    Cube Notary - Professional 24/7 Notary Services
    Serving all of Illinois with mobile and online notary services
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Cube Notary <noreply@cubenotary.com>',
      to: customer_email,
      subject: subject,
      text: textContent,
      html: htmlContent
    });

    await logEmail(booking_id, 'confirmation', customer_email, subject, 'sent');
    console.log(`📧 Confirmation email sent to ${customer_email} for booking ${booking_id}`);
    
    return info;
  } catch (error) {
    await logEmail(booking_id, 'confirmation', customer_email, subject, 'failed', error.message);
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
};

// Send payment confirmation email
const sendPaymentConfirmation = async (bookingData, paymentData) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('📧 Email service not configured - skipping payment confirmation email');
    return;
  }

  const {
    booking_id,
    customer_name,
    customer_email,
    service_type,
    appointment_date,
    appointment_time,
    service_fee
  } = bookingData;

  const subject = `Payment Confirmed - ${booking_id} | Cube Notary`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmed - Cube Notary</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; }
            .header { background: #28a745; color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 900; }
            .content { padding: 30px; }
            .payment-details { background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💳 PAYMENT CONFIRMED</h1>
                <p>Cube Notary - Professional Notary Services</p>
            </div>
            
            <div class="content">
                <h2>Hello ${customer_name}!</h2>
                <p>Your payment has been successfully processed. Your appointment is now confirmed.</p>
                
                <div class="payment-details">
                    <h3>Payment Details</h3>
                    <p><strong>Amount Paid:</strong> $${service_fee.toFixed(2)}</p>
                    <p><strong>Payment Method:</strong> Credit/Debit Card</p>
                    <p><strong>Transaction ID:</strong> ${paymentData.payment_intent_id}</p>
                    <p><strong>Status:</strong> Confirmed</p>
                </div>
                
                <h3>Your Appointment:</h3>
                <p><strong>Service:</strong> ${service_type}</p>
                <p><strong>Date:</strong> ${appointment_date}</p>
                <p><strong>Time:</strong> ${appointment_time}</p>
                <p><strong>Booking ID:</strong> ${booking_id}</p>
                
                <p>We look forward to serving you!</p>
            </div>
            
            <div class="footer">
                <p><strong>Cube Notary</strong> - Professional 24/7 Notary Services</p>
                <p>📞 (312) 468-3477 | 📧 info@cubenotary.com</p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Cube Notary <noreply@cubenotary.com>',
      to: customer_email,
      subject: subject,
      html: htmlContent
    });

    await logEmail(booking_id, 'payment_confirmation', customer_email, subject, 'sent');
    console.log(`📧 Payment confirmation email sent to ${customer_email} for booking ${booking_id}`);
    
    return info;
  } catch (error) {
    await logEmail(booking_id, 'payment_confirmation', customer_email, subject, 'failed', error.message);
    console.error('Failed to send payment confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendPaymentConfirmation,
  logEmail
};

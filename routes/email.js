const express = require('express');
const Joi = require('joi');
const { getDatabase } = require('../database/init');
const { sendBookingConfirmation, sendPaymentConfirmation } = require('../services/emailService');

const router = express.Router();

// Validation schema for email requests
const emailSchema = Joi.object({
  booking_id: Joi.string().required(),
  email_type: Joi.string().valid('confirmation', 'reminder', 'cancellation').required(),
  recipient_email: Joi.string().email().optional()
});

// Send booking confirmation email
router.post('/send-confirmation', async (req, res) => {
  try {
    const { booking_id, recipient_email } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const db = getDatabase();
    
    // Get booking details
    const booking = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM bookings WHERE booking_id = ?',
        [booking_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Use provided email or booking email
    const emailToUse = recipient_email || booking.customer_email;

    const bookingData = {
      booking_id: booking.booking_id,
      customer_name: booking.customer_name,
      customer_email: emailToUse,
      service_type: booking.service_type,
      appointment_date: booking.appointment_date,
      appointment_time: booking.appointment_time,
      meeting_address: booking.meeting_address,
      service_fee: booking.amount_paid,
      notes: booking.notes
    };

    await sendBookingConfirmation(bookingData);

    res.json({
      success: true,
      message: 'Confirmation email sent successfully',
      recipient: emailToUse
    });

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// Send payment confirmation email
router.post('/send-payment-confirmation', async (req, res) => {
  try {
    const { booking_id, payment_intent_id } = req.body;

    if (!booking_id || !payment_intent_id) {
      return res.status(400).json({ error: 'Booking ID and Payment Intent ID are required' });
    }

    const db = getDatabase();
    
    // Get booking details
    const booking = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM bookings WHERE booking_id = ?',
        [booking_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const paymentData = {
      payment_intent_id: payment_intent_id,
      amount: booking.amount_paid
    };

    await sendPaymentConfirmation(booking, paymentData);

    res.json({
      success: true,
      message: 'Payment confirmation email sent successfully',
      recipient: booking.customer_email
    });

  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    res.status(500).json({ error: 'Failed to send payment confirmation email' });
  }
});

// Get email logs for a booking
router.get('/logs/:booking_id', async (req, res) => {
  try {
    const { booking_id } = req.params;

    const db = getDatabase();
    const emailLogs = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM email_logs WHERE booking_id = ? ORDER BY sent_at DESC',
        [booking_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json({ email_logs: emailLogs });

  } catch (error) {
    console.error('Error fetching email logs:', error);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

// Get all email logs (admin endpoint)
router.get('/logs', async (req, res) => {
  try {
    const { limit = 50, offset = 0, status, email_type } = req.query;

    let query = 'SELECT * FROM email_logs WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (email_type) {
      query += ' AND email_type = ?';
      params.push(email_type);
    }

    query += ' ORDER BY sent_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const db = getDatabase();
    const emailLogs = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({ email_logs: emailLogs });

  } catch (error) {
    console.error('Error fetching email logs:', error);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

// Test email configuration
router.post('/test', async (req, res) => {
  try {
    const { test_email } = req.body;

    if (!test_email) {
      return res.status(400).json({ error: 'Test email address is required' });
    }

    // Test email configuration by sending a simple test email
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const testEmail = {
      from: process.env.EMAIL_FROM || 'Cube Notary <noreply@cubenotary.com>',
      to: test_email,
      subject: 'Test Email - Cube Notary Email Configuration',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify that the Cube Notary email configuration is working correctly.</p>
        <p>If you received this email, the email service is properly configured.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `,
      text: `
        Test Email - Cube Notary Email Configuration
        
        This is a test email to verify that the Cube Notary email configuration is working correctly.
        
        If you received this email, the email service is properly configured.
        
        Timestamp: ${new Date().toISOString()}
      `
    };

    const info = await transporter.sendMail(testEmail);

    res.json({
      success: true,
      message: 'Test email sent successfully',
      message_id: info.messageId,
      recipient: test_email
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      details: error.message
    });
  }
});

// Get email configuration status
router.get('/config/status', (req, res) => {
  const config = {
    email_host: process.env.EMAIL_HOST ? 'Configured' : 'Not configured',
    email_user: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
    email_pass: process.env.EMAIL_PASS ? 'Configured' : 'Not configured',
    email_from: process.env.EMAIL_FROM || 'Not configured'
  };

  const isConfigured = process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS;

  res.json({
    configured: isConfigured,
    config: config,
    status: isConfigured ? 'Ready' : 'Needs configuration'
  });
});

module.exports = router;

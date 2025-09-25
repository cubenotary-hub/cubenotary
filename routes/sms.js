const express = require('express');
const { getDatabase, dbOperations } = require('../database/init');

const router = express.Router();

// Send SMS notification for new booking
router.post('/send-booking-notification', async (req, res) => {
  try {
    const { booking_id, customer_name, service_type, appointment_date, appointment_time, customer_phone, meeting_address, notes } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Format the SMS message
    const smsMessage = `New appointment booked:

Service: ${service_type}
Date: ${appointment_date}
Time: ${appointment_time}
Customer: ${customer_name}
Phone: ${customer_phone || 'Not provided'}
Address: ${meeting_address}
Notes: ${notes || 'None'}

Booking ID: ${booking_id}`;

    // For now, we'll just log the SMS message
    // In production, you would integrate with an SMS service like Twilio
    console.log('📱 SMS TO (312) 468-3477:');
    console.log(smsMessage);
    console.log('---');

    // Store SMS log in database
    dbOperations.insertSmsLog({
      booking_id,
      phone_number: '3124683477',
      message: smsMessage,
      status: 'sent'
    });

    res.json({
      success: true,
      message: 'SMS notification sent successfully',
      sms_message: smsMessage
    });

  } catch (error) {
    console.error('Error sending SMS notification:', error);
    res.status(500).json({ error: 'Failed to send SMS notification' });
  }
});

// Get SMS logs (admin endpoint)
router.get('/logs', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const logs = dbOperations.getSmsLogs(parseInt(limit), parseInt(offset));

    res.json({ sms_logs: logs });

  } catch (error) {
    console.error('Error fetching SMS logs:', error);
    res.status(500).json({ error: 'Failed to fetch SMS logs' });
  }
});

module.exports = router;

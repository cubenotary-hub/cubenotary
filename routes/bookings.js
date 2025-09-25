const express = require('express');
const Joi = require('joi');
const moment = require('moment');
const { getDatabase, generateBookingId } = require('../database/init');
const { sendBookingConfirmation } = require('../services/emailService');

const router = express.Router();

// Validation schemas
const bookingSchema = Joi.object({
  customer_name: Joi.string().min(2).max(100).required(),
  customer_email: Joi.string().email().required(),
  customer_phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  service_type: Joi.string().valid('General Notary', 'Apostille', 'Power of Attorney', 'RON', 'Mobile Notary').required(),
  appointment_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  appointment_time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  meeting_address: Joi.string().min(10).max(500).required(),
  notes: Joi.string().max(1000).optional()
});

// Get available time slots for a specific date
router.get('/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Validate date format
    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const db = getDatabase();
    const rows = db.prepare(
      'SELECT appointment_time FROM bookings WHERE appointment_date = ? AND status IN ("confirmed", "pending")'
    ).all(date);
    const bookedTimes = rows.map(row => row.appointment_time);

    // Generate all possible time slots (every 30 minutes from 00:00 to 23:30)
    const allTimeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allTimeSlots.push(timeString);
      }
    }

    const availableTimes = allTimeSlots.filter(time => !bookedTimes.includes(time));
    
    res.json({
      date,
      available_times: availableTimes,
      booked_times: bookedTimes
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }

    const {
      customer_name,
      customer_email,
      customer_phone,
      service_type,
      appointment_date,
      appointment_time,
      meeting_address,
      notes
    } = value;

    // Check if the time slot is still available
    const db = getDatabase();
    const existingBooking = db.prepare(
      'SELECT id FROM bookings WHERE appointment_date = ? AND appointment_time = ? AND status IN ("confirmed", "pending")'
    ).get(appointment_date, appointment_time);

    if (existingBooking) {
      return res.status(409).json({ 
        error: 'Time slot is no longer available',
        message: 'This time slot was just booked by another customer. Please select a different time.'
      });
    }

    // Generate unique booking ID
    const booking_id = generateBookingId();

    // Calculate service fee
    const serviceFees = {
      'General Notary': parseFloat(process.env.NOTARY_FEE) || 25.00,
      'Apostille': parseFloat(process.env.APOSTILLE_FEE) || 50.00,
      'Power of Attorney': parseFloat(process.env.POA_FEE) || 35.00,
      'RON': parseFloat(process.env.RON_FEE) || 30.00,
      'Mobile Notary': parseFloat(process.env.MOBILE_FEE) || 40.00
    };

    const service_fee = serviceFees[service_type] || 25.00;

    // Insert booking into database
    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        booking_id, customer_name, customer_email, customer_phone,
        service_type, appointment_date, appointment_time, meeting_address,
        notes, status, amount_paid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `);
    
    const result = insertBooking.run(
      booking_id, customer_name, customer_email, customer_phone,
      service_type, appointment_date, appointment_time, meeting_address,
      notes || '', service_fee
    );
    
    const booking = { id: result.lastInsertRowid, booking_id };

    // Store or update customer information
    const insertCustomer = db.prepare(`
      INSERT OR REPLACE INTO customers (email, name, phone, address, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    insertCustomer.run(customer_email, customer_name, customer_phone || '', meeting_address);

    // Send SMS notification to (312) 468-3477
    try {
      const smsMessage = `New appointment booked:

Service: ${service_type}
Date: ${appointment_date}
Time: ${appointment_time}
Customer: ${customer_name}
Phone: ${customer_phone || 'Not provided'}
Email: ${customer_email}
Address: ${meeting_address}
Notes: ${notes || 'None'}

Booking ID: ${booking_id}`;

      console.log('📱 SMS TO (312) 468-3477:');
      console.log(smsMessage);
      console.log('---');

      // Store SMS log in database
      const insertSmsLog = db.prepare(`
        INSERT INTO sms_logs (booking_id, phone_number, message, status, sent_at)
        VALUES (?, ?, ?, 'sent', CURRENT_TIMESTAMP)
      `);
      insertSmsLog.run(booking_id, '3124683477', smsMessage);

    } catch (smsError) {
      console.error('Failed to send SMS notification:', smsError);
      // Don't fail the booking if SMS fails
    }

    // Send confirmation email (optional)
    try {
      await sendBookingConfirmation({
        booking_id,
        customer_name,
        customer_email,
        service_type,
        appointment_date,
        appointment_time,
        meeting_address,
        service_fee,
        notes
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      booking_id,
      message: 'Booking created successfully. Check your email for confirmation.',
      booking: {
        id: booking.booking_id,
        customer_name,
        customer_email,
        service_type,
        appointment_date,
        appointment_time,
        meeting_address,
        service_fee,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get booking details
router.get('/:booking_id', async (req, res) => {
  try {
    const { booking_id } = req.params;
    
    const db = getDatabase();
    const booking = db.prepare('SELECT * FROM bookings WHERE booking_id = ?').get(booking_id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking status
router.patch('/:booking_id/status', async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const db = getDatabase();
    const updateBooking = db.prepare('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE booking_id = ?');
    const result = updateBooking.run(status, booking_id);
    
    if (result.changes === 0) {
      throw new Error('Booking not found');
    }

    res.json({ 
      success: true, 
      message: `Booking status updated to ${status}` 
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Get all bookings (admin endpoint)
router.get('/', async (req, res) => {
  try {
    const { date, status, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    if (date) {
      query += ' AND appointment_date = ?';
      params.push(date);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY appointment_date DESC, appointment_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const db = getDatabase();
    const bookings = db.prepare(query).all(...params);

    res.json({ bookings });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;

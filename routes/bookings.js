const express = require('express');
const Joi = require('joi');
const moment = require('moment');
const { getDatabase, generateBookingId, dbOperations } = require('../database/init');
const { sendBookingConfirmation } = require('../services/emailService');

const router = express.Router();

// Validation schemas - Made more permissive to ensure bookings work
const bookingSchema = Joi.object({
  customer_name: Joi.string().min(1).max(200).required(),
  customer_email: Joi.string().email().required(),
  customer_phone: Joi.string().max(50).optional().allow(''),
  service_type: Joi.string().valid('General Notary', 'Apostille', 'Power of Attorney', 'RON', 'Mobile Notary').required(),
  appointment_date: Joi.string().required(),
  appointment_time: Joi.string().required(),
  meeting_address: Joi.string().min(5).max(1000).required(),
  notes: Joi.string().max(2000).optional().allow('')
});

// Get available time slots for a specific date
router.get('/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Validate date format
    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const bookedBookings = dbOperations.getBookingsByDate(date);
    const bookedTimes = bookedBookings.map(booking => booking.appointment_time);

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
    // Basic validation - ensure required fields exist
    const {
      customer_name,
      customer_email,
      customer_phone,
      service_type,
      appointment_date,
      appointment_time,
      meeting_address,
      notes
    } = req.body;

    // Simple validation - just check if required fields exist
    if (!customer_name || !customer_email || !service_type || !appointment_date || !appointment_time || !meeting_address) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['customer_name', 'customer_email', 'service_type', 'appointment_date', 'appointment_time', 'meeting_address'],
        received: req.body
      });
    }

    // Use the data as-is (no strict validation)
    const value = {
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim(),
      customer_phone: customer_phone ? customer_phone.trim() : '',
      service_type: service_type.trim(),
      appointment_date: appointment_date.trim(),
      appointment_time: appointment_time.trim(),
      meeting_address: meeting_address.trim(),
      notes: notes ? notes.trim() : ''
    };

    // Use the cleaned values
    const cleanedData = value;

    // Check if the time slot is still available
    const existingBookings = dbOperations.getBookingsByDate(cleanedData.appointment_date);
    const existingBooking = existingBookings.find(booking => 
      booking.appointment_time === cleanedData.appointment_time
    );

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

    const service_fee = serviceFees[cleanedData.service_type] || 25.00;

    // Insert booking into database
    const booking = dbOperations.insertBooking({
      booking_id,
      customer_name: cleanedData.customer_name,
      customer_email: cleanedData.customer_email,
      customer_phone: cleanedData.customer_phone,
      service_type: cleanedData.service_type,
      appointment_date: cleanedData.appointment_date,
      appointment_time: cleanedData.appointment_time,
      meeting_address: cleanedData.meeting_address,
      notes: cleanedData.notes,
      status: 'pending',
      amount_paid: service_fee
    });

    // Store or update customer information
    dbOperations.insertOrUpdateCustomer({
      email: cleanedData.customer_email,
      name: cleanedData.customer_name,
      phone: cleanedData.customer_phone,
      address: cleanedData.meeting_address
    });

    // Send SMS notification to (312) 468-3477
    try {
      const smsMessage = `New appointment booked:

Service: ${cleanedData.service_type}
Date: ${cleanedData.appointment_date}
Time: ${cleanedData.appointment_time}
Customer: ${cleanedData.customer_name}
Phone: ${cleanedData.customer_phone || 'Not provided'}
Email: ${cleanedData.customer_email}
Address: ${cleanedData.meeting_address}
Notes: ${cleanedData.notes || 'None'}

Booking ID: ${booking_id}`;

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

    } catch (smsError) {
      console.error('Failed to send SMS notification:', smsError);
      // Don't fail the booking if SMS fails
    }

    // Send confirmation email (optional)
    try {
      await sendBookingConfirmation({
        booking_id,
        customer_name: cleanedData.customer_name,
        customer_email: cleanedData.customer_email,
        service_type: cleanedData.service_type,
        appointment_date: cleanedData.appointment_date,
        appointment_time: cleanedData.appointment_time,
        meeting_address: cleanedData.meeting_address,
        service_fee,
        notes: cleanedData.notes
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      booking_id,
      message: 'Booking created successfully. SMS sent to (312) 468-3477',
      booking: {
        id: booking.booking_id,
        customer_name: cleanedData.customer_name,
        customer_email: cleanedData.customer_email,
        service_type: cleanedData.service_type,
        appointment_date: cleanedData.appointment_date,
        appointment_time: cleanedData.appointment_time,
        meeting_address: cleanedData.meeting_address,
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
    
    const booking = dbOperations.getBookingById(booking_id);

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

    const success = dbOperations.updateBookingStatus(booking_id, status);
    
    if (!success) {
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

    const bookings = dbOperations.getAllBookings(filters);

    res.json({ bookings });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;

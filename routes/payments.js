const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Joi = require('joi');
const { getDatabase } = require('../database/init');
const { sendPaymentConfirmation } = require('../services/emailService');

const router = express.Router();

// Validation schema for payment
const paymentSchema = Joi.object({
  booking_id: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('usd'),
  customer_email: Joi.string().email().required(),
  customer_name: Joi.string().required()
});

// Create payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }

    const { booking_id, amount, currency, customer_email, customer_name } = value;

    // Verify booking exists and is pending payment
    const db = getDatabase();
    const booking = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM bookings WHERE booking_id = ? AND status = "pending"',
        [booking_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found or already processed',
        message: 'This booking may have already been paid for or does not exist.'
      });
    }

    // Verify amount matches booking amount
    if (Math.abs(amount - booking.amount_paid) > 0.01) {
      return res.status(400).json({ 
        error: 'Amount mismatch',
        message: `Expected amount: $${booking.amount_paid.toFixed(2)}, received: $${amount.toFixed(2)}`
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        booking_id: booking_id,
        customer_email: customer_email,
        customer_name: customer_name,
        service_type: booking.service_type
      },
      receipt_email: customer_email,
      description: `Cube Notary - ${booking.service_type} - ${booking_id}`
    });

    // Store payment intent in database
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO payments (booking_id, stripe_payment_intent_id, amount, currency, status, customer_email)
         VALUES (?, ?, ?, ?, 'pending', ?)`,
        [booking_id, paymentIntent.id, amount, currency, customer_email],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Update booking with payment intent ID
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE bookings SET payment_intent_id = ? WHERE booking_id = ?',
        [paymentIntent.id, booking_id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: amount,
      currency: currency
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment (webhook handler)
router.post('/confirm', async (req, res) => {
  try {
    const { payment_intent_id } = req.body;

    if (!payment_intent_id) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        error: 'Payment not successful',
        status: paymentIntent.status 
      });
    }

    const db = getDatabase();
    
    // Get booking details
    const booking = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM bookings WHERE payment_intent_id = ?',
        [payment_intent_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found for this payment' });
    }

    // Update payment status
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE payments SET status = "succeeded" WHERE stripe_payment_intent_id = ?',
        [payment_intent_id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Update booking status to confirmed
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE bookings SET status = "confirmed", payment_status = "paid", updated_at = CURRENT_TIMESTAMP WHERE booking_id = ?',
        [booking.booking_id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Send payment confirmation email
    try {
      await sendPaymentConfirmation(booking, {
        payment_intent_id: payment_intent_id,
        amount: paymentIntent.amount / 100
      });
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError);
      // Don't fail the payment confirmation if email fails
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      booking_id: booking.booking_id,
      status: 'confirmed'
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      
      try {
        const db = getDatabase();
        
        // Update payment status
        await new Promise((resolve, reject) => {
          db.run(
            'UPDATE payments SET status = "succeeded" WHERE stripe_payment_intent_id = ?',
            [paymentIntent.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        // Update booking status
        await new Promise((resolve, reject) => {
          db.run(
            'UPDATE bookings SET status = "confirmed", payment_status = "paid", updated_at = CURRENT_TIMESTAMP WHERE payment_intent_id = ?',
            [paymentIntent.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        // Get booking details for email
        const booking = await new Promise((resolve, reject) => {
          db.get(
            'SELECT * FROM bookings WHERE payment_intent_id = ?',
            [paymentIntent.id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row);
            }
          );
        });

        if (booking) {
          try {
            await sendPaymentConfirmation(booking, {
              payment_intent_id: paymentIntent.id,
              amount: paymentIntent.amount / 100
            });
          } catch (emailError) {
            console.error('Failed to send payment confirmation email:', emailError);
          }
        }

      } catch (error) {
        console.error('Error processing payment_intent.succeeded:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      
      try {
        const db = getDatabase();
        
        // Update payment status
        await new Promise((resolve, reject) => {
          db.run(
            'UPDATE payments SET status = "failed" WHERE stripe_payment_intent_id = ?',
            [failedPayment.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        // Update booking status
        await new Promise((resolve, reject) => {
          db.run(
            'UPDATE bookings SET status = "payment_failed", updated_at = CURRENT_TIMESTAMP WHERE payment_intent_id = ?',
            [failedPayment.id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

      } catch (error) {
        console.error('Error processing payment_intent.payment_failed:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Get payment status
router.get('/status/:payment_intent_id', async (req, res) => {
  try {
    const { payment_intent_id } = req.params;

    const db = getDatabase();
    const payment = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM payments WHERE stripe_payment_intent_id = ?',
        [payment_intent_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      payment_intent_id: payment.stripe_payment_intent_id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      created_at: payment.created_at
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

// Refund payment (admin endpoint)
router.post('/refund', async (req, res) => {
  try {
    const { payment_intent_id, reason } = req.body;

    if (!payment_intent_id) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment_intent_id,
      reason: reason || 'requested_by_customer'
    });

    const db = getDatabase();
    
    // Update payment status
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE payments SET status = "refunded" WHERE stripe_payment_intent_id = ?',
        [payment_intent_id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Update booking status
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE bookings SET status = "cancelled", payment_status = "refunded", updated_at = CURRENT_TIMESTAMP WHERE payment_intent_id = ?',
        [payment_intent_id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      success: true,
      refund_id: refund.id,
      status: refund.status,
      amount: refund.amount / 100
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

module.exports = router;

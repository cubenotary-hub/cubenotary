# Cube Notary - Full Stack Setup Guide

This guide will help you set up the complete Cube Notary booking system with email confirmations, backend integration, and payment processing.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Email account (Gmail recommended)
- Stripe account for payments

### 1. Environment Setup

1. **Copy environment file:**
   ```bash
   cp env.example .env
   ```

2. **Configure your environment variables in `.env`:**
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database
   DATABASE_URL=./database.sqlite

   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=Cube Notary <noreply@cubenotary.com>

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key

   # Business Information
   BUSINESS_NAME=Cube Notary
   BUSINESS_PHONE=(312) 468-3477
   BUSINESS_EMAIL=info@cubenotary.com
   BUSINESS_ADDRESS=Chicago, IL

   # Service Pricing
   NOTARY_FEE=25.00
   APOSTILLE_FEE=50.00
   POA_FEE=35.00
   RON_FEE=30.00
   MOBILE_FEE=40.00
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📧 Email Configuration

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASS`

3. **Update your `.env` file:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### Other Email Providers

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

## 💳 Stripe Payment Setup

### 1. Create Stripe Account
- Sign up at [stripe.com](https://stripe.com)
- Complete account verification

### 2. Get API Keys
- Go to Stripe Dashboard → Developers → API keys
- Copy your **Publishable key** and **Secret key**
- Update your `.env` file:
  ```env
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```

### 3. Update Frontend
- Open `index.html`
- Find line 392 and update:
  ```javascript
  const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_key_here';
  ```

### 4. Set Up Webhooks (Optional)
- In Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://yourdomain.com/api/payments/webhook`
- Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## 🗄️ Database

The application uses SQLite for simplicity. The database will be automatically created when you first start the server.

**Database file:** `database.sqlite`

**Tables created:**
- `bookings` - Customer appointments
- `customers` - Customer information
- `payments` - Payment records
- `email_logs` - Email delivery logs

## 🌐 Deployment Options

### Option 1: Render.com (Recommended)

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure build settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Add environment variables in Render dashboard**
5. **Deploy!**

### Option 2: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set STRIPE_SECRET_KEY=sk_live_...
   # ... add all other variables
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Create new app in DigitalOcean**
2. **Connect GitHub repository**
3. **Configure environment variables**
4. **Deploy**

### Option 4: Docker

1. **Build Docker image:**
   ```bash
   docker build -t cubenotary .
   ```

2. **Run container:**
   ```bash
   docker run -p 3000:3000 --env-file .env cubenotary
   ```

## 🔧 API Endpoints

### Bookings
- `GET /api/bookings/availability/:date` - Get available time slots
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:booking_id` - Get booking details
- `PATCH /api/bookings/:booking_id/status` - Update booking status

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/status/:payment_intent_id` - Get payment status

### Email
- `POST /api/email/send-confirmation` - Send booking confirmation
- `POST /api/email/send-payment-confirmation` - Send payment confirmation
- `GET /api/email/logs/:booking_id` - Get email logs
- `POST /api/email/test` - Test email configuration

### Health
- `GET /api/health` - Health check endpoint

## 🧪 Testing

### Test Email Configuration
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"test_email": "your-email@example.com"}'
```

### Test Booking Creation
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "service_type": "General Notary",
    "appointment_date": "2024-12-20",
    "appointment_time": "10:00",
    "meeting_address": "123 Main St, Chicago, IL"
  }'
```

## 🔒 Security Considerations

### Production Checklist
- [ ] Use HTTPS in production
- [ ] Set strong JWT secret
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set up proper CORS origins
- [ ] Use Stripe live keys for production
- [ ] Set up proper email authentication
- [ ] Regular database backups
- [ ] Monitor logs and errors

### Environment Variables Security
- Never commit `.env` files to version control
- Use different secrets for development and production
- Rotate secrets regularly
- Use strong, unique passwords

## 📊 Monitoring & Logs

### Application Logs
- Check console output for errors
- Monitor email delivery logs in database
- Track payment success/failure rates

### Database Queries
```sql
-- View all bookings
SELECT * FROM bookings ORDER BY created_at DESC;

-- View payment status
SELECT b.booking_id, b.customer_name, p.status, p.amount 
FROM bookings b 
LEFT JOIN payments p ON b.payment_intent_id = p.stripe_payment_intent_id;

-- View email logs
SELECT * FROM email_logs ORDER BY sent_at DESC;
```

## 🆘 Troubleshooting

### Common Issues

**1. Email not sending:**
- Check email credentials
- Verify app password (Gmail)
- Check firewall/network restrictions
- Test with `/api/email/test` endpoint

**2. Stripe payments failing:**
- Verify API keys are correct
- Check webhook endpoint configuration
- Ensure HTTPS in production
- Test with Stripe test cards

**3. Database errors:**
- Check file permissions on `database.sqlite`
- Ensure sufficient disk space
- Verify database schema is created

**4. CORS errors:**
- Update CORS origins in `server.js`
- Check frontend API URL configuration
- Verify domain configuration

### Getting Help

1. Check the logs for error messages
2. Test individual API endpoints
3. Verify environment variables
4. Check network connectivity
5. Review Stripe/email provider documentation

## 🎉 Success!

Once everything is set up, you'll have:

✅ **Full booking system** with real-time availability  
✅ **Email confirmations** for all bookings  
✅ **Secure payment processing** with Stripe  
✅ **Professional admin interface** for managing bookings  
✅ **Mobile-responsive design**  
✅ **SEO optimized** for search engines  

Your Cube Notary website is now a complete, professional booking platform!

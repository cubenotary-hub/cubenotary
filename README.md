# Cube Notary - Professional Notary Services

Professional notary public website for 24-hour mobile and online notary services throughout Illinois with complete booking system, payment processing, and email confirmations.

## 🚀 Features

### Core Functionality
- **Interactive Booking Calendar** - Real-time appointment scheduling with availability checking
- **Secure Payment Processing** - Stripe integration for credit card payments
- **Email Confirmations** - Automated booking and payment confirmation emails
- **Admin Dashboard** - Complete booking management interface
- **Database Integration** - SQLite database for persistent data storage

### User Experience
- **Mobile Responsive Design** - Works perfectly on all devices
- **Contact Integration** - Direct call/text functionality
- **SEO Optimized** - Structured data and meta tags
- **Modern UI** - Clean, professional dark theme
- **Professional Logo** - Brand identity with notary stamp design

### Business Features
- **Service Pricing** - Transparent pricing for all services
- **Booking Management** - Complete CRUD operations for appointments
- **Payment Tracking** - Real-time payment status monitoring
- **Email Logging** - Track all email communications
- **Export Functionality** - CSV export for reporting

## 📋 Services

- **General Notary Services** - $25.00
- **Apostille Services** - $50.00
- **Power of Attorney Notarization** - $35.00
- **Remote Online Notary (RON)** - $30.00
- **Mobile Notary Services** - $40.00

## 🛠️ Technology Stack

### Frontend
- HTML5 with semantic markup
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Stripe.js for payment processing
- SVG Graphics for logo and icons

### Backend
- Node.js with Express.js
- SQLite database
- Nodemailer for email services
- Stripe API for payments
- Joi for validation
- Helmet for security

### Deployment
- Docker containerization
- Environment-based configuration
- Health checks and monitoring
- SSL/HTTPS support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Email account (Gmail recommended)
- Stripe account for payments

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cubenotary-site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your credentials
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Main website: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin.html`

### Environment Configuration

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=./database.sqlite

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Cube Notary <noreply@cubenotary.com>

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Business Information
BUSINESS_NAME=Cube Notary
BUSINESS_PHONE=(312) 468-3477
BUSINESS_EMAIL=info@cubenotary.com
```

## 🌐 Deployment Options

### Option 1: Render.com (Recommended)

1. **Connect GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure build settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Add environment variables in Render dashboard**
5. **Deploy!**

### Option 2: Heroku

```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set EMAIL_USER=your-email@gmail.com
# ... add all other environment variables
git push heroku main
```

### Option 3: Docker

```bash
# Build and run with Docker
docker build -t cubenotary .
docker run -p 3000:3000 --env-file .env cubenotary
```

## 📊 API Endpoints

### Bookings
- `GET /api/bookings/availability/:date` - Get available time slots
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:booking_id` - Get booking details
- `PATCH /api/bookings/:booking_id/status` - Update booking status

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook handler

### Email
- `POST /api/email/send-confirmation` - Send booking confirmation
- `POST /api/email/test` - Test email configuration

## 🔧 Admin Dashboard

Access the admin dashboard at `/admin.html` to:
- View and manage all bookings
- Track revenue and statistics
- Send confirmation emails
- Export booking data
- Monitor email delivery logs

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use app password in `EMAIL_PASS`

### Email Templates
- Professional HTML booking confirmations
- Payment confirmation emails
- Responsive design for all devices

## 💳 Payment Processing

### Stripe Integration
- Secure credit card processing
- PCI compliant payment forms
- Real-time payment confirmations
- Automatic refund capabilities

### Supported Payment Methods
- Credit cards (Visa, MasterCard, American Express)
- Debit cards
- Digital wallets (Apple Pay, Google Pay)

## 🔒 Security Features

- HTTPS enforcement
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection
- CORS configuration
- Environment variable security

## 📱 Mobile Features

- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile-optimized forms
- Fast loading times
- Offline capability (basic)

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

## 📞 Contact

- **Phone**: (312) 468-3477
- **Text**: (312) 468-3477
- **Email**: info@cubenotary.com
- **Service Area**: Illinois
- **Hours**: 24/7
- **Website**: https://www.cubenotary.com

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [API Documentation](API_DOCS.md) - Complete API reference
- [Deployment Guide](DEPLOYMENT.md) - Production deployment guide

---

**Cube Notary** - Professional 24/7 Notary Services throughout Illinois 

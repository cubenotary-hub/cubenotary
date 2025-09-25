# 🚀 Cube Notary Deployment Guide

This guide will help you deploy the Cube Notary full-stack application to production.

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] Git configured with your credentials
- [ ] Email account (Gmail recommended)
- [ ] Stripe account for payments
- [ ] Domain name (optional)

### 2. Required Credentials
- [ ] Gmail App Password (for email)
- [ ] Stripe API Keys (test and live)
- [ ] JWT Secret (generate a secure random string)

## 🚀 Quick Deployment

### Option 1: Automated Deployment Script

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script will guide you through:
1. Environment checks
2. Dependency installation
3. Configuration validation
4. Application testing
5. Deployment to your chosen platform

### Option 2: Manual Deployment

## 🌐 Deployment Platforms

### Render.com (Recommended)

**Pros:**
- Easy setup with render.yaml
- Automatic SSL certificates
- Built-in database persistence
- Free tier available

**Steps:**
1. **Connect GitHub repository to Render**
2. **Create new Web Service**
3. **Configure settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`
4. **Add environment variables:**
   ```env
   NODE_ENV=production
   PORT=10000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   JWT_SECRET=your-secure-secret
   ```
5. **Deploy!**

**URL:** `https://cubenotary-backend.onrender.com`

### Heroku

**Pros:**
- Mature platform
- Good documentation
- Easy scaling

**Steps:**
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create cubenotary

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_...
heroku config:set JWT_SECRET=your-secure-secret

# Deploy
git push heroku main
```

**URL:** `https://cubenotary.herokuapp.com`

### DigitalOcean App Platform

**Pros:**
- Competitive pricing
- Good performance
- Easy scaling

**Steps:**
1. **Create new app in DigitalOcean**
2. **Connect GitHub repository**
3. **Configure build settings:**
   - Build Command: `npm install`
   - Run Command: `npm start`
4. **Add environment variables**
5. **Deploy**

### VPS/Cloud Server

**Pros:**
- Full control
- Cost-effective for high traffic
- Custom configurations

**Steps:**
```bash
# On your server
git clone <your-repo>
cd cubenotary-site
npm install
cp env.example .env
# Edit .env with your credentials

# Install PM2 for process management
npm install -g pm2

# Start the application
pm2 start server.js --name cubenotary
pm2 startup
pm2 save
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=./database.sqlite

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Cube Notary <noreply@cubenotary.com>

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security
JWT_SECRET=your-super-secure-random-string

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

### Gmail Setup for Production

1. **Enable 2-Factor Authentication**
2. **Generate App Password:**
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### Stripe Setup for Production

1. **Switch to Live Mode** in Stripe Dashboard
2. **Get Live API Keys:**
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`
3. **Set up Webhooks:**
   - Endpoint: `https://yourdomain.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. **Update frontend** with live publishable key

## 🔒 Security Checklist

### Production Security
- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong JWT secret
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set proper CORS origins
- [ ] Use Stripe live keys
- [ ] Regular security updates
- [ ] Database backups

### Domain Configuration
- [ ] Point domain to your deployment
- [ ] Configure SSL certificate
- [ ] Set up DNS records
- [ ] Test all functionality

## 📊 Post-Deployment Testing

### 1. Health Check
```bash
curl https://yourdomain.com/api/health
```

### 2. Test Booking Flow
1. Visit your website
2. Try to book an appointment
3. Test payment processing
4. Check email confirmations

### 3. Test Admin Dashboard
1. Visit `/admin.html`
2. Check booking management
3. Test email sending
4. Verify statistics

### 4. Test API Endpoints
```bash
# Test booking creation
curl -X POST https://yourdomain.com/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "service_type": "General Notary",
    "appointment_date": "2024-12-25",
    "appointment_time": "10:00",
    "meeting_address": "123 Test St, Chicago, IL"
  }'

# Test email configuration
curl -X POST https://yourdomain.com/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"test_email": "your-email@example.com"}'
```

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Restart the application
# For PM2: pm2 restart cubenotary
# For Heroku: git push heroku main
# For Render: Automatic on git push
```

### Database Backups
```bash
# Backup SQLite database
cp database.sqlite database-backup-$(date +%Y%m%d).sqlite

# For production, set up automated backups
```

### Monitoring
- Monitor application logs
- Check email delivery rates
- Monitor payment success rates
- Track website performance

## 🆘 Troubleshooting

### Common Issues

**1. Application won't start:**
- Check environment variables
- Verify Node.js version
- Check port availability
- Review error logs

**2. Email not sending:**
- Verify Gmail credentials
- Check app password
- Test email configuration endpoint
- Check firewall settings

**3. Payments failing:**
- Verify Stripe keys
- Check webhook configuration
- Ensure HTTPS is enabled
- Test with Stripe test cards

**4. Database errors:**
- Check file permissions
- Verify disk space
- Check database file integrity

### Getting Help
1. Check application logs
2. Test individual components
3. Verify environment configuration
4. Check platform-specific documentation

## 📈 Performance Optimization

### Production Optimizations
- Enable gzip compression
- Set up CDN for static assets
- Optimize database queries
- Implement caching
- Monitor performance metrics

### Scaling Considerations
- Database optimization
- Load balancing
- Caching strategies
- Monitoring and alerting

## 🎉 Success!

Once deployed, your Cube Notary website will have:
- ✅ Professional booking system
- ✅ Secure payment processing
- ✅ Automated email confirmations
- ✅ Admin management interface
- ✅ Mobile-responsive design
- ✅ SEO optimization
- ✅ Production-ready security

Your notary business is now ready to serve customers 24/7!

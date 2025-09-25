# 🚀 Cube Notary - Deployment Guide

## 📋 **Current Status**
✅ **Code Updated**: Modern calendar system implemented  
✅ **Backend Restored**: Full booking system with payments  
✅ **GitHub Ready**: All changes committed  
✅ **Render Config**: Deployment configuration updated  

## 🎯 **Deploy to Render.com**

### **Step 1: Push to GitHub**
```bash
# If you haven't already pushed the latest changes:
git push origin main
```

### **Step 2: Deploy on Render**

1. **Go to [Render.com](https://render.com)** and sign in
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**:
   - Select your `cubenotary-site` repository
   - Choose the `main` branch

4. **Configure the service**:
   - **Name**: `cubenotary-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`

5. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=./database.sqlite
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=Cube Notary <noreply@cubenotary.com>
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   JWT_SECRET=your-secret-key
   BUSINESS_NAME=Cube Notary
   BUSINESS_PHONE=(312) 468-3477
   BUSINESS_EMAIL=info@cubenotary.com
   BUSINESS_ADDRESS=Chicago, IL
   NOTARY_FEE=25.00
   APOSTILLE_FEE=50.00
   POA_FEE=35.00
   RON_FEE=30.00
   MOBILE_FEE=40.00
   ```

6. **Click "Create Web Service"**

### **Step 3: Configure Custom Domain (Optional)**
1. In your Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain: `www.cubenotary.com`
4. Follow the DNS configuration instructions

## 🔧 **Environment Variables Setup**

### **Required for Production:**
- **EMAIL_USER**: Your Gmail address
- **EMAIL_PASS**: Gmail App Password (not regular password)
- **STRIPE_SECRET_KEY**: Your live Stripe secret key
- **STRIPE_PUBLISHABLE_KEY**: Your live Stripe publishable key
- **JWT_SECRET**: A random secret string

### **Gmail Setup:**
1. Enable 2-factor authentication on Gmail
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### **Stripe Setup:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your live API keys from "Developers" → "API keys"
3. Set up webhooks for payment confirmations

## 📱 **Features Deployed**

### **✅ What's Working:**
- **Modern Calendar**: Dynamic calendar with month navigation
- **Smart Date Validation**: Past dates automatically disabled
- **Booking System**: Complete appointment booking
- **Payment Processing**: Stripe integration
- **Email Confirmations**: Automated booking emails
- **Admin Dashboard**: Booking management
- **Mobile Responsive**: Works on all devices
- **Database**: SQLite for data persistence

### **🎯 Test Your Deployment:**
1. **Main Site**: `https://your-app.onrender.com`
2. **Admin Dashboard**: `https://your-app.onrender.com/admin.html`
3. **API Health**: `https://your-app.onrender.com/api/health`
4. **Calendar Test**: Click any future date to book

## 🚨 **Troubleshooting**

### **If deployment fails:**
1. Check the build logs in Render dashboard
2. Ensure all environment variables are set
3. Verify `package.json` has correct start script
4. Check that `server.js` is the main file

### **If calendar doesn't work:**
1. Check browser console for JavaScript errors
2. Verify the site is loading the full HTML (not just API)
3. Ensure all static files are being served

### **If payments don't work:**
1. Verify Stripe keys are correct
2. Check Stripe webhook configuration
3. Ensure HTTPS is enabled (required for Stripe)

## 📞 **Support**

If you need help with deployment:
1. Check Render's documentation
2. Review the build logs
3. Test locally first with `npm run dev`

## 🎉 **Success!**

Once deployed, your Cube Notary site will have:
- ✅ Professional booking system
- ✅ Modern calendar interface
- ✅ Payment processing
- ✅ Email confirmations
- ✅ Admin management
- ✅ Mobile responsive design

**Your notary business is now fully online!** 🚀

# 🔄 Update Render Deployment - Replace Static Version

## 🚨 **Current Problem**

**Live Site**: [https://cubenotary-website.onrender.com/](https://cubenotary-website.onrender.com/)
- ❌ **Static HTML** - Old version with hardcoded calendar
- ❌ **No backend** - No API functionality
- ❌ **Basic booking** - No modern features

**Perfect Local Version**: `http://localhost:3000`
- ✅ **Modern Calendar** - Dynamic with month navigation
- ✅ **Full Backend** - Node.js/Express with database
- ✅ **Payment Processing** - Stripe integration
- ✅ **Email System** - Automated confirmations
- ✅ **Admin Dashboard** - Complete management

## 🎯 **Solution: Update Render Deployment**

### **Option 1: Update Existing Render Service**

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Find your existing service**: `cubenotary-website`
3. **Click on the service** to open settings
4. **Go to "Settings" tab**
5. **Update the following**:

#### **Build & Deploy Settings:**
```
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

#### **Environment Variables:**
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

6. **Click "Save Changes"**
7. **Go to "Deploys" tab**
8. **Click "Manual Deploy" → "Deploy latest commit"**

### **Option 2: Create New Render Service**

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect GitHub**: `cubenotary-hub/cubenotary`
4. **Configure**:
   ```
   Name: cubenotary-backend-v2
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Health Check Path: /api/health
   ```
5. **Set Environment Variables** (same as above)
6. **Click "Create Web Service"**
7. **Update domain** to point to new service

## 🧪 **Test the Update**

### **After Deployment, Test These URLs:**
- **Main Site**: `https://cubenotary-website.onrender.com/`
- **API Health**: `https://cubenotary-website.onrender.com/api/health`
- **Admin Dashboard**: `https://cubenotary-website.onrender.com/admin.html`

### **Expected Results:**
- ✅ **Modern Calendar** - Month navigation with ← → buttons
- ✅ **Clickable Dates** - All future dates open booking modal
- ✅ **Service Selection** - Dropdown with pricing
- ✅ **Time Booking** - 30-minute time slots
- ✅ **Payment Processing** - Stripe integration
- ✅ **Email Confirmations** - Automated emails
- ✅ **Admin Dashboard** - Complete booking management

## 🔧 **Environment Variables Setup**

### **Gmail Configuration:**
1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Google Account → Security → 2-Step Verification
   - App passwords → Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### **Stripe Configuration:**
1. **Get Live API Keys** from [Stripe Dashboard](https://dashboard.stripe.com)
2. **Set up Webhooks** for payment confirmations
3. **Use Live Keys** (not test keys) for production

## 🎉 **Success Criteria**

Your deployment is successful when:
- ✅ **Calendar shows month navigation** (← September 2025 →)
- ✅ **Dates are clickable** and open booking modal
- ✅ **API health check** returns: `{"status":"OK"}`
- ✅ **Complete booking flow** works end-to-end
- ✅ **Payments process** through Stripe
- ✅ **Emails are sent** automatically
- ✅ **Admin dashboard** shows all bookings

## 🚨 **Troubleshooting**

### **If deployment fails:**
1. **Check Render build logs** for errors
2. **Verify all environment variables** are set correctly
3. **Ensure `package.json`** has correct scripts
4. **Check that `server.js`** is the main file

### **If calendar doesn't work:**
1. **Check browser console** for JavaScript errors
2. **Verify static files** are being served correctly
3. **Ensure all CSS and JS** files load properly

### **If payments don't work:**
1. **Verify Stripe keys** are correct and live
2. **Check Stripe webhook** configuration
3. **Ensure HTTPS** is enabled (required for Stripe)

## 🎯 **Ready to Update!**

Your perfect local version is ready to replace the old static site on Render!

**Follow the steps above to update your Render deployment and get the modern, full-stack application live!**

**Your notary business will have a complete, professional booking system!** 🚀

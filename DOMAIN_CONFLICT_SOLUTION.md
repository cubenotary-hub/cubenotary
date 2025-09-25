# 🔧 Domain Conflict Solution

## 🚨 **Problem Identified**

**Error**: "This domain already exists on another site. Please delete it from that site and try again."

**Cause**: The domain `cubenotary.com` is already connected to the existing Render service `cubenotary-website`.

## 🎯 **Solution Options**

### **Option 1: Update Existing Service (Recommended)**

Since the domain is already connected to `cubenotary-website`, let's update that service instead of creating a new one.

#### **Steps:**
1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Find existing service**: `cubenotary-website`
3. **Click on the service** to open it
4. **Go to "Settings" tab**
5. **Update the configuration**:

```
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

6. **Add Environment Variables**:
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

7. **Save Changes**
8. **Go to "Deploys" tab**
9. **Click "Manual Deploy" → "Deploy latest commit"**

### **Option 2: Create New Service with Different Name**

If you prefer to create a new service:

1. **Create new Web Service** with name: `cubenotary-backend-v2`
2. **Don't add custom domain yet**
3. **Deploy and test** the new service
4. **Once working, remove domain from old service**:
   - Go to old service → Settings → Custom Domains
   - Remove `cubenotary.com`
5. **Add domain to new service**:
   - Go to new service → Settings → Custom Domains
   - Add `cubenotary.com`

### **Option 3: Delete Old Service First**

If you want to start fresh:

1. **Go to old service**: `cubenotary-website`
2. **Settings** → **Delete Service**
3. **Confirm deletion**
4. **Create new service** with your perfect version
5. **Add domain**: `cubenotary.com`

## 🎯 **Recommended Approach: Option 1**

**Update the existing `cubenotary-website` service** because:
- ✅ **Domain already connected** - No conflicts
- ✅ **Faster deployment** - Just update configuration
- ✅ **No downtime** - Seamless transition
- ✅ **Keep existing URL** - `cubenotary-website.onrender.com`

## 🧪 **Test After Update**

### **Expected Results:**
- ✅ **Modern Calendar** - Month navigation (← September 2025 →)
- ✅ **Clickable Dates** - All future dates open booking modal
- ✅ **API Health** - `/api/health` returns `{"status":"OK"}`
- ✅ **Complete Booking** - Full functionality with payments
- ✅ **Admin Dashboard** - `/admin.html` shows management interface

### **Test URLs:**
- **Main Site**: `https://cubenotary-website.onrender.com/`
- **API Health**: `https://cubenotary-website.onrender.com/api/health`
- **Admin Dashboard**: `https://cubenotary-website.onrender.com/admin.html`

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

## 🎯 **Ready to Update!**

**Go to [Render Dashboard](https://dashboard.render.com) and update your existing `cubenotary-website` service!**

**Your perfect local version will replace the old static site!** 🚀

# 🚀 **UPDATE RENDER SERVICE NOW**

## 🎯 **Current Situation**
- **Live Site**: [https://cubenotary-website.onrender.com/](https://cubenotary-website.onrender.com/) - OLD static version
- **Perfect Version**: `http://localhost:3000/` - NEW full-stack with modern calendar
- **Goal**: Replace old static site with your perfect local version

## ⚡ **Quick Update Steps**

### **1. Go to Render Dashboard**
👉 **[https://dashboard.render.com](https://dashboard.render.com)**

### **2. Find Your Service**
- Look for: `cubenotary-website` (existing service)
- Click on it to open settings

### **3. Update Service Configuration**

#### **Build & Deploy Settings:**
```
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

#### **Environment Variables (Add These):**
```
NODE_ENV=production
PORT=3000
DATABASE_URL=./database.sqlite
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=cubenotary@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Cube Notary <cubenotary@gmail.com>
JWT_SECRET=your-secret-key
BUSINESS_NAME=Cube Notary
BUSINESS_PHONE=(312) 468-3477
BUSINESS_EMAIL=cubenotary@gmail.com
BUSINESS_ADDRESS=Chicago, IL
```

### **4. Save & Deploy**
- Click **"Save Changes"**
- Click **"Manual Deploy"** → **"Deploy latest commit"**

## 🎯 **Expected Results After Update**

### **✅ What You'll See:**
- **Modern Calendar** with month navigation (← September 2025 →)
- **Clickable dates** that open booking modal
- **Service selection** dropdown
- **Time booking** with 30-minute slots
- **Email confirmations** to cubenotary@gmail.com
- **Admin dashboard** at `/admin.html`
- **API health** at `/api/health`

### **❌ What Will Be Gone:**
- Old static calendar (1-31 grid)
- Basic booking form
- No backend functionality

## 📧 **Email Setup Required**

### **Before Deployment:**
1. **Enable 2FA** on cubenotary@gmail.com
2. **Generate App Password**:
   - Google Account → Security → 2-Step Verification
   - App passwords → Generate password for "Mail"
   - Use this password in `EMAIL_PASS` environment variable

## 🚨 **Important Notes**

- **Domain**: cubenotary.com will automatically point to updated service
- **No New Service**: We're updating the existing `cubenotary-website` service
- **Database**: SQLite will be created automatically on first run
- **Port**: Render will use PORT=3000 internally

## 🎯 **Ready to Update!**

**Go to [Render Dashboard](https://dashboard.render.com) and update your existing `cubenotary-website` service with the configuration above!**

Your perfect local version will replace the old static site! 🚀

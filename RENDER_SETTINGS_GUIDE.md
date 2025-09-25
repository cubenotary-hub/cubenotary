# 🔧 **Render Settings Guide - Where to Find Configuration**

## 🎯 **Finding Your Service Settings**

### **Step 1: Locate Your Service**
1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Look for **"cubenotary-website"** in your services list
3. Click on the service name (not the URL)

### **Step 2: Find Settings Tab**
Once you're in your service, look for these tabs at the top:
- **Overview** (default view)
- **Logs** 
- **Settings** ← **CLICK THIS ONE**
- **Environment** (might be under Settings)

### **Step 3: Alternative Locations**
If you don't see "Settings", try these:

#### **Option A: Environment Tab**
- Look for **"Environment"** tab
- This is where environment variables are set

#### **Option B: Deploy Tab**
- Look for **"Deploy"** or **"Deployments"** tab
- Build settings might be here

#### **Option C: Service Settings**
- Look for a **gear icon** ⚙️ or **"Configure"** button
- Sometimes settings are in a dropdown menu

## 🔍 **What You're Looking For**

### **Build & Deploy Settings:**
```
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

### **Environment Variables Section:**
Look for a section where you can add key-value pairs:
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

## 🚨 **If You Still Can't Find Settings**

### **Try These Steps:**
1. **Refresh the page** - sometimes the interface loads differently
2. **Check if you're in the right service** - make sure it's "cubenotary-website"
3. **Look for a "Edit" or "Configure" button** on the service overview page
4. **Try the mobile view** - sometimes the layout is different

### **Alternative: Create New Service**
If you can't find the settings, we can create a new service:
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository
4. Use the configuration above

## 📱 **Screenshot Guide**
Look for these elements in your Render dashboard:
- Service name: **cubenotary-website**
- Tabs: **Overview | Logs | Settings | Environment**
- Buttons: **Edit | Configure | Deploy**

## 🎯 **Next Steps**
Once you find the settings:
1. Update the build and start commands
2. Add the environment variables
3. Save changes
4. Trigger a manual deploy

**Let me know what you see in your Render dashboard and I'll guide you to the right location!** 🚀

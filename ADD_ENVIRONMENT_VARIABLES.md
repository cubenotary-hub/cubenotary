# 🔧 **Add Environment Variables to Render**

## 🎯 **What You Need to Add**

Since you already have your secret files, you just need to add these environment variables to your Render service:

### **Required Environment Variables:**

```
NODE_ENV=production
PORT=3000
DATABASE_URL=./database.sqlite
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=cubenotary@gmail.com
EMAIL_PASS=your-existing-app-password
EMAIL_FROM=Cube Notary <cubenotary@gmail.com>
JWT_SECRET=your-existing-jwt-secret
BUSINESS_NAME=Cube Notary
BUSINESS_PHONE=(312) 468-3477
BUSINESS_EMAIL=cubenotary@gmail.com
BUSINESS_ADDRESS=Chicago, IL
```

## 🔍 **How to Add Variables in Render**

### **Step 1: Find Environment Section**
1. Go to your `cubenotary-website` service in Render
2. Look for **"Environment"** tab or section
3. Or look for **"Environment Variables"** section

### **Step 2: Add Each Variable**
For each variable above:
1. Click **"Add Environment Variable"** or **"+"** button
2. Enter the **Key** (left side)
3. Enter the **Value** (right side)
4. Click **"Save"** or **"Add"**

### **Step 3: Use Your Existing Secrets**
- **EMAIL_PASS**: Use your existing Gmail app password
- **JWT_SECRET**: Use your existing JWT secret key
- **Other values**: Use the exact values shown above

## 📋 **Variable by Variable Guide**

### **Basic Configuration:**
```
NODE_ENV = production
PORT = 3000
DATABASE_URL = ./database.sqlite
```

### **Email Configuration:**
```
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = cubenotary@gmail.com
EMAIL_PASS = [your existing Gmail app password]
EMAIL_FROM = Cube Notary <cubenotary@gmail.com>
```

### **Security:**
```
JWT_SECRET = [your existing JWT secret]
```

### **Business Information:**
```
BUSINESS_NAME = Cube Notary
BUSINESS_PHONE = (312) 468-3477
BUSINESS_EMAIL = cubenotary@gmail.com
BUSINESS_ADDRESS = Chicago, IL
```

## 🚨 **Important Notes**

- **Don't change** your existing secret values
- **Use exactly** the values shown above for the new variables
- **Save each variable** before adding the next one
- **Deploy** after adding all variables

## 🎯 **After Adding Variables**

1. **Save all changes**
2. **Trigger a manual deploy**
3. **Test the site** - it should now have the modern calendar and booking system

## 📱 **Alternative: Copy-Paste Method**

If you can't find the Environment section, try:
1. Look for **"Settings"** tab
2. Look for **"Configure"** button
3. Look for **"Edit"** button on the service overview page

**Let me know if you need help finding the Environment Variables section!** 🚀

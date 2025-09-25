# 🔧 **Environment Variables for Render**

## 📋 **Copy and Paste This Content:**

```
NODE_ENV=production
PORT=3000
DATABASE_URL=./database.sqlite
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=cubenotary@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=Cube Notary <cubenotary@gmail.com>
JWT_SECRET=your-jwt-secret-key
BUSINESS_NAME=Cube Notary
BUSINESS_PHONE=(312) 468-3477
BUSINESS_EMAIL=cubenotary@gmail.com
BUSINESS_ADDRESS=Chicago, IL
```

## 🔑 **Important Notes:**

### **Replace These Values:**
- **EMAIL_PASS**: Replace `your-gmail-app-password` with your actual Gmail app password
- **JWT_SECRET**: Replace `your-jwt-secret-key` with your actual JWT secret

### **Keep These Values As-Is:**
- All other values should be copied exactly as shown above
- **EMAIL_USER**: `cubenotary@gmail.com`
- **EMAIL_FROM**: `Cube Notary <cubenotary@gmail.com>`
- **BUSINESS_EMAIL**: `cubenotary@gmail.com`

## 📧 **Gmail App Password Setup:**

If you need to generate a Gmail app password:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to App passwords
4. Generate password for "Mail"
5. Use that password in `EMAIL_PASS`

## 🎯 **After Pasting:**

1. **Paste the content** into the Render environment variables field
2. **Replace** the placeholder values with your actual secrets
3. **Save** the environment variables
4. **Deploy** your service

## ✅ **Expected Result:**

Your Render service will now have all the environment variables needed for:
- ✅ **Email confirmations** to cubenotary@gmail.com
- ✅ **Database** SQLite setup
- ✅ **Business information** display
- ✅ **Security** with JWT authentication
- ✅ **Production** environment configuration

**Your perfect local version will now work on Render with all features!** 🚀

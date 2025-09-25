# 🚀 Simple Deployment Guide - Cube Notary Booking System

## 📋 What This System Does

✅ **Calendar Booking System** - Clients can book appointments through the website  
✅ **SMS Notifications** - All bookings automatically send SMS to (312) 468-3477  
✅ **Real-time Availability** - Calendar shows only available time slots  
✅ **Database Storage** - All bookings saved to database  
✅ **Admin Dashboard** - View and manage all bookings  
❌ **No Payment Processing** - Simplified system  
❌ **No Email System** - SMS only  

## 🎯 Deployment Steps

### Step 1: Push to GitHub

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Add simplified booking system with SMS notifications"

# Push to GitHub
git push origin main
```

### Step 2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/static/srv-d3a2ds2li9vc739agq70)**

2. **Connect GitHub Repository**
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `cubenotary-hub/cubenotary`

3. **Configure Build Settings**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

4. **Environment Variables** (Already configured in render.yaml)
   - `NODE_ENV=production`
   - `PORT=3000`
   - `DATABASE_URL=./database.sqlite`
   - `BUSINESS_NAME=Cube Notary`
   - `BUSINESS_PHONE=(312) 468-3477`
   - `BUSINESS_EMAIL=info@cubenotary.com`
   - `BUSINESS_ADDRESS=Chicago, IL`
   - `SMS_PHONE_NUMBER=3124683477`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Step 3: Test the System

1. **Visit your deployed website**
2. **Test booking flow**:
   - Click on a date in the calendar
   - Fill out the booking form
   - Submit the booking
3. **Check SMS notification**:
   - SMS details will be copied to clipboard
   - Send to (312) 468-3477
4. **Check admin dashboard**:
   - Visit `/admin.html` to see all bookings

## 📱 How SMS Notifications Work

When a client books an appointment:

1. **Booking is saved** to the database
2. **SMS message is generated** with all booking details
3. **SMS is logged** in the database
4. **SMS details are copied** to client's clipboard
5. **Client sends SMS** to (312) 468-3477

### SMS Message Format:
```
New appointment booked:

Service: General Notary
Date: 2024-12-20
Time: 10:00
Customer: John Doe
Phone: (312) 555-1234
Email: john@example.com
Address: 123 Main St, Chicago, IL
Notes: None

Booking ID: CN-ABC123-XYZ
```

## 🔧 System Features

### Frontend Features
- ✅ Interactive calendar with month navigation
- ✅ Real-time availability checking
- ✅ Booking form with validation
- ✅ Mobile responsive design
- ✅ Professional UI/UX

### Backend Features
- ✅ RESTful API endpoints
- ✅ SQLite database with proper schema
- ✅ SMS notification system
- ✅ Admin dashboard
- ✅ Health check endpoint

### API Endpoints
- `GET /api/bookings/availability/:date` - Get available time slots
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/health` - Health check

## 📊 Admin Dashboard

Access at `/admin.html` to:
- View all bookings
- Filter by date, status, customer
- Export booking data
- Monitor system status

## 🚨 Troubleshooting

### Common Issues

1. **Calendar not showing available dates**
   - Check if backend is running
   - Verify API endpoints are accessible

2. **SMS not being sent**
   - Check server logs for SMS messages
   - Verify SMS logs in database

3. **Booking not saving**
   - Check database connection
   - Verify API endpoint responses

### Health Check
Visit `/api/health` to check system status:
```json
{
  "status": "OK",
  "timestamp": "2024-12-20T10:00:00.000Z",
  "environment": "production"
}
```

## 🎯 Next Steps After Deployment

1. **Test complete booking flow**
2. **Verify SMS notifications work**
3. **Check admin dashboard functionality**
4. **Monitor system performance**
5. **Set up custom domain** (www.cubenotary.com)

## 📞 Support

If you need help with deployment:
- Check Render logs for errors
- Verify environment variables
- Test API endpoints manually
- Check database connectivity

---

**Your booking system is now ready for production!** 🎉

# Cube Notary - Professional Notary Services

Professional notary public website for 24-hour mobile and online notary services throughout Illinois with modern booking system.

## 🚀 Features

### Core Functionality
- **Modern Interactive Calendar** - Dynamic calendar with month navigation and clickable dates
- **Complete Booking System** - Service selection, time slots, and appointment scheduling
- **Admin Dashboard** - Complete booking management interface
- **Database Integration** - SQLite database for persistent data storage

### User Experience
- **Mobile Responsive Design** - Works perfectly on all devices
- **Contact Integration** - Direct call/text functionality
- **SEO Optimized** - Structured data and meta tags
- **Modern UI** - Clean, professional dark theme
- **Professional Logo** - Brand identity with notary stamp design

### Business Features
- **Service Selection** - Multiple notary service types available
- **Booking Management** - Complete CRUD operations for appointments
- **Admin Interface** - Easy booking management and tracking
- **Export Functionality** - CSV export for reporting

## 📋 Services

- **General Notary Services** - Available
- **Apostille Services** - Available
- **Power of Attorney Notarization** - Available
- **Remote Online Notary (RON)** - Available
- **Mobile Notary Services** - Available

## 🛠️ Technology Stack

### Frontend
- HTML5 with semantic markup
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Modern Calendar System with month navigation
- SVG Graphics for logo and icons

### Backend
- Node.js with Express.js
- SQLite database
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

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Main website: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin.html`

### Environment Configuration

The application works out of the box with default settings. For production deployment, you can optionally create a `.env` file:

```env
# Server Configuration
NODE_ENV=production
PORT=3000
DATABASE_URL=./database.sqlite

# Business Information
BUSINESS_NAME=Cube Notary
BUSINESS_PHONE=(312) 468-3477
BUSINESS_EMAIL=cubenotary@gmail.com
BUSINESS_ADDRESS=Chicago, IL
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

### Deploy Hook (Automatic Deployment)

For automatic deployments when you push to the main branch, you can use Render's deploy hook:

```bash
# Trigger deployment manually
curl -X POST https://api.render.com/deploy/srv-<your-service-id>?key=<your-deploy-key>

# Or use the webhook URL from your Render dashboard
curl -X POST <your-render-deploy-webhook-url>
```

**To set up automatic deployment:**
1. Go to your Render service dashboard
2. Navigate to "Settings" → "Deploy Hook"
3. Copy the deploy hook URL
4. Add it to your GitHub repository webhooks (Settings → Webhooks)
5. Every push to main branch will trigger automatic deployment

**Manual deployment trigger:**
```bash
# Create a deployment trigger file
echo "Deploy $(date)" > deployment-trigger.txt
git add deployment-trigger.txt
git commit -m "Trigger deployment"
git push origin main
```

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

### Health Check
- `GET /api/health` - Server health status

## 🔧 Admin Dashboard

Access the admin dashboard at `/admin.html` to:
- View and manage all bookings
- Track booking statistics
- Export booking data
- Monitor system status

## 📞 Contact Integration

### Direct Communication
- Phone and text integration for booking confirmations
- Direct contact functionality
- Professional communication channels

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

### Test Health Check
```bash
curl http://localhost:3000/api/health
```

### Test Booking Creation
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_phone": "(312) 555-1234",
    "service_type": "General Notary",
    "appointment_date": "2024-12-20",
    "appointment_time": "10:00",
    "notes": "Test booking"
  }'
```

## 📞 Contact

- **Phone**: (312) 468-3477
- **Text**: (312) 468-3477
- **Email**: cubenotary@gmail.com
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

- [Deployment Ready](DEPLOYMENT_READY.md) - Complete deployment status
- [Update Render Now](UPDATE_RENDER_NOW.md) - Step-by-step Render deployment guide

---

**Cube Notary** - Professional 24/7 Notary Services throughout Illinois 

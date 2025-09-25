# 🚀 Render Update Guide - Deploy Modern Calendar Version

## 🎯 **Problem Identified**
- **Live Site**: [https://www.cubenotary.com/](https://www.cubenotary.com/) - Still showing old static calendar
- **Local Version**: `http://localhost:3000` - Perfect modern calendar with month navigation
- **Issue**: Render is serving old static files instead of your new full-stack application

## 🔧 **Solution: Update Render Service Configuration**

### Step 1: Access Render Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your `cubenotary-website` service
3. Click on it to open the service details

### Step 2: Update Service Configuration
**Current Issue**: Render is configured as a "Static Site" but needs to be a "Web Service"

**Required Changes**:

#### A. Service Type
- **Change from**: Static Site
- **Change to**: Web Service (Node.js)

#### B. Build Command
```
npm install
```

#### C. Start Command
```
npm start
```

#### D. Environment
```
Node
```

#### E. Health Check Path
```
/api/health
```

### Step 3: Environment Variables
Add these environment variables in Render:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=./database.sqlite
BUSINESS_NAME=Cube Notary
BUSINESS_PHONE=(312) 468-3477
BUSINESS_EMAIL=cubenotary@gmail.com
BUSINESS_ADDRESS=Chicago, IL
```

### Step 4: Deploy
1. Click "Save Changes"
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete

## 🎯 **Expected Result**
After deployment, [https://www.cubenotary.com/](https://www.cubenotary.com/) should show:
- ✅ Modern calendar with month navigation
- ✅ Clickable dates
- ✅ Dynamic booking system
- ✅ Full-stack application features

## 🔍 **Verification Steps**
1. Visit [https://www.cubenotary.com/](https://www.cubenotary.com/)
2. Check if calendar has month navigation arrows
3. Verify dates are clickable
4. Test booking functionality
5. Check admin dashboard at `/admin.html`

## 🚨 **Important Notes**
- This will replace the old static site completely
- Your domain `cubenotary.com` will remain the same
- All new features will be available immediately
- The old static calendar will be gone

## 📞 **If Issues Persist**
1. Check Render deployment logs
2. Verify environment variables are set
3. Ensure all files are committed to GitHub
4. Try manual redeploy

---

**Goal**: Transform [https://www.cubenotary.com/](https://www.cubenotary.com/) from static site to your perfect local version with modern calendar!

# Cube Notary AI Booking Agent - Step-by-Step Implementation Script

## Pre-Implementation Checklist

### Required Accounts & Information
- [ ] Landbot.io account (free trial available)
- [ ] Twilio.com account (free credits available)
- [ ] Zapier.com account (free trial available)
- [ ] Cube Notary business phone: (312) 468-3477
- [ ] Website admin access for embedding

---

## PHASE 1: Foundation Setup (Week 1)

### Step 1: Landbot Setup (Day 1-2)

#### 1.1 Create Landbot Account
1. Go to [landbot.io](https://landbot.io)
2. Click "Start Free Trial"
3. Sign up with business email
4. Choose "Chat API" template

#### 1.2 Configure Basic Settings
1. **Bot Name:** "Cube Notary AI Assistant"
2. **Welcome Message:** "Hi! I'm Cube Notary's AI assistant. I can help you book your notary appointment 24/7. Let's get started!"
3. **Brand Colors:**
   - Primary: #38bdf8 (matches your website)
   - Secondary: #000000
   - Accent: #dc2626 (matches your logo)

#### 1.3 Test Basic Flow
1. Send a test message to verify bot responds
2. Note the bot's webhook URL (found in Settings > Integrations)

### Step 2: Twilio SMS Setup (Day 2-3)

#### 2.1 Create Twilio Account
1. Go to [twilio.com](https://twilio.com)
2. Sign up for free account (includes $15 free credits)
3. Verify phone number

#### 2.2 Purchase Phone Number
1. Go to Phone Numbers > Manage > Buy a number
2. Search for Illinois area code (312 or 773)
3. Purchase number (~$1/month)
4. Note the phone number for SMS notifications

#### 2.3 Get API Credentials
1. Go to Console Dashboard
2. Copy **Account SID**
3. Copy **Auth Token**
4. Note your **Twilio Phone Number**

### Step 3: Zapier Setup (Day 3-4)

#### 3.1 Create Zapier Account
1. Go to [zapier.com](https://zapier.com)
2. Sign up for free account
3. Upgrade to Professional plan ($30/month) for webhooks

#### 3.2 Create Webhook Zap
1. Click "Create Zap"
2. **Trigger:** Search "Webhooks by Zapier"
3. **Event:** "Catch Hook"
4. **Action:** Search "Twilio"
5. **Event:** "Send SMS"

#### 3.3 Configure Webhook
1. Copy the webhook URL (looks like: https://hooks.zapier.com/hooks/catch/xxx/xxx/)
2. Save this URL - you'll need it for Landbot configuration

---

## PHASE 2: Build Booking Flow (Week 2)

### Step 4: Design Landbot Conversation (Day 5-7)

#### 4.1 Create Flow Structure
```
Block 1: Welcome Message
├── Text: "Hi! I'm Cube Notary's AI assistant..."
└── Button: "Start Booking"

Block 2: Service Type
├── Text: "What type of notary service do you need?"
├── Button: "Mobile Notary" → Go to Block 3A
└── Button: "Remote Online Notary" → Go to Block 3B

Block 3A: Mobile Address (if Mobile selected)
├── Text: "Great! Where should I meet you?"
└── Text Input: "Enter meeting address"

Block 3B: Remote Confirmation (if Remote selected)
├── Text: "Perfect! Remote online notarization can be done from anywhere."
└── Set Variable: meeting_address = "Remote Online"

Block 4: Client Name
├── Text: "What's your full name?"
└── Text Input: "Enter your full name"

Block 5: Date Selection
├── Text: "What date works best for you?"
└── Date Picker: "Select date"

Block 6: Time Selection
├── Text: "What time works best? (Available 24/7)"
└── Time Picker: "Select time"

Block 7: Phone Number
├── Text: "What's your phone number?"
└── Text Input: "Enter phone number"

Block 8: Email Address
├── Text: "What's your email address?"
└── Text Input: "Enter email address"

Block 9: Confirmation
├── Text: "Please review your appointment details:"
├── Text: "Service: {{service_type}}"
├── Text: "Name: {{client_name}}"
├── Text: "Date: {{preferred_date}}"
├── Text: "Time: {{preferred_time}}"
├── Text: "Address: {{meeting_address}}"
├── Text: "Phone: {{client_phone}}"
├── Text: "Email: {{client_email}}"
├── Button: "Confirm Booking" → Go to Block 10
└── Button: "Edit Details" → Go to Block 2

Block 10: Webhook & Success
├── Webhook: Send data to Zapier
└── Text: "✅ Booking confirmed! You'll receive an SMS confirmation shortly."
```

#### 4.2 Configure Variables
Set up these variables in Landbot:
- `service_type`
- `client_name`
- `meeting_address`
- `preferred_date`
- `preferred_time`
- `client_phone`
- `client_email`

### Step 5: Configure Webhook (Day 8-9)

#### 5.1 Add Webhook Block
1. In Landbot, add "Webhook" block after confirmation
2. **URL:** Paste the Zapier webhook URL from Step 3.3
3. **Method:** POST
4. **Body Type:** JSON

#### 5.2 Configure JSON Payload
```json
{
  "service_type": "{{service_type}}",
  "client_name": "{{client_name}}",
  "meeting_address": "{{meeting_address}}",
  "preferred_date": "{{preferred_date}}",
  "preferred_time": "{{preferred_time}}",
  "client_phone": "{{client_phone}}",
  "client_email": "{{client_email}}",
  "booking_source": "AI_Chatbot",
  "timestamp": "{{current_date}}"
}
```

#### 5.3 Test Webhook
1. Complete a test booking in Landbot
2. Check Zapier for incoming webhook data
3. Verify all fields are populated correctly

---

## PHASE 3: Connect Systems (Week 3)

### Step 6: Configure Zapier Automation (Day 10-12)

#### 6.1 Complete Zapier Setup
1. **Trigger Configuration:**
   - Test the webhook with sample data
   - Verify trigger fires when Landbot sends data

2. **Action Configuration (Twilio SMS):**
   - **Account:** Connect your Twilio account
   - **From Number:** Your Twilio phone number
   - **To Number:** (312) 468-3477
   - **Message Body:**
   ```
   🚀 NEW BOOKING via AI Assistant!

   Name: {{client_name}}
   Service: {{service_type}}
   Date: {{preferred_date}}
   Time: {{preferred_time}}
   Address: {{meeting_address}}
   Phone: {{client_phone}}
   Email: {{client_email}}

   Booking ID: AI-{{timestamp}}
   Source: Chatbot
   ```

#### 6.2 Test Complete Flow
1. Turn on the Zap
2. Complete test booking in Landbot
3. Verify SMS is received at (312) 468-3477
4. Check all data is formatted correctly

### Step 7: Website Integration (Day 13-14)

#### 7.1 Get Landbot Embed Code
1. In Landbot, go to "Share" tab
2. Select "Embed on website"
3. Choose "Chat Widget"
4. Copy the embed code

#### 7.2 Add to Website
**Option A: Floating Chat Button**
```html
<!-- Add this before closing </body> tag -->
<script>
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://landbot.io/static/js/landbot-widget.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, "script", "landbot-widget"));
  
  window.addEventListener('load', function() {
    var landbot = new LandbotWidget({
      index: 'YOUR_LANDBOT_INDEX_HERE'
    });
  });
</script>
```

**Option B: Dedicated Booking Page**
Create a new page: `/ai-booking.html` with full-size chat widget

#### 7.3 Test Website Integration
1. Visit your website
2. Click the chat button
3. Complete a test booking
4. Verify SMS notification is received

---

## PHASE 4: Testing & Launch (Week 4)

### Step 8: Comprehensive Testing (Day 15-17)

#### 8.1 Test Scenarios
1. **Mobile Notary Booking:**
   - Complete full flow with address
   - Verify SMS includes meeting address
   
2. **Remote Online Booking:**
   - Complete flow without address requirement
   - Verify SMS shows "Remote Online"
   
3. **Error Handling:**
   - Test with invalid phone numbers
   - Test with invalid email addresses
   - Test with future dates only

#### 8.2 Team Testing
1. Have team members test from external devices
2. Test on mobile and desktop
3. Test during different times of day
4. Document any issues or improvements needed

### Step 9: Go Live & Monitor (Day 18-21)

#### 9.1 Launch Preparation
1. Announce new AI booking system on website
2. Update contact information to mention AI assistant
3. Prepare customer communication about new feature

#### 9.2 Monitoring Setup
1. Track SMS notifications for first week
2. Monitor booking volume and success rate
3. Collect customer feedback
4. Document any issues or improvements

#### 9.3 Success Metrics
- **Booking Volume:** Track daily/weekly bookings via AI
- **Success Rate:** Percentage of started bookings that complete
- **Customer Satisfaction:** Feedback on AI booking experience
- **Response Time:** Time from booking to SMS notification

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Issue: Webhook not firing
**Solution:** 
1. Check Zapier webhook URL is correct
2. Verify Zap is turned on
3. Test webhook with sample data

#### Issue: SMS not sending
**Solution:**
1. Verify Twilio credentials in Zapier
2. Check Twilio account balance
3. Verify phone number format

#### Issue: Chat widget not loading
**Solution:**
1. Check embed code is correct
2. Verify website allows external scripts
3. Test in different browsers

#### Issue: Data not formatting correctly
**Solution:**
1. Check Landbot variable names match Zapier
2. Verify JSON structure in webhook
3. Test with simple data first

---

## Post-Launch Optimization

### Week 2-4 After Launch
1. **Analyze Usage Patterns**
   - Peak booking times
   - Most popular services
   - Common drop-off points

2. **Optimize Conversation Flow**
   - Simplify complex questions
   - Add helpful hints
   - Improve error messages

3. **Add Advanced Features**
   - Appointment reminders
   - Rescheduling options
   - Customer feedback collection

### Month 2-3 Enhancements
1. **Calendar Integration**
   - Connect to Google Calendar
   - Real-time availability checking
   - Automatic scheduling

2. **Email Notifications**
   - Customer confirmation emails
   - Appointment reminders
   - Follow-up surveys

3. **Analytics Dashboard**
   - Booking volume tracking
   - Revenue attribution
   - Customer satisfaction metrics

---

## Support & Maintenance

### Daily Tasks
- Monitor SMS notifications
- Check for failed bookings
- Respond to customer inquiries

### Weekly Tasks
- Review booking volume
- Analyze customer feedback
- Update availability if needed

### Monthly Tasks
- Review costs and ROI
- Plan feature improvements
- Update conversation flow based on data

---

## Emergency Contacts & Resources

### Platform Support
- **Landbot:** support@landbot.io
- **Twilio:** help@twilio.com
- **Zapier:** help@zapier.com

### Documentation Links
- [Landbot Documentation](https://docs.landbot.io)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [Zapier Webhooks](https://zapier.com/help/create/events/create-webhooks-in-zaps)

### Backup Plans
- Manual booking process if AI system fails
- Direct phone/text backup for urgent bookings
- Website contact form as fallback

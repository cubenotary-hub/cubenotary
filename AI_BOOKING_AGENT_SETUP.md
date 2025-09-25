# Cube Notary AI Booking Agent - Implementation Guide

## Overview
This guide implements an AI-powered booking agent for Cube Notary using Landbot, Twilio, and Zapier to automate appointment scheduling with SMS notifications.

## Phase 1: Foundation & Setup

### Step 1: Landbot Configuration
**Platform:** [Landbot.io](https://landbot.io)
**Template:** Chat API
**Cost:** ~$30-50/month (Starter plan)

**Setup Steps:**
1. Create account at landbot.io
2. Select "Chat API" template
3. Configure welcome message: "Hi! I'm Cube Notary's AI assistant. Let's book your appointment!"
4. Set brand colors to match Cube Notary (#38bdf8 accent color)

### Step 2: Twilio SMS Setup
**Platform:** [Twilio.com](https://twilio.com)
**Cost:** ~$10-20/month (depending on volume)

**Setup Steps:**
1. Create Twilio account
2. Purchase phone number ($1-2/month)
3. Get Account SID and Auth Token from dashboard
4. Note: Cost is ~$0.0075 per SMS sent

### Step 3: Zapier Integration
**Platform:** [Zapier.com](https://zapier.com)
**Cost:** ~$30/month (Professional plan)

**Setup Steps:**
1. Create Zapier account
2. Create new "Zap" with trigger: "Webhooks by Zapier" (catch hook)
3. Set up action: "Twilio" → "Send SMS"

## Phase 2: Build the Booking Flow

### Step 4: Landbot Conversation Flow

```
1. Welcome Message
   ↓
2. Service Type Question (Buttons: "Mobile Notary" / "Remote Online")
   ↓
3. If "Mobile": Ask for Meeting Address (Text Input)
   ↓
4. Ask for Full Name (Text Input)
   ↓
5. Ask for Preferred Date (Date Picker)
   ↓
6. Ask for Preferred Time (Time Picker - 9am-5pm in 30min increments)
   ↓
7. Ask for Phone Number (Validate format)
   ↓
8. Ask for Email Address (Validate format)
   ↓
9. Confirmation Screen: "Review your appointment: [All details shown]"
   ↓
10. Final Button: "Confirm Booking"
```

### Step 5: Data Export Configuration

**Webhook JSON Structure:**
```json
{
  "service_type": "{{service_type}}",
  "client_name": "{{client_name}}", 
  "meeting_address": "{{meeting_address}}",
  "preferred_date": "{{preferred_date}}",
  "preferred_time": "{{preferred_time}}",
  "client_phone": "{{client_phone}}",
  "client_email": "{{client_email}}"
}
```

## Phase 3: Connect the Systems

### Step 6: Zapier Automation Setup

**Trigger:** Webhook (copy unique URL into Landbot)
**Action:** Twilio Send SMS
**To Number:** (312) 468-3477
**Message Template:**
```
NEW BOOKING via AI:
Name: {{client_name}}
Service: {{service_type}}
Date: {{preferred_date}} at {{preferred_time}}
Address: {{meeting_address}}
Phone: {{client_phone}}
Email: {{client_email}}
```

### Step 7: Website Integration

**Embedding Options:**
- **Option A:** Floating chat button on all pages
- **Option B:** Dedicated booking page with full-size chat

**Implementation:**
1. In Landbot, go to "Share" section
2. Copy the embed code (JavaScript widget)
3. Add to www.cubenotary.com

## Phase 4: Testing & Launch

### Step 8: Comprehensive Testing
- Test complete flow: Website → Landbot → Zapier → SMS
- Test with different service types (mobile vs remote)
- Test error handling (invalid phone numbers, etc.)
- Have team members test from external devices

### Step 9: Go Live & Monitor
- Announce new booking system on website
- Monitor SMS notifications for first week
- Track booking volume and success rate

## Cost Breakdown

| Service | Monthly Cost | Notes |
|---------|--------------|-------|
| Landbot | $30-50 | Starter plan |
| Twilio | $10-20 | Depends on SMS volume |
| Zapier | $30 | Professional plan |
| **Total** | **$70-100** | Scalable with usage |

## Implementation Timeline

- **Week 1:** Foundation & Setup (Steps 1-3)
- **Week 2:** Build Booking Flow (Steps 4-5)
- **Week 3:** Connect Systems (Steps 6-7)
- **Week 4:** Testing & Launch (Steps 8-9)

## Required Information

Before starting implementation, you need:
1. **Business phone number:** (312) 468-3477 ✓
2. **Booking hours:** 24/7 (as per website) ✓
3. **Service types:** Mobile Notary, Remote Online Notary ✓
4. **Website access:** For embedding chat widget

## Next Steps

1. **Sign up for accounts:**
   - [Landbot.io](https://landbot.io) (free trial)
   - [Twilio.com](https://twilio.com) (free credits)
   - [Zapier.com](https://zapier.com) (free trial)

2. **Provide access:**
   - WordPress admin access to cubenotary.com for embedding

3. **Begin Phase 1 implementation**

## Integration with Existing System

The AI booking agent will work alongside your existing booking system:
- **Existing:** Calendar-based booking with payment processing
- **New:** AI chat-based booking with SMS notifications
- **Combined:** Multiple booking channels for maximum conversion

## Future Enhancements (Phase 2)

- Calendar integration (Google Calendar/Calendly)
- Automated email confirmations
- Appointment reminders
- Customer feedback collection
- Analytics and reporting dashboard

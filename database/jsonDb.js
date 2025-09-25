const fs = require('fs');
const path = require('path');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '..', 'database.json');

let db = {
  bookings: [],
  customers: [],
  payments: [],
  email_logs: [],
  sms_logs: []
};

// Load database from file
function loadDatabase() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error);
    // Start with empty database
    db = {
      bookings: [],
      customers: [],
      payments: [],
      email_logs: [],
      sms_logs: []
    };
  }
}

// Save database to file
function saveDatabase() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Initialize database
function initializeDatabase() {
  loadDatabase();
  console.log('Database tables created successfully');
}

// Get database instance
function getDatabase() {
  return db;
}

// Generate unique booking ID
function generateBookingId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CN-${timestamp}-${random}`.toUpperCase();
}

// Database operations
const dbOperations = {
  // Bookings
  insertBooking: (booking) => {
    const newBooking = {
      id: db.bookings.length + 1,
      ...booking,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.bookings.push(newBooking);
    saveDatabase();
    return newBooking;
  },

  getBookingsByDate: (date) => {
    return db.bookings.filter(booking => 
      booking.appointment_date === date && 
      ['confirmed', 'pending'].includes(booking.status)
    );
  },

  getBookingById: (bookingId) => {
    return db.bookings.find(booking => booking.booking_id === bookingId);
  },

  updateBookingStatus: (bookingId, status) => {
    const booking = db.bookings.find(b => b.booking_id === bookingId);
    if (booking) {
      booking.status = status;
      booking.updated_at = new Date().toISOString();
      saveDatabase();
      return true;
    }
    return false;
  },

  getAllBookings: (filters = {}) => {
    let bookings = [...db.bookings];
    
    if (filters.date) {
      bookings = bookings.filter(b => b.appointment_date === filters.date);
    }
    
    if (filters.status) {
      bookings = bookings.filter(b => b.status === filters.status);
    }
    
    return bookings.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
  },

  // Customers
  insertOrUpdateCustomer: (customer) => {
    const existingIndex = db.customers.findIndex(c => c.email === customer.email);
    const customerData = {
      ...customer,
      updated_at: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      db.customers[existingIndex] = { ...db.customers[existingIndex], ...customerData };
    } else {
      customerData.id = db.customers.length + 1;
      customerData.created_at = new Date().toISOString();
      db.customers.push(customerData);
    }
    
    saveDatabase();
    return customerData;
  },

  // SMS Logs
  insertSmsLog: (smsLog) => {
    const newLog = {
      id: db.sms_logs.length + 1,
      ...smsLog,
      sent_at: new Date().toISOString()
    };
    db.sms_logs.push(newLog);
    saveDatabase();
    return newLog;
  },

  getSmsLogs: (limit = 50, offset = 0) => {
    return db.sms_logs
      .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))
      .slice(offset, offset + limit);
  },

  // Email Logs
  insertEmailLog: (emailLog) => {
    const newLog = {
      id: db.email_logs.length + 1,
      ...emailLog,
      sent_at: new Date().toISOString()
    };
    db.email_logs.push(newLog);
    saveDatabase();
    return newLog;
  },

  getEmailLogs: (limit = 50, offset = 0) => {
    return db.email_logs
      .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))
      .slice(offset, offset + limit);
  }
};

module.exports = {
  initializeDatabase,
  getDatabase,
  generateBookingId,
  dbOperations
};

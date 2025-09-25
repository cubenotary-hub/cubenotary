const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '..', 'database.sqlite');

let db;

function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        throw err;
      }
      console.log('Connected to SQLite database');
    });
  }
  return db;
}

async function initializeDatabase() {
  const database = getDatabase();
  
  return new Promise((resolve, reject) => {
    database.serialize(() => {
      // Create bookings table
      database.run(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          booking_id TEXT UNIQUE NOT NULL,
          customer_name TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          customer_phone TEXT,
          service_type TEXT NOT NULL,
          appointment_date TEXT NOT NULL,
          appointment_time TEXT NOT NULL,
          meeting_address TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          payment_status TEXT DEFAULT 'pending',
          payment_intent_id TEXT,
          amount_paid REAL DEFAULT 0,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create customers table
      database.run(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          phone TEXT,
          address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create payments table
      database.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          booking_id TEXT NOT NULL,
          stripe_payment_intent_id TEXT UNIQUE NOT NULL,
          amount REAL NOT NULL,
          currency TEXT DEFAULT 'usd',
          status TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (booking_id) REFERENCES bookings (booking_id)
        )
      `);

      // Create email_logs table
      database.run(`
        CREATE TABLE IF NOT EXISTS email_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          booking_id TEXT NOT NULL,
          email_type TEXT NOT NULL,
          recipient_email TEXT NOT NULL,
          subject TEXT NOT NULL,
          status TEXT NOT NULL,
          sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          error_message TEXT,
          FOREIGN KEY (booking_id) REFERENCES bookings (booking_id)
        )
      `);

      // Create sms_logs table
      database.run(`
        CREATE TABLE IF NOT EXISTS sms_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          booking_id TEXT NOT NULL,
          phone_number TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT NOT NULL,
          sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          error_message TEXT,
          FOREIGN KEY (booking_id) REFERENCES bookings (booking_id)
        )
      `);

      // Create indexes for better performance
      database.run(`CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(appointment_date)`);
      database.run(`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`);
      database.run(`CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email)`);
      database.run(`CREATE INDEX IF NOT EXISTS idx_payments_intent ON payments(stripe_payment_intent_id)`);

      database.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
          reject(err);
        } else {
          console.log('Database tables created successfully');
          resolve();
        }
      });
    });
  });
}

function generateBookingId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CN-${timestamp}-${random}`.toUpperCase();
}

module.exports = {
  getDatabase,
  initializeDatabase,
  generateBookingId
};

// Use JSON-based database for cloud compatibility
const { initializeDatabase, getDatabase, generateBookingId, dbOperations } = require('./jsonDb');

module.exports = {
  getDatabase,
  initializeDatabase,
  generateBookingId,
  dbOperations
};

const cron = require('node-cron');
const Loan = require('../models/Loan');
const User = require('../models/User');
const sendReminder = require('../utils/email');

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    const loans = await Loan.find({ returned: false, returnDate: { $gte: today } }).populate('userId');
    
    loans.forEach(loan => {
      const user = loan.userId;
      const dueDate = new Date(loan.returnDate);
      const daysUntilDue = (dueDate - today) / (1000 * 60 * 60 * 24);

      // Send reminder if the due date is within 3 days
      if (daysUntilDue <= 3) {
        sendReminder(user, loan.bookTitle, dueDate.toLocaleDateString());
      }
    });
  } catch (err) {
    console.error('Error in sending reminders:', err);
  }
});

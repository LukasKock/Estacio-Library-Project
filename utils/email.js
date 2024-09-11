const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendReminder = (user, bookTitle, returnDate) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Book Return Reminder',
    text: `Dear ${user.username},\n\nThis is a reminder that your loan for "${bookTitle}" is due on ${returnDate}. Please return the book by the deadline to avoid any penalties.\n\nThank you!`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendReminder;

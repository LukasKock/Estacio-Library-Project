const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Loan a book
router.post('/loan', auth, async (req, res) => {
  try {
    const { bookTitle, returnDate } = req.body;
    const loan = new Loan({
      userId: req.user.id,
      bookTitle,
      returnDate
    });
    await loan.save();
    res.status(201).json({ message: 'Book loaned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark book as returned
router.post('/return/:loanId', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.returned = true;
    await loan.save();
    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

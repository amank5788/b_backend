const User = require('../models/userModel'); // Import your User model (assuming it's defined)

// Middleware to check if email or phone number exists
const checkDuplicate = async (req, res, next) => {
  const { usertype,name,image, email,phone, password } = req.body;

  try {
    // Check if email or phone number already exists in the database
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone number already exists' });
    }

    // If email and phone number are unique, continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = checkDuplicate;

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const checkUser=require('../middleware/checkUser');
const authenticateToken=require('../middleware/checkAuth');
const authenticateAdmin=require('../middleware/checkAuthAdmin')
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', checkUser,async (req, res) => {
  const { usertype,name,image, email,phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user instance
    const newUser = new User({
      usertype,
      name,
      image,
      email,
      phone,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    
    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});




router.post('/signin', async (req, res) => {
  const {email,password } = req.body;
  try{
    
     // Check if the user exists
     const user = await User.findOne({ email });
     

     if (!user) {
       return res.status(401).json({ message: 'Invalid email or password' });
  }
  // Compare the password
  const passwordMatch = await bcrypt.compare(password, user.password);
 
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  var payload={};
 if(user.usertype==='admin'){
   payload = {
    userId: user._id,
    userType: 'admin', // Add userType or role for admin
    // Other necessary data
  };
 }
 else{
   payload = {
    userId: user._id,
    userType: 'user', // Add userType or role for admin
    // Other necessary data
  };
 }
  // If email and password are valid, generate a JWT token
  const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '5h' });

  res.status(200).json({ token });
} catch (error) {
  res.status(500).json({ error: 'Internal server error' });
}
})



router.get('/profile', authenticateToken,async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'yourSecretKey'); // Verify the token

    // Fetch user data based on the decoded user ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user data back to the frontend
    res.status(200).json({ name: user.name, image: user.image ,usertype: user.usertype,email:user.email,phone:user.phone });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});


router.get('/allusers',authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'usertype name image  email phone'); // Fetch only necessary fields
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


router.put('/profile/update', async (req, res) => {
  const { email, name, image } = req.body;
  
  console.log(email);
  try {
    // Find the user by email
   
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { name: name, image: image } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user details' });
  }
});


router.delete('/profile/delete', async (req, res) => {
  const { email } = req.body;
 console.log(email,req.body)
  try {
    // Find the user by email and delete
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found ' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;

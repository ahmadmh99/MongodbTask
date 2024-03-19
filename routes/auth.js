// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');


router.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    // Create a new user
    const newUser = new User({ username, password, email });
    if (newUser.isModified('password')) {
        newUser.password = await bcrypt.hash(newUser.password, 10);
    }
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb');
       
    // Respond with the token
    res.status(201).json({ message: 'User registered successfully' , jwtToken: token ,userId: newUser._id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ username });
  
      // Check if the user exists
      if (!user) {
        return res.status(401).json({ error: 'Invalid username' });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Wrong password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb');
  
      // Respond with the token
      res.json({ message:"logged in successfully",token:token ,userId:user._id });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  // Update user information
router.patch('/users/:userId', authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const { username, password, email } = req.body;
  
      // Check if the user is trying to update their own information
      if (userId !== req.params.userId) {
        return res.status(403).json({ error: 'Forbidden: You can only update your own information' });
      }
  
      // Find the user by email
      const user = await User.findById( userId );
  
      // Update username if provided
      if (username) {
        user.username = username;
      }
  
      // Update password if provided
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      
      if(email) {
        user.email = email
      }
      // Save the updated user
      await user.save();
  
      // Generate a new JWT token with updated user information
      const token = jwt.sign({ userId: user._id }, '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb');
  
      res.json({ token,message:"updated successfully" });
    } catch (error) {
      console.error('Error updating user information:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Delete user account
  router.delete('/users/:userId', authenticate, async (req, res) => {
    try {
      const userId = req.userId;
  
      // Check if the user is trying to delete their own account
      if (userId !== req.params.userId) {
        return res.status(403).json({ error: 'Forbidden: You can only delete your own account' });
      }
  
      // Find and remove the user by ID
      const user = await User.findOneAndDelete({ _id: userId });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
    
module.exports = router;

